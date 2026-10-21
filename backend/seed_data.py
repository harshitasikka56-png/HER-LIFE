"""
HER LIFE — Database Seeding Script
Initializes SQLite database with 5 pre-configured demo personas across all life stages
using the cleaned HER LIFE synthetic dataset.
"""

import os
import uuid
from datetime import date, datetime, timedelta
from passlib.hash import pbkdf2_sha256
from sqlalchemy.orm import Session
from models.database import engine, init_db, SessionLocal, User, Cycle, DailyLog, PCOSSymptomLog, CortisolTestLog, NotificationPref

DEMO_USERS = [
    {
        "id": "demo_maya_teen",
        "email": "maya.teen@herlife.demo",
        "full_name": "Maya Lin (Teen Menarche)",
        "password": "demopassword123",
        "age_years": 15,
        "life_stage": "teen_menarche",
        "cycle_regularity": "irregular",
        "usual_cycle_length": 33.0,
        "is_demo": True
    },
    {
        "id": "demo_chloe_genz",
        "email": "chloe.college@herlife.demo",
        "full_name": "Chloe Patel (Gen Z College)",
        "password": "demopassword123",
        "age_years": 21,
        "life_stage": "college_gen_z",
        "cycle_regularity": "irregular",
        "usual_cycle_length": 34.5,
        "is_demo": True
    },
    {
        "id": "demo_priya_reproductive",
        "email": "priya.reproductive@herlife.demo",
        "full_name": "Priya Sharma (Millennial Reproductive)",
        "password": "demopassword123",
        "age_years": 29,
        "life_stage": "reproductive",
        "cycle_regularity": "regular",
        "usual_cycle_length": 28.0,
        "is_demo": True
    },
    {
        "id": "demo_elena_perimeno",
        "email": "elena.perimenopause@herlife.demo",
        "full_name": "Elena Morales (Perimenopause)",
        "password": "demopassword123",
        "age_years": 47,
        "life_stage": "perimenopause",
        "cycle_regularity": "irregular",
        "usual_cycle_length": 38.0,
        "is_demo": True
    },
    {
        "id": "demo_sarah_menopause",
        "email": "sarah.menopause@herlife.demo",
        "full_name": "Sarah Jenkins (Menopause)",
        "password": "demopassword123",
        "age_years": 56,
        "life_stage": "menopause",
        "cycle_regularity": "not_applicable",
        "usual_cycle_length": 0.0,
        "is_demo": True
    }
]


def seed_database():
    print("Initializing database tables...")
    init_db()
    db = SessionLocal()
    
    try:
        # Check if users exist
        existing = db.query(User).filter(User.is_demo == True).first()
        if existing:
            print("Demo users already seeded. Ready.")
            return

        today = date.today()

        for udata in DEMO_USERS:
            user = db.query(User).filter(User.id == udata["id"]).first()
            if not user:
                user = User(
                    id=udata["id"],
                    email=udata["email"],
                    full_name=udata["full_name"],
                    hashed_password=pbkdf2_sha256.hash(udata["password"]),
                    age_years=udata["age_years"],
                    life_stage=udata["life_stage"],
                    cycle_regularity=udata["cycle_regularity"],
                    usual_cycle_length=udata["usual_cycle_length"],
                    tracking_start_date=today - timedelta(days=180),
                    consent_status=True,
                    is_demo=True
                )
                db.add(user)
                db.flush()

                # Add notification prefs
                pref = NotificationPref(
                    id=f"pref_{user.id}",
                    user_id=user.id,
                    period_reminders=True,
                    ovulation_reminders=(user.life_stage in ["reproductive", "college_gen_z"]),
                    daily_checkin=True,
                    sleep_wellness_reminders=True,
                    discrete_mode=True,
                    reminder_time="20:00"
                )
                db.add(pref)

            # Generate realistic past 5 cycles for applicable stages
            if user.life_stage not in ["menopause", "pregnancy_postpartum"]:
                cycle_len = user.usual_cycle_length if user.usual_cycle_length > 20 else 28.0
                variations = [0, -2, 3, -1, 2] if user.cycle_regularity == "irregular" else [0, 1, -1, 0, 1]
                
                start_cursor = today - timedelta(days=int(cycle_len * 4.5))
                for c_idx in range(5):
                    actual_len = cycle_len + variations[c_idx]
                    start_d = start_cursor
                    end_d = start_d + timedelta(days=4)
                    
                    c_record = Cycle(
                        id=f"cyc_{user.id}_{c_idx+1}",
                        user_id=user.id,
                        period_start_date=start_d,
                        period_end_date=end_d,
                        cycle_length_days=actual_len,
                        bleeding_duration_days=5.0,
                        flow_level="medium" if c_idx % 2 == 0 else "heavy",
                        record_source="DEMO_SYNTHETIC"
                    )
                    db.add(c_record)
                    start_cursor = start_d + timedelta(days=int(actual_len))

            # Generate past 30 days of rich daily logs
            for day_offset in range(30, -1, -1):
                log_d = today - timedelta(days=day_offset)
                cycle_day = (day_offset % 28) + 1
                
                is_period = (cycle_day <= 5) if user.life_stage not in ["menopause"] else False
                cramps = 2 if is_period else (1 if cycle_day >= 26 else 0)
                bloating = 2 if cycle_day >= 25 else 0
                stress = 3 if (user.life_stage == "college_gen_z" and day_offset % 7 in [1, 2]) else 1
                hot_flash = 2 if user.life_stage in ["perimenopause", "menopause"] else 0
                sleep = 6.2 if stress > 2 else 7.5
                
                d_log = DailyLog(
                    id=f"log_{user.id}_{log_d.isoformat()}",
                    user_id=user.id,
                    date=log_d,
                    cycle_day=cycle_day if user.life_stage != "menopause" else None,
                    cycle_phase="menstrual" if is_period else ("follicular" if cycle_day < 14 else "luteal"),
                    period_day_flag=is_period,
                    sleep_hours=sleep,
                    stress_level_0_4=stress,
                    activity_level_0_4=2 if sleep > 7 else 1,
                    mood_score_0_4=1 if cramps > 1 else 3,
                    energy_score_0_4=1 if sleep < 6.5 else 3,
                    workload_0_4=3 if user.life_stage == "college_gen_z" else 2,
                    hydration_glasses=7,
                    caffeine_cups=2 if user.life_stage == "college_gen_z" else 1,
                    cramps_severity_0_3=cramps,
                    bloating_severity_0_3=bloating,
                    headache_severity_0_3=1 if stress > 2 else 0,
                    fatigue_severity_0_3=2 if sleep < 6.5 else 0,
                    mood_changes_severity_0_3=1 if cycle_day >= 25 else 0,
                    hot_flashes_severity_0_3=hot_flash,
                    sleep_disturbance_severity_0_3=2 if hot_flash > 0 or stress > 2 else 0,
                    notes="Synthetic demonstration record.",
                    record_source="DEMO_SYNTHETIC"
                )
                db.add(d_log)

            # Seed specific features per persona
            if user.life_stage == "college_gen_z":
                pcos_entry = PCOSSymptomLog(
                    id=f"pcos_{user.id}_1",
                    user_id=user.id,
                    date=today - timedelta(days=10),
                    acne_severity_0_3=2,
                    hirsutism_severity_0_3=1,
                    hair_thinning_severity_0_3=1,
                    weight_change_notes="Mild fluctuation noted during exam periods.",
                    skin_darkening_acanthosis=False,
                    clinician_confirmed_pcos=False,
                    clinician_notes="Discussing irregular cycles and persistent acne with university clinic gynecologist."
                )
                db.add(pcos_entry)
                
                cortisol_entry = CortisolTestLog(
                    id=f"cort_{user.id}_1",
                    user_id=user.id,
                    test_date=today - timedelta(days=15),
                    collection_time="08:15 AM",
                    test_value=14.2,
                    units="ug/dL",
                    reference_range="Morning: 6.0 - 18.4 ug/dL",
                    lab_name="University Student Health Diagnostic Lab",
                    test_type="Morning Serum Cortisol",
                    notes="Baseline morning cortisol within typical clinical reference limits.",
                    medical_disclaimer_acknowledged=True
                )
                db.add(cortisol_entry)

        db.commit()
        print(" Demo personas and synthetic records seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
