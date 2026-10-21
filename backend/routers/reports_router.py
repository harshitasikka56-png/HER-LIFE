"""
HER LIFE — Longitudinal Reports, Data Export & Privacy Router
"""

import csv
import io
from typing import Dict, Any
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.database import get_db, User, Cycle, DailyLog, PCOSSymptomLog, CortisolTestLog

router = APIRouter(prefix="/api/reports", tags=["Longitudinal Reports & Privacy"])


@router.get("/longitudinal")
def get_longitudinal_health_report(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    cycles = db.query(Cycle).filter(Cycle.user_id == user_id).order_by(Cycle.period_start_date.desc()).limit(12).all()
    logs = db.query(DailyLog).filter(DailyLog.user_id == user_id).order_by(DailyLog.date.desc()).limit(60).all()
    pcos = db.query(PCOSSymptomLog).filter(PCOSSymptomLog.user_id == user_id).all()
    cort = db.query(CortisolTestLog).filter(CortisolTestLog.user_id == user_id).all()

    # Calculate symptom frequencies
    symptom_counts = {
        "cramps": sum(1 for l in logs if l.cramps_severity_0_3 > 0),
        "bloating": sum(1 for l in logs if l.bloating_severity_0_3 > 0),
        "fatigue": sum(1 for l in logs if l.fatigue_severity_0_3 > 0),
        "headache": sum(1 for l in logs if l.headache_severity_0_3 > 0),
        "mood_changes": sum(1 for l in logs if l.mood_changes_severity_0_3 > 0),
        "hot_flashes": sum(1 for l in logs if l.hot_flashes_severity_0_3 > 0),
        "sleep_disturbance": sum(1 for l in logs if l.sleep_disturbance_severity_0_3 > 0),
    }

    avg_sleep = round(sum(l.sleep_hours for l in logs) / len(logs), 1) if logs else 7.0
    avg_stress = round(sum(l.stress_level_0_4 for l in logs) / len(logs), 1) if logs else 1.0

    return {
        "user_profile": {
            "full_name": user.full_name,
            "age_years": user.age_years,
            "life_stage": user.life_stage,
            "cycle_regularity": user.cycle_regularity,
            "is_demo": user.is_demo
        },
        "report_generated_date": date.today().isoformat(),
        "cycles_recorded_count": len(cycles),
        "recent_cycles": [
            {
                "start": c.period_start_date.isoformat(),
                "end": c.period_end_date.isoformat() if c.period_end_date else None,
                "length_days": c.cycle_length_days,
                "flow": c.flow_level
            }
            for c in cycles
        ],
        "symptom_frequency_last_60_days": symptom_counts,
        "lifestyle_averages": {
            "average_sleep_hours": avg_sleep,
            "average_stress_score_0_4": avg_stress
        },
        "pcos_logs_count": len(pcos),
        "cortisol_tests_count": len(cort),
        "discussion_points_for_doctor": [
            f"Review cycle length trend across the past {len(cycles)} logged cycles.",
            f"Discuss the recurrence of top reported symptoms: {', '.join([k for k, v in sorted(symptom_counts.items(), key=lambda x: x[1], reverse=True)[:3]])}.",
            "Assess whether any reported sleep disturbance coincides with hormonal fluctuations."
        ],
        "disclaimer": (
            "LONGITUDINAL REPORT DISCLAIMER: This summary is compiled from self-reported health tracking entries. "
            "Correlations between stress, sleep, and symptoms do NOT prove medical causation. "
            "This document is intended to facilitate informed discussion with your licensed healthcare provider."
        )
    }


@router.get("/export-csv")
def export_user_data_csv(user_id: str, db: Session = Depends(get_db)):
    logs = db.query(DailyLog).filter(DailyLog.user_id == user_id).order_by(DailyLog.date.asc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "date", "cycle_day", "cycle_phase", "period_day", "sleep_hours", "stress_0_4",
        "activity_0_4", "mood_0_4", "energy_0_4", "cramps_0_3", "bloating_0_3",
        "headache_0_3", "fatigue_0_3", "mood_changes_0_3", "hot_flashes_0_3",
        "sleep_disturbance_0_3", "notes", "data_origin"
    ])

    for l in logs:
        writer.writerow([
            l.date.isoformat(), l.cycle_day, l.cycle_phase, 1 if l.period_day_flag else 0,
            l.sleep_hours, l.stress_level_0_4, l.activity_level_0_4, l.mood_score_0_4,
            l.energy_score_0_4, l.cramps_severity_0_3, l.bloating_severity_0_3,
            l.headache_severity_0_3, l.fatigue_severity_0_3, l.mood_changes_severity_0_3,
            l.hot_flashes_severity_0_3, l.sleep_disturbance_severity_0_3,
            l.notes or "", l.record_source
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=her_life_health_export_{user_id}.csv"}
    )


@router.delete("/delete-account")
def delete_account(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    db.delete(user)
    db.commit()
    return {"status": "success", "message": "All personal records and account history permanently deleted."}
