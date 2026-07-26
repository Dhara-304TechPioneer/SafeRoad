import os
import cv2
import numpy as np
from pathlib import Path

def generate_pothole_dataset():
    dataset_dir = Path(__file__).resolve().parents[1] / "dataset"
    dataset_dir.mkdir(exist_ok=True)
    
    (dataset_dir / "images" / "train").mkdir(parents=True, exist_ok=True)
    (dataset_dir / "images" / "val").mkdir(parents=True, exist_ok=True)
    (dataset_dir / "labels" / "train").mkdir(parents=True, exist_ok=True)
    (dataset_dir / "labels" / "val").mkdir(parents=True, exist_ok=True)

    yaml_content = f"""path: {dataset_dir.as_posix()}
train: images/train
val: images/val

names:
  0: pothole
"""
    with open(dataset_dir / "data.yaml", "w", encoding="utf-8") as f:
        f.write(yaml_content)

    print(f"[+] Configured dataset structure at {dataset_dir}")

    # Generate 15 distinct road images with pothole annotations for training
    np.random.seed(42)
    img_w, img_h = 640, 480

    for i in range(1, 16):
        # Create dark asphalt road texture
        road_img = np.random.randint(60, 90, (img_h, img_w, 3), dtype=np.uint8)
        
        # Add road lane markings
        cv2.line(road_img, (img_w // 2, 0), (img_w // 2, img_h), (200, 200, 200), 5)
        
        # Generate pothole coordinates
        cx_rel = np.random.uniform(0.3, 0.7)
        cy_rel = np.random.uniform(0.3, 0.7)
        w_rel = np.random.uniform(0.15, 0.35)
        h_rel = np.random.uniform(0.15, 0.30)
        
        cx, cy = int(cx_rel * img_w), int(cy_rel * img_h)
        axes_w, axes_h = int(w_rel * img_w / 2), int(h_rel * img_h / 2)
        
        # Draw dark crater ellipse (pothole)
        cv2.ellipse(road_img, (cx, cy), (axes_w, axes_h), np.random.randint(0, 45), 0, 360, (20, 20, 20), -1)
        cv2.ellipse(road_img, (cx, cy), (int(axes_w * 1.1), int(axes_h * 1.1)), np.random.randint(0, 45), 0, 360, (40, 40, 40), 2)
        
        filename = f"pothole_{i:02d}.jpg"
        label_filename = f"pothole_{i:02d}.txt"
        
        # Save images
        cv2.imwrite(str(dataset_dir / "images" / "train" / filename), road_img)
        cv2.imwrite(str(dataset_dir / "images" / "val" / filename), road_img)
        
        # Write YOLO label (<class> <x_center> <y_center> <width> <height>)
        label_text = f"0 {cx_rel:.4f} {cy_rel:.4f} {w_rel:.4f} {h_rel:.4f}\n"
        with open(dataset_dir / "labels" / "train" / label_filename, "w") as f:
            f.write(label_text)
        with open(dataset_dir / "labels" / "val" / label_filename, "w") as f:
            f.write(label_text)

    print("[OK] Successfully generated 15 annotated pothole dataset samples with YOLO labels.")


if __name__ == "__main__":
    generate_pothole_dataset()
