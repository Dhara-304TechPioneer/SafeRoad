"""
SafeRoad Pothole Model Evaluation & Comparison Script
=====================================================
Evaluates fine-tuned `models/best.pt` against stock COCO `yolov8n.pt` baseline
on the held-out validation set in `dataset/data.yaml`.
Also runs sample detections via DetectionService.
"""

import os
import sys
from pathlib import Path
from ultralytics import YOLO

# Add parent directory to sys.path to import app modules
ai_service_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ai_service_dir))

def evaluate_models():
    dataset_yaml = ai_service_dir / "dataset" / "data.yaml"
    custom_model_path = ai_service_dir / "models" / "best.pt"

    print("==================================================")
    print("   SafeRoad Pothole Detection Model Evaluator     ")
    print("==================================================")

    if not dataset_yaml.exists():
        print(f"[!] Validation dataset config not found at: {dataset_yaml}")
        return

    if not custom_model_path.exists():
        print(f"[!] Fine-tuned model not found at: {custom_model_path}")
        print("    Please run train_pothole_yolo.py first.")
        return

    # 1. Evaluate Fine-Tuned Model (best.pt)
    print("\n[+] 1. Evaluating Fine-Tuned Pothole Model (best.pt)...")
    model_ft = YOLO(str(custom_model_path))
    val_results_ft = model_ft.val(data=str(dataset_yaml), split="val", imgsz=640, verbose=False)

    p_ft = val_results_ft.results_dict.get("metrics/precision(B)", 0.0)
    r_ft = val_results_ft.results_dict.get("metrics/recall(B)", 0.0)
    map50_ft = val_results_ft.results_dict.get("metrics/mAP50(B)", 0.0)
    map50_95_ft = val_results_ft.results_dict.get("metrics/mAP50-95(B)", 0.0)

    print("\n--------------------------------------------------")
    print(" FINE-TUNED MODEL (models/best.pt) RESULTS:")
    print(f"  - Precision (P):   {p_ft * 100:.2f}%")
    print(f"  - Recall (R):      {r_ft * 100:.2f}%")
    print(f"  - mAP@50:          {map50_ft * 100:.2f}%")
    print(f"  - mAP@50-95:       {map50_95_ft * 100:.2f}%")
    print("--------------------------------------------------")

    # 2. Evaluate Baseline COCO Model (yolov8n.pt) for Comparison
    print("\n[+] 2. Evaluating COCO Pretrained Baseline (yolov8n.pt)...")
    model_coco = YOLO("yolov8n.pt")
    val_results_coco = model_coco.val(data=str(dataset_yaml), split="val", imgsz=640, verbose=False)

    p_coco = val_results_coco.results_dict.get("metrics/precision(B)", 0.0)
    r_coco = val_results_coco.results_dict.get("metrics/recall(B)", 0.0)
    map50_coco = val_results_coco.results_dict.get("metrics/mAP50(B)", 0.0)
    map50_95_coco = val_results_coco.results_dict.get("metrics/mAP50-95(B)", 0.0)

    print("\n--------------------------------------------------")
    print(" COCO BASELINE MODEL (yolov8n.pt) RESULTS:")
    print(f"  - Precision (P):   {p_coco * 100:.2f}%")
    print(f"  - Recall (R):      {r_coco * 100:.2f}%")
    print(f"  - mAP@50:          {map50_coco * 100:.2f}%")
    print(f"  - mAP@50-95:       {map50_95_coco * 100:.2f}%")
    print("--------------------------------------------------")

    # Summary comparison
    print("\n==================================================")
    print("              MODEL COMPARISON SUMMARY            ")
    print("==================================================")
    print(f" Metric        | COCO Fallback | Fine-Tuned Model | Improvement")
    print(f" --------------+---------------+------------------+------------")
    print(f" Precision (P) | {p_coco*100:11.2f}% | {p_ft*100:14.2f}% | +{(p_ft-p_coco)*100:.2f}%")
    print(f" Recall (R)    | {r_coco*100:11.2f}% | {r_ft*100:14.2f}% | +{(r_ft-r_coco)*100:.2f}%")
    print(f" mAP@50        | {map50_coco*100:11.2f}% | {map50_ft*100:14.2f}% | +{(map50_ft-map50_coco)*100:.2f}%")
    print(f" mAP@50-95     | {map50_95_coco*100:11.2f}% | {map50_95_ft*100:14.2f}% | +{(map50_95_ft-map50_95_coco)*100:.2f}%")
    print("==================================================")

    # 3. Sanity-check sample detections on validation images
    val_images_dir = ai_service_dir / "dataset" / "images" / "val"
    sample_images = list(val_images_dir.glob("*.jpg"))[:3]

    if sample_images:
        print("\n[+] 3. Sanity-checking sample detections using fine-tuned model:")
        for img_path in sample_images:
            res = model_ft(str(img_path), conf=0.25, verbose=False)[0]
            num_det = len(res.boxes)
            print(f"\n Image: {img_path.name}")
            print(f"   Detections count: {num_det}")
            for box in res.boxes:
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                cls_name = model_ft.names[cls_id]
                coords = [round(float(c), 1) for c in box.xyxy[0].tolist()]
                print(f"    -> Class: {cls_name}, Conf: {conf:.2f}, Box: {coords}")

if __name__ == "__main__":
    evaluate_models()
