"""
HER LIFE — PCOS Awareness Center Router
Educational, non-diagnostic symptom monitoring and doctor appointment prep.
"""

import uuid
from typing import List, Dict, Any
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.database import get_db, PCOSSymptomLog, User
from schemas.schemas import PCOSLogCreate, PCOSLogResponse

router = APIRouter(prefix="/api/pcos", tags=["PCOS Awareness Center"])


@router.get("/logs", response_model=List[PCOSLogResponse])
def get_pcos_logs(user_id: str, db: Session = Depends(get_db)):
    logs = db.query(PCOSSymptomLog).filter(PCOSSymptomLog.user_id == user_id).order_by(desc(PCOSSymptomLog.date)).all()
    return logs


@router.post("/logs", response_model=PCOSLogResponse)
def add_pcos_log(user_id: str, log_in: PCOSLogCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    log_date = log_in.date or date.today()
    log = PCOSSymptomLog(
        id=f"pcos_{uuid.uuid4().hex[:12]}",
        user_id=user_id,
        date=log_date,
        acne_severity_0_3=log_in.acne_severity_0_3,
        hirsutism_severity_0_3=log_in.hirsutism_severity_0_3,
        hair_thinning_severity_0_3=log_in.hair_thinning_severity_0_3,
        weight_change_notes=log_in.weight_change_notes,
        skin_darkening_acanthosis=log_in.skin_darkening_acanthosis,
        clinician_confirmed_pcos=log_in.clinician_confirmed_pcos,
        clinician_notes=log_in.clinician_notes
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/appointment-checklist")
def get_pcos_appointment_prep(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    logs = db.query(PCOSSymptomLog).filter(PCOSSymptomLog.user_id == user_id).all()
    
    # Calculate symptom severity averages
    avg_acne = round(sum(l.acne_severity_0_3 for l in logs) / len(logs), 1) if logs else 0.0
    avg_hirsutism = round(sum(l.hirsutism_severity_0_3 for l in logs) / len(logs), 1) if logs else 0.0
    avg_thinning = round(sum(l.hair_thinning_severity_0_3 for l in logs) / len(logs), 1) if logs else 0.0
    
    questions = [
        "Based on my logged cycle intervals (e.g. irregular intervals or cycles >35 days), do you recommend an endocrine workup?",
        "Would blood tests (total/free testosterone, DHEA-S, fasting insulin, TSH, lipid panel) help clarify my hormonal profile?",
        "Should we perform a pelvic ultrasound, and how are ultrasound findings interpreted in my age group?",
        "If my symptoms indicate PCOS, what evidence-based lifestyle changes and medical therapies (such as combined oral contraceptives, metformin, or anti-androgens) are appropriate for my goals?"
    ]
    
    if user and user.life_stage == "teen_menarche":
        questions.insert(0, "Since I am in my teen years, how do we distinguish typical adolescent menstrual maturation from clinical PCOS?")

    return {
        "summary": {
            "total_logs": len(logs),
            "average_acne_severity": avg_acne,
            "average_hirsutism_severity": avg_hirsutism,
            "average_hair_thinning_severity": avg_thinning,
            "clinician_confirmed": any(l.clinician_confirmed_pcos for l in logs)
        },
        "questions_for_gynecologist": questions,
        "disclaimer": (
            "IMPORTANT: HER LIFE does not diagnose PCOS or calculate diagnostic probabilities. "
            "PCOS features overlap significantly with other endocrine conditions (such as thyroid disorders or congenital adrenal hyperplasia) "
            "and normal adolescent pubertal development. Always consult a qualified physician for clinical evaluation."
        )
    }
