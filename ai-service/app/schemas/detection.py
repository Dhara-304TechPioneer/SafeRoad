from pydantic import BaseModel, Field

class DetectionDetail(BaseModel):
    class_name: str = Field(..., description="The name of the detected class, e.g., Pothole")
    confidence: float = Field(..., description="The confidence score of the detection, between 0.0 and 1.0")
    box: list[float] = Field(..., description="Bounding box coordinates in pixels [x1, y1, x2, y2]")
    center: list[float] = Field(..., description="Center coordinates in pixels [cx, cy]")
    severity: str = Field(..., description="Estimated severity of the pothole: Low, Medium, High")

class DetectionResponse(BaseModel):
    success: bool = Field(..., description="True if inference executed successfully")
    processing_time: float = Field(..., description="Time taken to process the image in seconds")
    width: int = Field(..., description="Width of the input image in pixels")
    height: int = Field(..., description="Height of the input image in pixels")
    total_detections: int = Field(..., description="Total count of hazards detected")
    detections: list[DetectionDetail] = Field(..., description="List of individual detection details")
    annotated_image_path: str | None = Field(None, description="Static relative path serving the annotated image output")
    error: str | None = Field(None, description="Detailed error explanation in case success is False")
