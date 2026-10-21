"""
HER LIFE — Machine Learning Inference & Statistical Intelligence Service
Handles Models A through E:
- Model A: Period Prediction with uncertainty bounds
- Model B: Multi-target Symptom Forecasting
- Model C: Cycle Pattern Monitoring & Clinical Anomaly Detection
- Model D: Lifestyle Pattern Analysis (associations, not causation)
- Model E: Personalized Content & Daily DO / DON'T / SEEK HELP Guidance
"""

import os
import joblib
import numpy as np
import pandas as pd
from datetime import date, timedelta
from typing import Dict, Any, List, Optional

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml"))
MODEL_A_PATH = os.path.join(MODEL_DIR, "period_prediction_model.joblib")
MODEL_B_PATH = os.path.join(MODEL_DIR, "symptom_forecast_model.joblib")

# Load models safely with fallback
model_a = None
model_b_bundle = None

if os.path.exists(MODEL_A_PATH):
    try:
        model_a = joblib.load(MODEL_A_PATH)
    except Exception as e:
        print(f"Notice: Model A load: {e}")

if os.path.exists(MODEL_B_PATH):
    try:
        model_b_bundle = joblib.load(MODEL_B_PATH)
    except Exception as e:
        print(f"Notice: Model B load: {e}")


def predict_next_period(user: Any, cycles: List[Any]) -> Dict[str, Any]:
    """
    Model A: Period Prediction
    Returns estimated next period date, confidence, and ovulation window (if applicable).
    """
    # Exclude menopause and pregnancy from menstrual prediction
    if user.life_stage in ["menopause", "pregnancy_postpartum"]:
        return {
            "applicable": False,
            "reason": f"Menstrual cycle prediction is not applicable during {user.life_stage.replace('_', ' ')}.",
            "predicted_period_date": None,
            "confidence": "Not Applicable",
            "uncertainty_days": 0,
            "estimated_ovulation_date": None,
            "fertile_window_start": None,
            "fertile_window_end": None,
            "disclaimer": "Cycle tracking is adjusted for your current reproductive stage."
        }

    valid_cycles = [c for c in cycles if c.period_start_date is not None]
    valid_cycles.sort(key=lambda c: c.period_start_date)

    if not valid_cycles:
        # No cycle data yet
        return {
            "applicable": True,
            "predicted_period_date": None,
            "predicted_cycle_length": user.usual_cycle_length or 28.0,
            "confidence": "Not enough data yet",
            "confidence_level": 0.0,
            "uncertainty_days": None,
            "estimated_ovulation_date": None,
            "fertile_window": None,
            "disclaimer": "Log at least 1 or 2 period starts to generate personalized estimates."
        }

    last_cycle = valid_cycles[-1]
    last_start = last_cycle.period_start_date
    if isinstance(last_start, str):
        last_start = date.fromisoformat(last_start)

    cycle_lengths = [c.cycle_length_days for c in valid_cycles if c.cycle_length_days and 15 <= c.cycle_length_days <= 90]

    # Model inference or statistical fallback
    if len(cycle_lengths) >= 3 and model_a is not None:
        try:
            l1 = cycle_lengths[-1]
            l2 = cycle_lengths[-2]
            l3 = cycle_lengths[-3]
            feats = pd.DataFrame([{
                'lag_1': l1,
                'lag_2': l2,
                'lag_3': l3,
                'rolling_mean_3': float(np.mean([l1, l2, l3])),
                'rolling_std_3': float(np.std([l1, l2, l3]))
            }])
            predicted_length = float(model_a.predict(feats)[0])
            predicted_length = max(20.0, min(50.0, predicted_length))
            std_dev = float(np.std(cycle_lengths[-5:]))
            uncertainty = max(2.0, round(std_dev * 1.5, 1))
            confidence = "High" if std_dev <= 2.5 else ("Moderate" if std_dev <= 5.0 else "Low - Irregular Cycle History")
            confidence_level = 0.88 if std_dev <= 2.5 else (0.65 if std_dev <= 5.0 else 0.40)
        except Exception:
            predicted_length = float(np.median(cycle_lengths))
            uncertainty = 3.5
            confidence = "Moderate"
            confidence_level = 0.60
    elif len(cycle_lengths) >= 1:
        predicted_length = float(np.median(cycle_lengths))
        uncertainty = 3.5
        confidence = "Preliminary Estimate"
        confidence_level = 0.50
    else:
        predicted_length = float(user.usual_cycle_length or 28.0)
        uncertainty = 4.0
        confidence = "Based on self-reported baseline"
        confidence_level = 0.35

    predicted_period_date = last_start + timedelta(days=int(round(predicted_length)))
    today = date.today()
    cycle_day = (today - last_start).days + 1

    # Ovulation & fertile window estimation (strictly educational, never for contraception)
    ovulation_date = None
    fertile_start = None
    fertile_end = None
    fertile_disclaimer = None

    if user.life_stage in ["reproductive", "college_gen_z"]:
        # Ovulation estimated 14 days before expected next period
        ovulation_date = predicted_period_date - timedelta(days=14)
        fertile_start = ovulation_date - timedelta(days=5)
        fertile_end = ovulation_date + timedelta(days=1)
        fertile_disclaimer = "Calendar-based estimates are educational approximations. They must NOT be relied upon for natural contraception or confirmation of ovulation."

    return {
        "applicable": True,
        "current_cycle_day": max(1, cycle_day),
        "last_period_date": last_start.isoformat(),
        "predicted_period_date": predicted_period_date.isoformat(),
        "predicted_cycle_length": round(predicted_length, 1),
        "confidence": confidence,
        "confidence_level": round(confidence_level, 2),
        "uncertainty_days": uncertainty,
        "uncertainty_range": f"± {uncertainty} days",
        "estimated_ovulation_date": ovulation_date.isoformat() if ovulation_date else None,
        "fertile_window": {
            "start": fertile_start.isoformat() if fertile_start else None,
            "end": fertile_end.isoformat() if fertile_end else None,
            "disclaimer": fertile_disclaimer
        } if fertile_start else None,
        "disclaimer": "Predictions are mathematical projections based on your recorded log history. Normal hormonal fluctuations and stress can alter cycle timing."
    }


def forecast_symptoms(user: Any, daily_log: Any) -> Dict[str, Any]:
    """
    Model B: Next-day Symptom Forecasting
    Generates probabilities for recurring symptoms.
    """
    if model_b_bundle is None or daily_log is None:
        # Baseline heuristic forecast
        cycle_day = getattr(daily_log, 'cycle_day', 14) or 14
        cramps_risk = 0.72 if cycle_day in [27, 28, 1, 2] else 0.15
        bloating_risk = 0.65 if cycle_day in [25, 26, 27, 28] else 0.20
        fatigue_risk = 0.58 if getattr(daily_log, 'sleep_hours', 7.0) < 6.5 else 0.22
        
        return {
            "model_used": "Baseline cycle-phase heuristic",
            "forecast_date": (date.today() + timedelta(days=1)).isoformat(),
            "probabilities": {
                "cramps": round(cramps_risk, 2),
                "bloating": round(bloating_risk, 2),
                "headache": 0.25,
                "fatigue": round(fatigue_risk, 2),
                "mood_changes": 0.30,
                "hot_flashes": 0.65 if user.life_stage in ["perimenopause", "menopause"] else 0.05,
                "sleep_disturbance": 0.40 if getattr(daily_log, 'stress_level_0_4', 1) >= 3 else 0.18
            },
            "disclaimer": "Tentative symptom estimates based on cycle patterns and lifestyle entries. Not a medical diagnosis."
        }

    try:
        model = model_b_bundle['model']
        feature_cols = model_b_bundle['feature_cols']
        
        feat_data = {
            'age_years': getattr(user, 'age_years', 26),
            'cycle_day_estimate': getattr(daily_log, 'cycle_day', 14) or 14,
            'sleep_hours': getattr(daily_log, 'sleep_hours', 7.0),
            'stress_level_0_4': getattr(daily_log, 'stress_level_0_4', 1),
            'activity_level_0_4': getattr(daily_log, 'activity_level_0_4', 2),
            'mood_score_0_4': getattr(daily_log, 'mood_score_0_4', 2),
            'energy_score_0_4': getattr(daily_log, 'energy_score_0_4', 2),
            'cramps_severity_0_3': getattr(daily_log, 'cramps_severity_0_3', 0),
            'bloating_severity_0_3': getattr(daily_log, 'bloating_severity_0_3', 0),
            'headache_severity_0_3': getattr(daily_log, 'headache_severity_0_3', 0),
            'fatigue_severity_0_3': getattr(daily_log, 'fatigue_severity_0_3', 0),
            'mood_changes_severity_0_3': getattr(daily_log, 'mood_changes_severity_0_3', 0),
            'hot_flashes_severity_0_3': getattr(daily_log, 'hot_flashes_severity_0_3', 0),
            'sleep_disturbance_severity_0_3': getattr(daily_log, 'sleep_disturbance_severity_0_3', 0),
            'period_day_flag_synthetic': 1 if getattr(daily_log, 'period_day_flag', False) else 0
        }
        
        df_feats = pd.DataFrame([feat_data])[feature_cols]
        # Predict probabilities
        probs = {}
        target_names = ['cramps', 'bloating', 'headache', 'fatigue', 'mood_changes', 'hot_flashes', 'sleep_disturbance']
        
        for idx, estimator in enumerate(model.estimators_):
            # probability of class 1
            prob_arr = estimator.predict_proba(df_feats)[0]
            prob_val = float(prob_arr[1]) if len(prob_arr) > 1 else float(prob_arr[0])
            probs[target_names[idx]] = round(prob_val, 2)
            
        return {
            "model_used": "Trained Multi-Output Random Forest (Leak-free Group Split)",
            "forecast_date": (date.today() + timedelta(days=1)).isoformat(),
            "probabilities": probs,
            "disclaimer": "Predictions highlight potential symptom recurrence based on self-reported patterns. They are not medical certainty."
        }
    except Exception as e:
        print(f"Symptom forecast exception: {e}")
        return {
            "model_used": "Fallback heuristic",
            "probabilities": {"cramps": 0.35, "bloating": 0.30, "fatigue": 0.40},
            "disclaimer": "Model using baseline heuristics."
        }


def analyze_cycle_patterns(cycles: List[Any], user: Any) -> Dict[str, Any]:
    """
    Model C: Cycle Pattern Monitoring & Clinical Review Guidance
    Evaluates regularity, cycle length variability, and clinical flags.
    """
    valid = [c for c in cycles if c.cycle_length_days and 15 <= c.cycle_length_days <= 120]
    
    if len(valid) < 3:
        return {
            "status": "Insufficient Data",
            "message": "Log at least 3 completed menstrual cycles for pattern analysis.",
            "average_cycle_length": None,
            "variability_days": None,
            "alerts": []
        }
        
    lengths = [c.cycle_length_days for c in valid]
    avg_len = float(round(np.mean(lengths), 1))
    std_dev = float(round(np.std(lengths), 1))
    min_len = float(round(np.min(lengths), 1))
    max_len = float(round(np.max(lengths), 1))
    
    alerts = []
    
    # Adolescent specific rules (first 2-3 years after menarche)
    is_teen = user.life_stage == "teen_menarche"
    upper_normal = 45.0 if is_teen else 35.0
    lower_normal = 21.0
    
    if avg_len > upper_normal or max_len > 60:
        alerts.append({
            "type": "OLIGOMENORRHEA_FLAG",
            "severity": "info" if is_teen else "moderate",
            "title": "Long or Infrequent Cycle Interval",
            "description": f"Your logged cycle length ({avg_len} days) exceeds the standard reference window ({lower_normal}-{int(upper_normal)} days).",
            "clinical_guidance": "In teenagers, irregular cycles can be normal during the first 2-3 years after menarche. In adults, recurrent cycles longer than 38 days warrant evaluation for PCOS, thyroid function, or hormonal balance."
        })
        
    if avg_len < lower_normal:
        alerts.append({
            "type": "POLYMENORRHEA_FLAG",
            "severity": "moderate",
            "title": "Short Cycle Interval",
            "description": f"Average cycle length of {avg_len} days is shorter than the typical 21-day threshold.",
            "clinical_guidance": "Discuss frequent bleeding with a healthcare provider to check for luteal phase insufficiency, anovulation, or benign uterine factors."
        })
        
    if std_dev > 7.0:
        alerts.append({
            "type": "HIGH_VARIABILITY_FLAG",
            "severity": "moderate",
            "title": "Cycle Length Variability",
            "description": f"Your cycle length fluctuates by ± {std_dev} days between cycles.",
            "clinical_guidance": "High variability can be influenced by exam/work stress, shifts in sleep, or endocrine conditions. Tracking continuously helps your gynecologist identify trends."
        })
        
    return {
        "status": "Active Analysis",
        "total_cycles_analyzed": len(valid),
        "average_cycle_length": avg_len,
        "variability_days": std_dev,
        "shortest_cycle": min_len,
        "longest_cycle": max_len,
        "is_regular": std_dev <= 5.0 and lower_normal <= avg_len <= upper_normal,
        "alerts": alerts,
        "disclaimer": "Cycle pattern summaries are educational descriptors. Irregularity is not an automatic diagnosis of disease."
    }


def get_personalized_guidance(user: Any, cycle_day: Optional[int], recent_symptoms: Dict[str, Any]) -> Dict[str, Any]:
    """
    Model E: Personalized Routine & Daily Guidance
    Three sections: DO, DON'T, and WHEN TO SEEK HELP.
    Tailored to user's life stage and current symptoms.
    """
    stage = user.life_stage or "reproductive"
    
    dos = [
        "Hydrate with 6-8 glasses of water to reduce bloating and combat fatigue.",
        "Log any noticeable cramps, skin shifts, or mood changes in today's check-in.",
        "Aim for 7-8 hours of consistent, restorative sleep."
    ]
    
    donts = [
        "Avoid unverified quick-fix 'hormone balancing' supplements without clinical supervision.",
        "Do not skip meals or turn to severe caloric restriction, which elevates physical stress.",
        "Do not interpret cycle shifts or symptoms as self-diagnosed medical disorders."
    ]
    
    seek_help = [
        "Bleeding soaking through one or more menstrual pads/tampons every hour for 2 consecutive hours.",
        "Pelvic pain so severe that it does not respond to standard pain relievers or prevents daily activities.",
        "Sudden fainting, dizziness, or chest pressure.",
        "Absence of periods for over 90 days without pregnancy."
    ]
    
    if stage == "teen_menarche":
        dos.insert(0, "Carry comfortable period products in your backpack so you feel prepared and relaxed.")
        dos.insert(1, "Talk openly with a parent, trusted adult, or school nurse if you experience distressing cramps.")
        donts.insert(0, "Don't worry if your period dates vary widely; newly started cycles often take 1 to 3 years to settle.")
        seek_help.insert(0, "Severe cramps causing you to miss school or social events regularly.")
        
    elif stage == "college_gen_z":
        dos.insert(0, "Schedule brief 10-minute study breaks to stretch and reduce exam-induced muscle tension.")
        dos.insert(1, "Keep a regular sleep schedule, even during deadlines, to protect hormone rhythm.")
        donts.insert(0, "Avoid excessive caffeine or energy drinks after 2:00 PM to protect deep sleep.")
        seek_help.insert(0, "Persistent severe acne, marked facial hair growth, or periods missing for 3+ months during stressful semesters.")
        
    elif stage == "perimenopause":
        dos.insert(0, "Wear breathable, layered clothing and keep a cool bedroom environment for night sweats.")
        dos.insert(1, "Incorporate gentle strength-bearing exercise to support bone and muscle health.")
        donts.insert(0, "Do not assume all bleeding changes are 'just menopause' without periodic clinical checkups.")
        seek_help.insert(0, "Very heavy bleeding with large clots, bleeding after intercourse, or spotting between periods.")
        
    elif stage == "menopause":
        dos.insert(0, "Focus on calcium-rich nutrition, vitamin D, and regular weight-bearing walking.")
        dos.insert(1, "Discuss vaginal dryness or urinary frequency openly with your healthcare provider; effective solutions exist.")
        donts.insert(0, "Never ignore any vaginal bleeding or spotting after menopause.")
        seek_help.insert(0, "ANY vaginal bleeding or spotting after having gone 12 full months without a period requires prompt clinical assessment.")
        
    return {
        "life_stage": stage,
        "daily_focus": "Balanced Hormonal Wellness & Evidence-Based Self Care",
        "do": dos,
        "dont": donts,
        "when_to_seek_help": seek_help
    }
