FROM python:3.11-slim

# Install system dependencies required for OpenCV and YOLO
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure models and uploads directories exist
RUN mkdir -p models uploads \
    && useradd --system --uid 10001 --create-home saferoad \
    && chown -R saferoad:saferoad /app

EXPOSE 8001

USER saferoad

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
