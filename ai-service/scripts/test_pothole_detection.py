import os
import sys
import requests
import json
from pathlib import Path

# Ensure ai-service root is in sys.path
ai_service_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ai_service_dir))

from fastapi import UploadFile
from app.services.detection_service import DetectionService

from starlette.datastructures import Headers

def test_detection_service_and_api():
    url = "http://127.0.0.1:8001/api/detection/detect"
    dataset_val_dir = ai_service_dir / "dataset" / "images" / "val"
    
    # Pick first 3 images from validation set
    test_image_paths = list(dataset_val_dir.glob("*.jpg"))[:3]
    if not test_image_paths:
        test_image_paths = list(dataset_val_dir.glob("*.png"))[:3]

    print("==================================================")
    print("       SafeRoad AI Detection Pipeline Test        ")
    print("==================================================")

    if not test_image_paths:
        print(f"[!] No validation images found in: {dataset_val_dir}")
        return

    # Check if API server is listening
    server_online = False
    try:
        r = requests.get("http://127.0.0.1:8001/health", timeout=1)
        if r.status_code == 200:
            server_online = True
    except Exception:
        server_online = False

    print(f"[+] Detection Mode: {'HTTP API (Server Online)' if server_online else 'Direct Python Service'}")

    for img_path in test_image_paths:
        filename = img_path.name
        print(f"\n[+] Testing detection on image: {filename}")

        if server_online:
            with open(img_path, "rb") as f:
                files = {"image": (filename, f, "image/jpeg")}
                response = requests.post(url, files=files)
                print(f"  HTTP Status: {response.status_code}")
                print("  Detection Result JSON:")
                print(json.dumps(response.json(), indent=2))
        else:
            with open(img_path, "rb") as f:
                upload_file = UploadFile(filename=filename, file=f, headers=Headers({"content-type": "image/jpeg"}))
                result = DetectionService.run_detection(upload_file)
                print("  Service Detection Result:")
                print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_detection_service_and_api()

