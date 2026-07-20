import os
import logging
from ultralytics import YOLO

logger = logging.getLogger("uvicorn.error")

class YOLOModelLoader:
    _model = None
    _is_loaded = False

    @classmethod
    def get_model(cls) -> YOLO | None:
        if cls._is_loaded:
            return cls._model

        # Look for model inside a root-level models folder
        model_path = path = os.path.join(process_cwd := os.getcwd(), "models", "best.pt")
        
        if not os.path.exists(model_path):
            logger.error(f"YOLO model weights not found at {model_path}. Detection services will return errors.")
            cls._model = None
            cls._is_loaded = True
            return None

        try:
            logger.info(f"Loading YOLO model from {model_path}...")
            cls._model = YOLO(model_path)
            cls._is_loaded = True
            logger.info("YOLO model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            cls._model = None
            cls._is_loaded = True

        return cls._model
