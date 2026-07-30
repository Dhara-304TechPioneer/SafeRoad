# SafeRoad AI Microservice

This microservice provides AI detection capabilities for road hazards and potholes, powered by FastAPI and Uvicorn.

## Features
- FastAPI Web Framework
- CORS Configured
- Root status check (`GET /`)
- System health checks (`GET /health`)
- Temporary uploads directory for processing images
- Placeholder API routes for future YOLO pothole detections

## Setup and Running

1. **Activate Virtual Environment**:
   It is recommended to run in a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (cmd):
   venv\Scripts\activate
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Development Server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8001
   ```
   The API will be available at `http://localhost:8001`.
   FastAPI interactive documentation is accessible at `http://localhost:8001/docs`.

## Pothole Detection Model Status (`models/best.pt`)

- **Current Weights Source**: [`PeterHdd/pothole-detection-yolo`](https://github.com/PeterHdd/pothole-detection-yolo) (YOLOv8 fine-tuned for 100 epochs).
- **License Status**: **Apache License 2.0** (Permissive open-source license, safe for open distribution and commercial use with attribution).
- **Evaluation Performance** (Evaluated on 263 held-out IVCNZ test images):
  - **Precision (P)**: 55.37% (vs. Stock COCO baseline: 1.63%)
  - **Recall (R)**: 33.38% (vs. Stock COCO baseline: 8.56%)
  - **mAP@50**: 35.16% (vs. Stock COCO baseline: 0.17%)
  - **mAP@50-95**: 13.94% (vs. Stock COCO baseline: 0.07%)

> **Note**: This model is currently serving as an interim baseline while our custom fine-tuned weights are being trained using `pothole_yolo_colab.ipynb` on GPU.

## Training Custom Weights with Google Colab / Kaggle

1. Open [`pothole_yolo_colab.ipynb`](pothole_yolo_colab.ipynb) in Google Colab or Kaggle.
2. Select a GPU runtime (e.g., T4 GPU).
3. Execute all cells sequentially (Section 1 through Section 6).
4. Download the resulting `best.pt` file from Colab and place it at `ai-service/models/best.pt` to replace the interim baseline model.
