"""
HER LIFE — FastAPI Application
AI-Powered Women's Lifetime Health Companion
Tagline: "Every Stage. Every Cycle. Every You."
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from models.database import init_db
from seed_data import seed_database
from routers import (
    auth_router,
    cycles_router,
    daily_router,
    pcos_router,
    stress_router,
    ml_router,
    ai_router,
    reports_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed demo personas exist
    print("Initializing HER LIFE database and verifying synthetic demo data...")
    init_db()
    seed_database()
    yield
    print("Shutting down HER LIFE backend.")


app = FastAPI(
    title="HER LIFE — Women's Lifetime Health Companion API",
    description="Full-stack AI-powered health intelligence platform supporting all life stages.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup for Vite frontend (typically localhost:5173, localhost:3000, 127.0.0.1)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(cycles_router.router)
app.include_router(daily_router.router)
app.include_router(pcos_router.router)
app.include_router(stress_router.router)
app.include_router(ml_router.router)
app.include_router(ai_router.router)
app.include_router(reports_router.router)


@app.get("/")
def root():
    return {
        "app_name": "HER LIFE",
        "tagline": "Every Stage. Every Cycle. Every You.",
        "status": "online",
        "version": "1.0.0",
        "disclaimer": "HER LIFE provides educational health tracking and machine learning insights. It is not a substitute for professional medical advice or clinical diagnosis."
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "her-life-backend"}
