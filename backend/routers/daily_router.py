"""
HER LIFE — Daily Check-in & Symptom Logging Router
"""

import uuid
from typing import List, Optional
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.database import get_db, DailyLog, User, Cycle
from schemas.schemas import DailyLogCreate, DailyLogResponse

router = APIRouter(prefix="/api/daily", tags=["Daily Check-in & Symptoms"])


@router.get("/today", response_model=DailyLogResponse)
def get_or_init_today_log(user_id: str, db: Session = Depends(get_db)):
    today = date.today()
    log = db.query(DailyLog).filter(DailyLog.user_id == user_id, DailyLog.date == today).first()
    if not log:
        # Check last cycle to estimate current cycle day
        last_cycle = db.query(Cycle).filter(
            Cycle.user_id == user_id,
            Cycle.period_start_date <= today
        ).order_by(desc(Cycle.period_start_date)).first()

        cycle_day = None
        phase = None
        if last_cycle and last_cycle.period_start_date:
            cycle_day = (today - last_cycle.period_start_date).days + 1
            if cycle_day <= 5:
                phase = "menstrual"
            elif cycle_day <= 13:
                phase = "follicular"
            elif cycle_day <= 16:
                phase = "ovulatory"
            else:
                phase = "luteal"

        log = DailyLog(
            id=f"log_{user_id}_{today.isoformat()}",
            user_id=user_id,
            date=today,
            cycle_day=cycle_day,
            cycle_phase=phase,
            period_day_flag=(cycle_day is not None and cycle_day <= 5),
            sleep_hours=7.0,
            stress_level_0_4=1,
            activity_level_0_4=2,
            mood_score_0_4=2,
            energy_score_0_4=2,
            workload_0_4=2,
            hydration_glasses=6,
            caffeine_cups=1,
            record_source="INITIALIZED_DEFAULT"
        )
        db.add(log)
        db.commit()
        db.refresh(log)

    return log


@router.get("/recent", response_model=List[DailyLogResponse])
def get_recent_daily_logs(user_id: str, days: int = 30, db: Session = Depends(get_db)):
    cutoff = date.today() - timedelta(days=days)
    logs = db.query(DailyLog).filter(
        DailyLog.user_id == user_id,
        DailyLog.date >= cutoff
    ).order_by(DailyLog.date.asc()).all()
    return logs


@router.post("", response_model=DailyLogResponse)
def upsert_daily_log(user_id: str, log_in: DailyLogCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    log = db.query(DailyLog).filter(
        DailyLog.user_id == user_id,
        DailyLog.date == log_in.date
    ).first()

    # Determine cycle day from previous cycle start
    last_cycle = db.query(Cycle).filter(
        Cycle.user_id == user_id,
        Cycle.period_start_date <= log_in.date
    ).order_by(desc(Cycle.period_start_date)).first()

    cycle_day = None
    phase = None
    if last_cycle and last_cycle.period_start_date:
        cycle_day = (log_in.date - last_cycle.period_start_date).days + 1
        if cycle_day <= 5:
            phase = "menstrual"
        elif cycle_day <= 13:
            phase = "follicular"
        elif cycle_day <= 16:
            phase = "ovulatory"
        else:
            phase = "luteal"

    if not log:
        log = DailyLog(
            id=f"log_{user_id}_{log_in.date.isoformat()}",
            user_id=user_id,
            date=log_in.date,
            cycle_day=cycle_day,
            cycle_phase=phase,
            record_source="USER_ENTERED"
        )
        db.add(log)

    # Update fields
    log.period_day_flag = log_in.period_day_flag
    log.sleep_hours = log_in.sleep_hours
    log.stress_level_0_4 = log_in.stress_level_0_4
    log.activity_level_0_4 = log_in.activity_level_0_4
    log.mood_score_0_4 = log_in.mood_score_0_4
    log.energy_score_0_4 = log_in.energy_score_0_4
    log.workload_0_4 = log_in.workload_0_4
    log.hydration_glasses = log_in.hydration_glasses
    log.caffeine_cups = log_in.caffeine_cups
    
    log.cramps_severity_0_3 = log_in.cramps_severity_0_3
    log.bloating_severity_0_3 = log_in.bloating_severity_0_3
    log.headache_severity_0_3 = log_in.headache_severity_0_3
    log.fatigue_severity_0_3 = log_in.fatigue_severity_0_3
    log.mood_changes_severity_0_3 = log_in.mood_changes_severity_0_3
    log.hot_flashes_severity_0_3 = log_in.hot_flashes_severity_0_3
    log.sleep_disturbance_severity_0_3 = log_in.sleep_disturbance_severity_0_3
    log.pelvic_pain_severity_0_3 = log_in.pelvic_pain_severity_0_3
    
    log.basal_temp_c = log_in.basal_temp_c
    log.cervical_mucus = log_in.cervical_mucus
    log.notes = log_in.notes
    log.record_source = "USER_ENTERED"

    db.commit()
    db.refresh(log)
    return log
