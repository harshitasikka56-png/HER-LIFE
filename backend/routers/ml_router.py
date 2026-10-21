"""
HER LIFE — Machine Learning Intelligence Endpoints Router
"""

import json
import os
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.database import get_db, User, Cycle, DailyLog
from services.ml_inference import (
    predict_next_period,
    forecast_symptoms,
    analyze_cycle_patterns,
    get_personalized_guidance
)

router = APIRouter(prefix="/api/ml", tags=["Machine Learning Intelligence"])

METRICS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "model_metrics.json"))


@router.get("/period-prediction")
def get_period_prediction(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    cycles = db.query(Cycle).filter(Cycle.user_id == user_id).order_by(Cycle.period_start_date.asc()).all()
    result = predict_next_period(user, cycles)
    return result


@router.get("/symptom-forecast")
def get_symptom_forecast(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    latest_log = db.query(DailyLog).filter(DailyLog.user_id == user_id).order_by(desc(DailyLog.date)).first()
    result = forecast_symptoms(user, latest_log)
    return result


@router.get("/cycle-patterns")
def get_cycle_patterns(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    cycles = db.query(Cycle).filter(Cycle.user_id == user_id).order_by(Cycle.period_start_date.asc()).all()
    result = analyze_cycle_patterns(cycles, user)
    return result


@router.get("/guidance")
def get_daily_guidance(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    latest_log = db.query(DailyLog).filter(DailyLog.user_id == user_id).order_by(desc(DailyLog.date)).first()
    cycle_day = getattr(latest_log, 'cycle_day', None) if latest_log else None
    
    guidance = get_personalized_guidance(user, cycle_day, {})
    return guidance


@router.get("/metrics")
def get_models_metrics():
    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, "r") as f:
                return json.load(f)
        except Exception as e:
            return {"error": str(e)}
            
    return {
        "status": "Ready",
        "dataset_name": "HER LIFE Synthetic Benchmark + FedCycle Validation Set",
        "label": "DEMO DATA — SYNTHETIC, NOT REAL PATIENT RECORDS",
        "models": ["Model A: Period Prediction (Ridge)", "Model B: Symptom Forecast (Multi-Output RF)"]
    }
