"""
SafeRoad Pothole Detection Model Training Script
================================================
This script trains a lightweight YOLOv8 model (yolov8n.pt) on a public pothole dataset
and saves the trained weights to `ai-service/models/best.pt`.

Public Dataset Recommendation:
------------------------------
1. Roboflow Universe - Pothole Detection v2:
   https://universe.roboflow.com/roboflow-100/pothole-detection-v2
   Format: YOLOv8 PyTorch

2. Kaggle - Pothole Detection Dataset:
   https://www.kaggle.com/datasets/siddharthkumarsah/pothole-detection-dataset

Usage Instructions:
-------------------
1. Download and extract dataset to `ai-service/dataset/` so that `dataset/data.yaml` exists.
2. Install dependencies:
   pip install ultralytics roboflow
3. Run training:
   python scripts/train_pothole_yolo.py
"""

import os
import shutil
from pathlib import Path
from ultralytics import YOLO

def train_pothole_model():
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
        print("\nPlease follow these steps to prepare your dataset:")
        print(" 1. Register / download dataset from Roboflow Universe:")
        print("    https://universe.roboflow.com/roboflow-100/pothole-detection-v2")
        print(" 2. Export in 'YOLOv8' format.")
        print(" 3. Extract contents into: ", root_dir / "dataset")
        print(" 4. Re-run this training script.\n")

        print("Or run with Roboflow API key:")
        print("  from roboflow import Roboflow")
        print("  rf = Roboflow(api_key='YOUR_API_KEY')")
        print("  project = rf.workspace('roboflow-100').project('pothole-detection-v2')")
        print("  dataset = project.download('yolov8', location=str(root_dir / 'dataset'))")
        return

    print(f"[+] Found dataset configuration at: {dataset_yaml}")
    print("[+] Initializing YOLOv8 Nano base model...")
    model = YOLO("yolov8n.pt")

    print("[+] Starting training (5 epochs)...")
    results = model.train(
        data=str(dataset_yaml),
        epochs=5,
        imgsz=640,
        batch=4,
        name="pothole_yolov8n",
        project=str(root_dir / "runs"),
        exist_ok=True,
    )


    best_weights = root_dir / "runs" / "pothole_yolov8n" / "weights" / "best.pt"
    if best_weights.exists():
        shutil.copy(best_weights, target_best_pt)
        print(f"\n[SUCCESS] Model training complete! Saved best model weights to: {target_best_pt}")
    else:
        print("\n[!] Training finished but best weights file was not found.")

if __name__ == "__main__":
    train_pothole_model()
