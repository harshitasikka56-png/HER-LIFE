"""
HER LIFE — Pydantic Request & Response Schemas
"""

from typing import List, Optional, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field


# User & Auth
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    age_years: int = Field(ge=10, le=100)
    life_stage: str = "reproductive" # teen_menarche, college_gen_z, reproductive, perimenopause, menopause
    usual_cycle_length: float = 28.0
    cycle_regularity: str = "regular"


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    age_years: int
    life_stage: str
    cycle_regularity: str
    usual_cycle_length: float
    consent_status: bool
    is_demo: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LifeStageUpdate(BaseModel):
    life_stage: str
    usual_cycle_length: Optional[float] = None
    cycle_regularity: Optional[str] = None


# Cycles
class CycleCreate(BaseModel):
    period_start_date: date
    period_end_date: Optional[date] = None
    flow_level: str = "medium" # light, medium, heavy, spotting
    cycle_length_days: Optional[float] = None
    bleeding_duration_days: Optional[float] = 4.5


class CycleResponse(BaseModel):
    id: str
    user_id: str
    period_start_date: date
    period_end_date: Optional[date]
    cycle_length_days: Optional[float]
    bleeding_duration_days: Optional[float]
    flow_level: str
    record_source: str
    created_at: datetime

    class Config:
        from_attributes = True


# Daily Check-in & Symptoms
class DailyLogCreate(BaseModel):
    date: date
    period_day_flag: bool = False
    sleep_hours: float = 7.0
    stress_level_0_4: int = 1
    activity_level_0_4: int = 2
    mood_score_0_4: int = 2
    energy_score_0_4: int = 2
    workload_0_4: int = 2
    hydration_glasses: int = 6
    caffeine_cups: int = 1
    
    cramps_severity_0_3: int = 0
    bloating_severity_0_3: int = 0
    headache_severity_0_3: int = 0
    fatigue_severity_0_3: int = 0
    mood_changes_severity_0_3: int = 0
    hot_flashes_severity_0_3: int = 0
    sleep_disturbance_severity_0_3: int = 0
    pelvic_pain_severity_0_3: int = 0
    
    basal_temp_c: Optional[float] = None
    cervical_mucus: Optional[str] = None
    lh_test_result: Optional[str] = None
    notes: Optional[str] = None


class DailyLogResponse(BaseModel):
    id: str
    user_id: str
    date: date
    cycle_day: Optional[int]
    cycle_phase: Optional[str]
    period_day_flag: bool
    sleep_hours: float
    stress_level_0_4: int
    activity_level_0_4: int
    mood_score_0_4: int
    energy_score_0_4: int
    workload_0_4: int
    hydration_glasses: int
    caffeine_cups: int
    cramps_severity_0_3: int
    bloating_severity_0_3: int
    headache_severity_0_3: int
    fatigue_severity_0_3: int
    mood_changes_severity_0_3: int
    hot_flashes_severity_0_3: int
    sleep_disturbance_severity_0_3: int
    pelvic_pain_severity_0_3: int
    basal_temp_c: Optional[float]
    cervical_mucus: Optional[str]
    notes: Optional[str]
    record_source: str

    class Config:
        from_attributes = True


# PCOS Symptom Logging
class PCOSLogCreate(BaseModel):
    date: Optional[date] = None
    acne_severity_0_3: int = 0
    hirsutism_severity_0_3: int = 0
    hair_thinning_severity_0_3: int = 0
    weight_change_notes: Optional[str] = None
    skin_darkening_acanthosis: bool = False
    clinician_confirmed_pcos: bool = False
    clinician_notes: Optional[str] = None


class PCOSLogResponse(BaseModel):
    id: str
    user_id: str
    date: date
    acne_severity_0_3: int
    hirsutism_severity_0_3: int
    hair_thinning_severity_0_3: int
    weight_change_notes: Optional[str]
    skin_darkening_acanthosis: bool
    clinician_confirmed_pcos: bool
    clinician_notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Cortisol & Hormone Tests
class CortisolTestCreate(BaseModel):
    test_date: date
    collection_time: str = "08:00 AM"
    test_value: float
    units: str = "ug/dL"
    reference_range: str = "Morning: 6.0 - 18.4 ug/dL"
    lab_name: str = "Clinical Reference Laboratory"
    test_type: str = "Serum Cortisol"
    notes: Optional[str] = None
    medical_disclaimer_acknowledged: bool = True


class CortisolTestResponse(BaseModel):
    id: str
    user_id: str
    test_date: date
    collection_time: str
    test_value: float
    units: str
    reference_range: str
    lab_name: str
    test_type: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Notifications
class NotificationPrefUpdate(BaseModel):
    period_reminders: bool
    ovulation_reminders: bool
    daily_checkin: bool
    sleep_wellness_reminders: bool
    discrete_mode: bool
    reminder_time: str


# AI Chat
class AIChatRequest(BaseModel):
    message: str
    context_topic: Optional[str] = None


class AIChatResponse(BaseModel):
    reply: str
    sources: List[str]
    recommended_questions: List[str]
    medical_disclaimer: str
