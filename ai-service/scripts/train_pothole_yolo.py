"""
SafeRoad Pothole Detection Model Training Script
================================================
This script trains a YOLOv8 model (yolov8s.pt / yolov8n.pt) on the pothole dataset
in `ai-service/dataset/` and saves the trained weights to `ai-service/models/best.pt`.

Optimized Hyperparameters for Pothole Detection:
- Architecture: YOLOv8s (Small) or YOLOv8n (Nano)
- Resolution: 640x640 (preserves small defect features)
- Augmentations: Mosaic (1.0), Scale jitter (0.5), Rotation (10 deg), HSV color jitter
- Early Stopping: Patience = 10 epochs
"""

import os
import shutil
import argparse
from pathlib import Path
from ultralytics import YOLO

def train_pothole_model(
    model_name: str = "yolov8s.pt",
    epochs: int = 30,
    imgsz: int = 640,
    batch: int = 8,
    patience: int = 10,
):
    root_dir = Path(__file__).resolve().parents[1]
    dataset_yaml = root_dir / "dataset" / "data.yaml"
    output_models_dir = root_dir / "models"
    output_models_dir.mkdir(exist_ok=True)
    target_best_pt = output_models_dir / "best.pt"

    print("==================================================")
    print("      SafeRoad YOLOv8 Pothole Model Trainer       ")
    print("==================================================")

    if not dataset_yaml.exists():
        print(f"[!] Dataset yaml not found at: {dataset_yaml}")
        print("\nPlease run the dataset fetch script first:")
        print("  python scripts/fetch_pothole_dataset.py\n")
        return

    print(f"[+] Found dataset configuration at: {dataset_yaml}")
    print(f"[+] Initializing base model ({model_name})...")
    model = YOLO(model_name)

    print(f"[+] Starting training for {epochs} epochs (imgsz={imgsz}, batch={batch}, patience={patience})...")
    results = model.train(
        data=str(dataset_yaml),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        patience=patience,
        name="pothole_yolov8",
        project=str(root_dir / "runs"),
        exist_ok=True,
        # Small-object detection hyperparameters & augmentations
        mosaic=1.0,        # Combines 4 images, forces multi-scale small defect learning
        mixup=0.1,         # Blends images to improve generalization
        degrees=10.0,      # Slight rotation jitter
        scale=0.5,         # Scale jitter (0.5 - 1.5x)
        fliplr=0.5,        # Horizontal flip
        hsv_h=0.015,       # Hue jitter
        hsv_s=0.7,         # Saturation jitter
        hsv_v=0.4,         # Brightness jitter
        save=True,
        plots=True,
    )

    best_weights = root_dir / "runs" / "pothole_yolov8" / "weights" / "best.pt"
    if best_weights.exists():
        shutil.copy(best_weights, target_best_pt)
        print(f"\n[SUCCESS] Model training complete! Saved best model weights to: {target_best_pt}")
    else:
        print("\n[!] Training finished but best weights file was not found.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLOv8 Pothole Detection Model")
    parser.add_argument("--model", type=str, default="yolov8s.pt", help="Base model (yolov8n.pt, yolov8s.pt, yolov8m.pt)")
    parser.add_argument("--epochs", type=int, default=30, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    parser.add_argument("--batch", type=int, default=8, help="Batch size")
    parser.add_argument("--patience", type=int, default=10, help="Early stopping patience")
    args = parser.parse_args()

    train_pothole_model(
        model_name=args.model,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        patience=args.patience,
    )

