from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.api.routes.reports import router as reports_router
from app.api.routes.users import router as users_router

app = FastAPI(title='SafeRoad API', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health_router, prefix='/api', tags=['health'])
app.include_router(auth_router, prefix='/api/auth', tags=['auth'])
app.include_router(users_router, prefix='/api/users', tags=['users'])
app.include_router(reports_router, prefix='/api/reports', tags=['reports'])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount('/uploads', StaticFiles(directory=str(UPLOAD_DIR)), name='uploads')


@app.get('/')
def root() -> dict[str, str]:
    return {'message': 'SafeRoad API is running'}
