from fastapi import APIRouter, UploadFile, File
from app.schemas.detection import DetectionResponse
from app.services.detection_service import DetectionService

router = APIRouter(prefix="/detection", tags=["detection"])

@router.post(
    "/detect", 
    response_model=DetectionResponse, 
    summary="Perform pothole detection", 
    description="Uploads an image, validates size and format integrity, runs YOLOv8 model inference, labels pothole severity (Low/Medium/High) by relative bounding box surface size, and returns coordinates along with the annotated image URL."
)
async def detect_potholes(image: UploadFile = File(..., description="The road image file to analyze")):
    result = DetectionService.run_detection(image)
    return result
