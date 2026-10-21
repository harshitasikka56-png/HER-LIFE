"""
HER LIFE — SQLAlchemy Database Models
"""

import os
from datetime import datetime, date
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "her_life.db"))
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    age_years = Column(Integer, default=26)
    life_stage = Column(String, default="reproductive") # teen_menarche, college_gen_z, reproductive, perimenopause, menopause
    cycle_regularity = Column(String, default="regular")
    usual_cycle_length = Column(Float, default=28.0)
    tracking_start_date = Column(Date, default=date.today)
    consent_status = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    cycles = relationship("Cycle", back_populates="user", cascade="all, delete-orphan")
    daily_logs = relationship("DailyLog", back_populates="user", cascade="all, delete-orphan")
    pcos_logs = relationship("PCOSSymptomLog", back_populates="user", cascade="all, delete-orphan")
    cortisol_tests = relationship("CortisolTestLog", back_populates="user", cascade="all, delete-orphan")
    notification_pref = relationship("NotificationPref", back_populates="user", uselist=False, cascade="all, delete-orphan")
    chat_history = relationship("AIChatHistory", back_populates="user", cascade="all, delete-orphan")


class Cycle(Base):
    __tablename__ = "cycles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    period_start_date = Column(Date, index=True)
    period_end_date = Column(Date, nullable=True)
    cycle_length_days = Column(Float, nullable=True)
    bleeding_duration_days = Column(Float, default=4.5)
    flow_level = Column(String, default="medium") # light, medium, heavy, spotting
    record_source = Column(String, default="USER_ENTERED") # USER_ENTERED, DEMO_SYNTHETIC
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cycles")


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    date = Column(Date, index=True)
    cycle_day = Column(Integer, nullable=True)
    cycle_phase = Column(String, nullable=True) # menstrual, follicular, ovulatory, luteal, perimenopausal, postmenopausal
    period_day_flag = Column(Boolean, default=False)
    
    # Lifestyle factors
    sleep_hours = Column(Float, default=7.0)
    stress_level_0_4 = Column(Integer, default=1)
    activity_level_0_4 = Column(Integer, default=2)
    mood_score_0_4 = Column(Integer, default=2)
    energy_score_0_4 = Column(Integer, default=2)
    workload_0_4 = Column(Integer, default=2)
    hydration_glasses = Column(Integer, default=6)
    caffeine_cups = Column(Integer, default=1)
    
    # Symptom severities (0 to 3)
    cramps_severity_0_3 = Column(Integer, default=0)
    bloating_severity_0_3 = Column(Integer, default=0)
    headache_severity_0_3 = Column(Integer, default=0)
    fatigue_severity_0_3 = Column(Integer, default=0)
    mood_changes_severity_0_3 = Column(Integer, default=0)
    hot_flashes_severity_0_3 = Column(Integer, default=0)
    sleep_disturbance_severity_0_3 = Column(Integer, default=0)
    pelvic_pain_severity_0_3 = Column(Integer, default=0)
    
    # Fertility signs (optional)
    basal_temp_c = Column(Float, nullable=True)
    cervical_mucus = Column(String, nullable=True) # dry, sticky, creamy, egg_white
    lh_test_result = Column(String, nullable=True) # negative, positive, not_recorded
    
    notes = Column(Text, nullable=True)
    record_source = Column(String, default="USER_ENTERED")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="daily_logs")


class PCOSSymptomLog(Base):
    __tablename__ = "pcos_symptom_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    date = Column(Date, default=date.today)
    acne_severity_0_3 = Column(Integer, default=0)
    hirsutism_severity_0_3 = Column(Integer, default=0)
    hair_thinning_severity_0_3 = Column(Integer, default=0)
    weight_change_notes = Column(String, nullable=True)
    skin_darkening_acanthosis = Column(Boolean, default=False)
    clinician_confirmed_pcos = Column(Boolean, default=False)
    clinician_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="pcos_logs")


class CortisolTestLog(Base):
    __tablename__ = "cortisol_test_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    test_date = Column(Date, default=date.today)
    collection_time = Column(String, default="08:00 AM") # e.g., 8:00 AM (morning peak) or 11:00 PM (night nadir)
    test_value = Column(Float)
    units = Column(String, default="ug/dL") # ug/dL or nmol/L
    reference_range = Column(String, default="Morning: 6.0 - 18.4 ug/dL")
    lab_name = Column(String, default="Clinical Reference Laboratory")
    test_type = Column(String, default="Serum Cortisol") # Serum, Salivary, 24h Urine
    notes = Column(Text, nullable=True)
    medical_disclaimer_acknowledged = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cortisol_tests")


class NotificationPref(Base):
    __tablename__ = "notification_prefs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    period_reminders = Column(Boolean, default=True)
    ovulation_reminders = Column(Boolean, default=True)
    daily_checkin = Column(Boolean, default=True)
    sleep_wellness_reminders = Column(Boolean, default=True)
    discrete_mode = Column(Boolean, default=True) # Hide private terms in lockscreen
    reminder_time = Column(String, default="20:00")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notification_pref")


class AIChatHistory(Base):
    __tablename__ = "ai_chat_history"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    role = Column(String) # user, assistant
    content = Column(Text)
    sources = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_history")


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
