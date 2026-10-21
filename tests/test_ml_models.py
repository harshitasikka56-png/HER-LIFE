"""
Unit Tests for HER LIFE Machine Learning & Clinical Logic
"""

import sys
import os
from datetime import date, timedelta

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from services.ml_inference import (
    predict_next_period,
    forecast_symptoms,
    analyze_cycle_patterns,
    get_personalized_guidance
)
from services.ai_guide_service import answer_health_query


class DummyUser:
    def __init__(self, life_stage="reproductive", age_years=28, usual_cycle_length=28.0):
        self.id = "test_user_1"
        self.life_stage = life_stage
        self.age_years = age_years
        self.usual_cycle_length = usual_cycle_length


class DummyCycle:
    def __init__(self, start_date, length=28.0):
        self.period_start_date = start_date
        self.cycle_length_days = length


class DummyDailyLog:
    def __init__(self, cycle_day=14, sleep_hours=7.5, stress=1):
        self.cycle_day = cycle_day
        self.sleep_hours = sleep_hours
        self.stress_level_0_4 = stress
        self.activity_level_0_4 = 2
        self.mood_score_0_4 = 2
        self.energy_score_0_4 = 2
        self.cramps_severity_0_3 = 0
        self.bloating_severity_0_3 = 0
        self.headache_severity_0_3 = 0
        self.fatigue_severity_0_3 = 0
        self.mood_changes_severity_0_3 = 0
        self.hot_flashes_severity_0_3 = 0
        self.sleep_disturbance_severity_0_3 = 0
        self.period_day_flag = False


def test_model_a_period_prediction():
    user = DummyUser(life_stage="reproductive")
    today = date.today()
    cycles = [
        DummyCycle(today - timedelta(days=84), length=28.0),
        DummyCycle(today - timedelta(days=56), length=29.0),
        DummyCycle(today - timedelta(days=28), length=27.0),
    ]
    res = predict_next_period(user, cycles)
    assert res["applicable"] is True
    assert res["predicted_period_date"] is not None
    assert "uncertainty_days" in res
    assert res["estimated_ovulation_date"] is not None
    assert "disclaimer" in res


def test_model_a_menopause_exclusion():
    user = DummyUser(life_stage="menopause")
    res = predict_next_period(user, [])
    assert res["applicable"] is False
    assert res["predicted_period_date"] is None
    assert "not applicable" in res["reason"].lower()


def test_model_b_symptom_forecast():
    user = DummyUser(life_stage="reproductive")
    log = DummyDailyLog(cycle_day=27, sleep_hours=6.0, stress=3)
    res = forecast_symptoms(user, log)
    assert "probabilities" in res
    assert 0.0 <= res["probabilities"]["cramps"] <= 1.0
    assert 0.0 <= res["probabilities"]["fatigue"] <= 1.0
    assert "disclaimer" in res


def test_model_c_cycle_pattern_monitoring():
    user = DummyUser(life_stage="reproductive")
    today = date.today()
    # High variability cycles
    cycles = [
        DummyCycle(today - timedelta(days=120), length=24.0),
        DummyCycle(today - timedelta(days=96), length=42.0),
        DummyCycle(today - timedelta(days=54), length=22.0),
        DummyCycle(today - timedelta(days=32), length=45.0),
    ]
    res = analyze_cycle_patterns(cycles, user)
    assert res["status"] == "Active Analysis"
    assert res["variability_days"] > 5.0
    assert len(res["alerts"]) > 0


def test_model_e_personalized_guidance():
    teen_user = DummyUser(life_stage="teen_menarche")
    guidance = get_personalized_guidance(teen_user, 14, {})
    assert len(guidance["do"]) >= 3
    assert len(guidance["dont"]) >= 3
    assert len(guidance["when_to_seek_help"]) >= 3
    assert any("backpack" in d.lower() or "school" in d.lower() for d in guidance["do"] + guidance["when_to_seek_help"])


def test_ai_guide_safety_and_disclaimer():
    user = DummyUser()
    resp = answer_health_query(user, "What are the common symptoms of PCOS?")
    assert "reply" in resp
    assert len(resp["sources"]) >= 1
    assert "medical_disclaimer" in resp
    assert "not a medical diagnosis" in resp["medical_disclaimer"].lower()
