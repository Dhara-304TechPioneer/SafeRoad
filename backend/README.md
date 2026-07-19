# SafeRoad Backend

This backend provides the Phase 2 foundation for SafeRoad with FastAPI, SQLAlchemy, PostgreSQL, Alembic, and JWT-based authentication.

## Features
- FastAPI application entrypoint
- PostgreSQL database connection
- SQLAlchemy ORM models and session management
- Alembic migrations
- JWT authentication for register/login/me
- Health check endpoint

## Quick start
1. Create and activate a Python virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and adjust the values.
4. Start PostgreSQL via Docker Compose: `docker compose up -d`
5. Run database migrations: `alembic upgrade head`
6. Start the API: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
