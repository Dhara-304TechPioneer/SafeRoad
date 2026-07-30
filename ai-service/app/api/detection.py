import hmac
import os

from fastapi import APIRouter, UploadFile, File, Header, HTTPException, status
from app.schemas.detection import DetectionResponse
from app.services.detection_service import DetectionService

router = APIRouter(prefix="/detection", tags=["detection"])

@router.post(
    "/detect", 
    response_model=DetectionResponse, 
    summary="Perform pothole detection", 
    description="Uploads an image, validates size and format integrity, runs YOLOv8 model inference, labels pothole severity (Low/Medium/High) by relative bounding box surface size, and returns coordinates along with the annotated image URL."
)
async def detect_potholes(
    image: UploadFile = File(..., description="The road image file to analyze"),
    x_internal_api_key: str | None = Header(default=None),
):
    expected_key = os.getenv("AI_INTERNAL_API_KEY")
    if not expected_key or not x_internal_api_key or not hmac.compare_digest(x_internal_api_key, expected_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key",
        )

    result = DetectionService.run_detection(image)
    return result
