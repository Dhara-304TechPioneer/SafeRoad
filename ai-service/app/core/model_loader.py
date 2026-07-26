import os
import logging
from ultralytics import YOLO

logger = logging.getLogger("uvicorn.error")

class YOLOModelLoader:
    _model = None
    _is_loaded = False
    _model_name = "yolov8n.pt"

    @classmethod
    def get_model(cls) -> YOLO | None:
        if cls._is_loaded:
            return cls._model

        # 1. Look for custom fine-tuned pothole model at ai-service/models/best.pt
        custom_model_path = os.path.join(os.getcwd(), "models", "best.pt")
        
        if os.path.exists(custom_model_path):
            try:
                logger.info(f"[AI Service] Loading custom YOLO model from {custom_model_path}...")
                cls._model = YOLO(custom_model_path)
                cls._model_name = "best.pt"
                cls._is_loaded = True
                logger.info("[AI Service] Custom YOLO model (best.pt) loaded successfully.")
                return cls._model
            except Exception as e:
                logger.error(f"[AI Service] Failed to load custom model from {custom_model_path}: {e}")

        # 2. Fall back to standard pretrained YOLOv8 model for functional end-to-end pipeline
        try:
            logger.info("[AI Service] Custom 'models/best.pt' not found. Wiring pretrained 'yolov8n.pt' as active AI model...")
            cls._model = YOLO("yolov8n.pt")
            cls._model_name = "yolov8n.pt"
            cls._is_loaded = True
            logger.info("[AI Service] Pretrained YOLOv8 model (yolov8n.pt) loaded successfully.")
        except Exception as e:
            logger.error(f"[AI Service] Failed to load fallback YOLO model: {e}")
            cls._model = None
            cls._is_loaded = True

        return cls._model

    @classmethod
    def get_model_name(cls) -> str:
        return cls._model_name

