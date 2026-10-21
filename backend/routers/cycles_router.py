"""
HER LIFE — Menstrual Cycle Intelligence Router
"""

import uuid
from typing import List, Optional
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.database import get_db, Cycle, User
from schemas.schemas import CycleCreate, CycleResponse

router = APIRouter(prefix="/api/cycles", tags=["Menstrual Cycles"])


@router.get("", response_model=List[CycleResponse])
def get_user_cycles(user_id: str, db: Session = Depends(get_db)):
    cycles = db.query(Cycle).filter(Cycle.user_id == user_id).order_by(desc(Cycle.period_start_date)).all()
    return cycles


@router.post("", response_model=CycleResponse)
def record_period(user_id: str, cycle_in: CycleCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Calculate cycle length based on previous cycle start if not explicitly provided
    cycle_length = cycle_in.cycle_length_days
    last_cycle = db.query(Cycle).filter(
        Cycle.user_id == user_id,
        Cycle.period_start_date < cycle_in.period_start_date
    ).order_by(desc(Cycle.period_start_date)).first()

    if cycle_length is None and last_cycle and last_cycle.period_start_date:
        diff_days = (cycle_in.period_start_date - last_cycle.period_start_date).days
        if 15 <= diff_days <= 100:
            cycle_length = float(diff_days)
            # Update the prior cycle's recorded length as well
            last_cycle.cycle_length_days = cycle_length

    bleeding_dur = cycle_in.bleeding_duration_days
    if bleeding_dur is None and cycle_in.period_end_date:
        bleeding_dur = float((cycle_in.period_end_date - cycle_in.period_start_date).days + 1)
    if bleeding_dur is None:
        bleeding_dur = 5.0

    new_cycle = Cycle(
        id=f"cyc_{uuid.uuid4().hex[:12]}",
        user_id=user_id,
        period_start_date=cycle_in.period_start_date,
        period_end_date=cycle_in.period_end_date or (cycle_in.period_start_date + timedelta(days=int(bleeding_dur - 1))),
        cycle_length_days=cycle_length,
        bleeding_duration_days=bleeding_dur,
        flow_level=cycle_in.flow_level,
        record_source="USER_ENTERED"
    )
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)
    return new_cycle


@router.delete("/{cycle_id}")
def delete_cycle(cycle_id: str, user_id: str, db: Session = Depends(get_db)):
    cycle = db.query(Cycle).filter(Cycle.id == cycle_id, Cycle.user_id == user_id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle record not found.")
    db.delete(cycle)
    db.commit()
    return {"status": "success", "message": "Cycle deleted successfully."}
