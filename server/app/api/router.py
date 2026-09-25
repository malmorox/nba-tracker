from fastapi import APIRouter

from app.api.routes import teams

api_router = APIRouter()
api_router.include_router(teams.router)