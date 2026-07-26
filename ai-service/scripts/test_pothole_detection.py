import requests
import json
from pathlib import Path

def test_detection_api():
    url = "http://127.0.0.1:8001/api/detection/detect"
    dataset_dir = Path(__file__).resolve().parents[1] / "dataset" / "images" / "train"
    
    test_images = ["pothole_01.jpg", "pothole_02.jpg", "pothole_03.jpg"]
    
    print("==================================================")
    print("       SafeRoad AI Detection Endpoint Test        ")
    print("==================================================")
    
    for filename in test_images:
        img_path = dataset_dir / filename
        if not img_path.exists():
            print(f"[!] Test image missing: {img_path}")
            continue
            
        print(f"\n[+] Testing detection on image: {filename}")
        with open(img_path, "rb") as f:
            files = {"image": (filename, f, "image/jpeg")}
            response = requests.post(url, files=files)


            
        print(f"HTTP Status: {response.status_code}")
        print("Detection Result JSON:")
        print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    test_detection_api()
