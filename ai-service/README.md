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
