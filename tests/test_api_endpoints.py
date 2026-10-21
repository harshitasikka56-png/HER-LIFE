"""
Integration Tests for HER LIFE FastAPI Endpoints
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from main import app
from seed_data import seed_database

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    seed_database()


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app_name"] == "HER LIFE"
    assert "disclaimer" in data


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_demo_users_endpoint():
    response = client.get("/api/auth/demo-users")
    assert response.status_code == 200
    demos = response.json()
    assert len(demos) >= 5
    stages = [d["life_stage"] for d in demos]
    assert "teen_menarche" in stages
    assert "college_gen_z" in stages
    assert "reproductive" in stages
    assert "perimenopause" in stages
    assert "menopause" in stages


def test_demo_switch_endpoint():
    response = client.post("/api/auth/demo-switch/demo_chloe_genz")
    assert response.status_code == 200
    user = response.json()
    assert user["life_stage"] == "college_gen_z"


def test_get_cycles_endpoint():
    response = client.get("/api/cycles?user_id=demo_priya_reproductive")
    assert response.status_code == 200
    cycles = response.json()
    assert len(cycles) > 0


def test_period_prediction_endpoint():
    response = client.get("/api/ml/period-prediction?user_id=demo_priya_reproductive")
    assert response.status_code == 200
    pred = response.json()
    assert pred["applicable"] is True
    assert "predicted_period_date" in pred
    assert "confidence" in pred


def test_daily_checkin_upsert():
    log_data = {
        "date": "2026-10-21",
        "period_day_flag": False,
        "sleep_hours": 7.8,
        "stress_level_0_4": 1,
        "activity_level_0_4": 2,
        "mood_score_0_4": 3,
        "energy_score_0_4": 3,
        "workload_0_4": 2,
        "hydration_glasses": 8,
        "caffeine_cups": 1,
        "cramps_severity_0_3": 0,
        "bloating_severity_0_3": 1,
        "headache_severity_0_3": 0,
        "fatigue_severity_0_3": 0,
        "mood_changes_severity_0_3": 0,
        "hot_flashes_severity_0_3": 0,
        "sleep_disturbance_severity_0_3": 0,
        "pelvic_pain_severity_0_3": 0,
        "notes": "Testing checkin endpoint"
    }
    response = client.post("/api/daily?user_id=demo_priya_reproductive", json=log_data)
    assert response.status_code == 200
    saved = response.json()
    assert saved["sleep_hours"] == 7.8
    assert saved["hydration_glasses"] == 8


def test_ai_guide_ask_endpoint():
    query = {"message": "Can stress delay my period?"}
    response = client.post("/api/ai/ask?user_id=demo_priya_reproductive", json=query)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "medical_disclaimer" in data
