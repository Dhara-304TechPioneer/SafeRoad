from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from app.api.detection import router as detection_router

app = FastAPI(
    title="SafeRoad AI Microservice",
    description="FastAPI AI service for automated road damage diagnostics",
    version="1.0.0"
)

# Mount static serving directory for annotated output image assets
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS for React frontend and Node.js backend accessibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "SafeRoad AI",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }

from fastapi import File, UploadFile
from app.services.detection_service import DetectionService

@app.post("/detect")
async def detect_potholes_legacy(image: UploadFile = File(..., description="The road image file to analyze")):
    result = DetectionService.run_detection(image)
    detected = result.get("total_detections", 0) > 0
    detections = result.get("detections", [])
    primary = detections[0] if detections else None
    return {
        "detected": detected,
        "confidence": primary["confidence"] if primary else 0.0,
        "boundingBox": primary["box"] if primary else [],
        "severity": primary["severity"] if primary else "Low"
    }

# Mount sub-routers under /api prefix
app.include_router(detection_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
