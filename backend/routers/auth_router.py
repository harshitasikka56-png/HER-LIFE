"""
HER LIFE — Authentication and Demo Personas Router
"""

import uuid
from typing import List, Dict, Any
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.hash import pbkdf2_sha256

from models.database import get_db, User, NotificationPref
from schemas.schemas import UserRegister, UserLogin, UserResponse, LifeStageUpdate

router = APIRouter(prefix="/api/auth", tags=["Authentication & Profiles"])


@router.post("/register", response_model=UserResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user = User(
        id=user_id,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=pbkdf2_sha256.hash(user_in.password),
        age_years=user_in.age_years,
        life_stage=user_in.life_stage,
        cycle_regularity=user_in.cycle_regularity,
        usual_cycle_length=user_in.usual_cycle_length,
        tracking_start_date=date.today(),
        consent_status=True,
        is_demo=False
    )
    db.add(user)
    db.flush()

    # Default notifications
    pref = NotificationPref(
        id=f"pref_{user.id}",
        user_id=user.id,
        period_reminders=True,
        ovulation_reminders=(user_in.life_stage in ["reproductive", "college_gen_z"]),
        daily_checkin=True,
        sleep_wellness_reminders=True,
        discrete_mode=True,
        reminder_time="20:00"
    )
    db.add(pref)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=UserResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not pbkdf2_sha256.verify(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return user


@router.get("/demo-users", response_model=List[UserResponse])
def get_demo_users(db: Session = Depends(get_db)):
    demos = db.query(User).filter(User.is_demo == True).all()
    return demos


@router.post("/demo-switch/{persona_id}", response_model=UserResponse)
def switch_demo_persona(persona_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == persona_id).first()
    if not user:
        # Check by life stage match
        user = db.query(User).filter(User.life_stage == persona_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo persona not found.")
    return user


@router.get("/user/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Default to first available demo user for resilient UX
        user = db.query(User).filter(User.id == "demo_priya_reproductive").first()
        if not user:
            user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.put("/profile/{user_id}", response_model=UserResponse)
def update_profile(user_id: str, update: LifeStageUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.life_stage = update.life_stage
    if update.usual_cycle_length is not None:
        user.usual_cycle_length = update.usual_cycle_length
    if update.cycle_regularity is not None:
        user.cycle_regularity = update.cycle_regularity

    db.commit()
    db.refresh(user)
    return user
