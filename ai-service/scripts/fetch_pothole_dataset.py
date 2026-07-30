import os
import sys
import shutil
import zipfile
import urllib.request
import random
from pathlib import Path

DATASET_URL = "https://github.com/jaygala24/pothole-detection/releases/download/v1.0.0/Pothole.Dataset.IVCNZ.zip"

def fetch_and_prepare_pothole_dataset(val_split: float = 0.2, seed: int = 42):
    """
    Downloads the real IVCNZ Pothole Dataset (1,243 real annotated road images),
    splits it into train/val subsets, and generates data.yaml for YOLOv8 training.
    """
    script_dir = Path(__file__).resolve().parent
    ai_service_dir = script_dir.parent
    dataset_dir = ai_service_dir / "dataset"
    
    train_img_dir = dataset_dir / "images" / "train"
    val_img_dir = dataset_dir / "images" / "val"
    train_lbl_dir = dataset_dir / "labels" / "train"
    val_lbl_dir = dataset_dir / "labels" / "val"
    
    # Create directories
    for d in [train_img_dir, val_img_dir, train_lbl_dir, val_lbl_dir]:
        d.mkdir(parents=True, exist_ok=True)

    # Write data.yaml configuration
    yaml_content = f"""path: {dataset_dir.as_posix()}
train: images/train
val: images/val

names:
  0: pothole
"""
    with open(dataset_dir / "data.yaml", "w", encoding="utf-8") as f:
        f.write(yaml_content)

    print(f"[+] Dataset structure configured at: {dataset_dir}")
    print(f"[+] dataset/data.yaml created successfully.")

    # Check if dataset already has images
    existing_train_imgs = list(train_img_dir.glob("*.jpg")) + list(train_img_dir.glob("*.png"))
    if len(existing_train_imgs) >= 100:
        print(f"[OK] Found existing dataset with {len(existing_train_imgs)} training images in {train_img_dir}. Skipping download.")
        return

    temp_zip = ai_service_dir / "pothole_dataset.zip"
    extract_dir = ai_service_dir / "temp_pothole_extract"

    try:
        if not temp_zip.exists():
            print(f"[+] Downloading real pothole dataset from:\n    {DATASET_URL}")
            def _progress(block_num, block_size, total_size):
                downloaded = block_num * block_size
                if total_size > 0:
                    percent = min(100.0, downloaded / total_size * 100.0)
                    sys.stdout.write(f"\rDownloading: {percent:.1f}% ({downloaded // (1024*1024)}MB / {total_size // (1024*1024)}MB)")
                    sys.stdout.flush()

            urllib.request.urlretrieve(DATASET_URL, temp_zip, _progress)
            print("\n[+] Download complete.")

        print(f"[+] Extracting dataset archive...")
        with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)

        # Collect image and label file pairs
        raw_files = list(extract_dir.rglob("*.jpg")) + list(extract_dir.rglob("*.png"))
        image_label_pairs = []

        for img_p in raw_files:
            txt_p = img_p.with_suffix(".txt")
            if txt_p.exists():
                image_label_pairs.append((img_p, txt_p))

        print(f"[+] Found {len(image_label_pairs)} valid image-label pairs.")

        if len(image_label_pairs) == 0:
            raise ValueError("No valid image-label pairs found in extracted archive.")

        # Shuffle deterministically
        random.seed(seed)
        random.shuffle(image_label_pairs)

        num_val = int(len(image_label_pairs) * val_split)
        val_pairs = image_label_pairs[:num_val]
        train_pairs = image_label_pairs[num_val:]

        print(f"[+] Splitting dataset into {len(train_pairs)} training samples and {len(val_pairs)} validation samples...")

        # Copy files to target YOLO directories
        for img_p, txt_p in train_pairs:
            shutil.copy(img_p, train_img_dir / img_p.name)
            shutil.copy(txt_p, train_lbl_dir / txt_p.name)

        for img_p, txt_p in val_pairs:
            shutil.copy(img_p, val_img_dir / img_p.name)
            shutil.copy(txt_p, val_lbl_dir / txt_p.name)

        print(f"[SUCCESS] Dataset prepared successfully!")
        print(f"  - Train: {len(train_pairs)} images -> {train_img_dir}")
        print(f"  - Val:   {len(val_pairs)} images -> {val_img_dir}")

    except Exception as e:
        print(f"[!] Error downloading/preparing real dataset: {e}")
        print("[!] Falling back to local/existing files if present.")
    finally:
        # Clean up temporary files
        if extract_dir.exists():
            shutil.rmtree(extract_dir, ignore_errors=True)
        if temp_zip.exists():
            temp_zip.unlink(missing_ok=True)
        if (ai_service_dir / "pothole_test.zip").exists():
            (ai_service_dir / "pothole_test.zip").unlink(missing_ok=True)

if __name__ == "__main__":
    fetch_and_prepare_pothole_dataset()

