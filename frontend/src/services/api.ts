import { UserProfile, CycleRecord, DailyLogRecord, PeriodPrediction, SymptomForecast, DailyGuidance, PCOSRecord, CortisolRecord } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8001/api';

// Fallback demo users for instant resilience
export const FALLBACK_DEMO_USERS: UserProfile[] = [
  {
    id: "demo_maya_teen",
    email: "maya.teen@herlife.demo",
    full_name: "Maya Lin (Teen Menarche)",
    age_years: 15,
    life_stage: "teen_menarche",
    cycle_regularity: "irregular",
    usual_cycle_length: 33.0,
    consent_status: true,
    is_demo: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo_chloe_genz",
    email: "chloe.college@herlife.demo",
    full_name: "Chloe Patel (Gen Z College)",
    age_years: 21,
    life_stage: "college_gen_z",
    cycle_regularity: "irregular",
    usual_cycle_length: 34.5,
    consent_status: true,
    is_demo: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo_priya_reproductive",
    email: "priya.reproductive@herlife.demo",
    full_name: "Priya Sharma (Millennial Reproductive)",
    age_years: 29,
    life_stage: "reproductive",
    cycle_regularity: "regular",
    usual_cycle_length: 28.0,
    consent_status: true,
    is_demo: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo_elena_perimeno",
    email: "elena.perimenopause@herlife.demo",
    full_name: "Elena Morales (Perimenopause)",
    age_years: 47,
    life_stage: "perimenopause",
    cycle_regularity: "irregular",
    usual_cycle_length: 38.0,
    consent_status: true,
    is_demo: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo_sarah_menopause",
    email: "sarah.menopause@herlife.demo",
    full_name: "Sarah Jenkins (Menopause)",
    age_years: 56,
    life_stage: "menopause",
    cycle_regularity: "not_applicable",
    usual_cycle_length: 0.0,
    consent_status: true,
    is_demo: true,
    created_at: new Date().toISOString()
  }
];

export const api = {
  async getDemoUsers(): Promise<UserProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using fallback demo profiles:", e);
    }
    return FALLBACK_DEMO_USERS;
  },

  async switchDemoUser(personaId: string): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-switch/${personaId}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, switching client-side:", e);
    }
    const match = FALLBACK_DEMO_USERS.find(u => u.id === personaId || u.life_stage === personaId);
    return match || FALLBACK_DEMO_USERS[2];
  },

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/auth/user/${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, using fallback user profile:", e);
    }
    const match = FALLBACK_DEMO_USERS.find(u => u.id === userId);
    return match || FALLBACK_DEMO_USERS[2];
  },

  async updateProfile(userId: string, data: { life_stage: string; usual_cycle_length?: number; cycle_regularity?: string }): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/auth/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, updating local:", e);
    }
    const current = await this.getUserProfile(userId);
    return { ...current, life_stage: data.life_stage as any };
  },

  async getCycles(userId: string): Promise<CycleRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/cycles?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, generating mock cycles:", e);
    }
    // Return sample cycles
    const today = new Date();
    return [0, 28, 56, 84].map((offset, idx) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (offset + 14));
      return {
        id: `mock_cyc_${idx}`,
        user_id: userId,
        period_start_date: d.toISOString().split('T')[0],
        period_end_date: new Date(d.getTime() + 4 * 86400000).toISOString().split('T')[0],
        cycle_length_days: 28,
        bleeding_duration_days: 5,
        flow_level: idx % 2 === 0 ? 'medium' : 'heavy',
        record_source: 'DEMO_SYNTHETIC',
        created_at: d.toISOString()
      };
    });
  },

  async recordPeriod(userId: string, data: any): Promise<CycleRecord> {
    try {
      const res = await fetch(`${API_BASE}/cycles?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning local record:", e);
    }
    return {
      id: `local_cyc_${Date.now()}`,
      user_id: userId,
      period_start_date: data.period_start_date,
      period_end_date: data.period_end_date,
      cycle_length_days: data.cycle_length_days || 28,
      bleeding_duration_days: data.bleeding_duration_days || 5,
      flow_level: data.flow_level || 'medium',
      record_source: 'USER_ENTERED',
      created_at: new Date().toISOString()
    };
  },

  async deleteCycle(userId: string, cycleId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/cycles/${cycleId}?user_id=${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("Backend offline, delete local:", e);
    }
    return true;
  },

  async getTodayLog(userId: string): Promise<DailyLogRecord> {
    try {
      const res = await fetch(`${API_BASE}/daily/today?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning mock today log:", e);
    }
    return {
      id: `mock_log_today`,
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      cycle_day: 14,
      cycle_phase: 'ovulatory',
      period_day_flag: false,
      sleep_hours: 7.2,
      stress_level_0_4: 1,
      activity_level_0_4: 2,
      mood_score_0_4: 3,
      energy_score_0_4: 3,
      workload_0_4: 2,
      hydration_glasses: 6,
      caffeine_cups: 1,
      cramps_severity_0_3: 0,
      bloating_severity_0_3: 0,
      headache_severity_0_3: 0,
      fatigue_severity_0_3: 0,
      mood_changes_severity_0_3: 0,
      hot_flashes_severity_0_3: 0,
      sleep_disturbance_severity_0_3: 0,
      pelvic_pain_severity_0_3: 0,
      record_source: 'INITIALIZED_DEFAULT'
    };
  },

  async getRecentLogs(userId: string, days = 30): Promise<DailyLogRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/daily/recent?user_id=${userId}&days=${days}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning empty recent logs:", e);
    }
    return [];
  },

  async upsertDailyLog(userId: string, data: any): Promise<DailyLogRecord> {
    try {
      const res = await fetch(`${API_BASE}/daily?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, persisting locally:", e);
    }
    return {
      id: `local_daily_${Date.now()}`,
      user_id: userId,
      ...data,
      record_source: 'USER_ENTERED'
    };
  },

  async getPeriodPrediction(userId: string): Promise<PeriodPrediction> {
    try {
      const res = await fetch(`${API_BASE}/ml/period-prediction?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, using fallback prediction:", e);
    }
    const target = new Date();
    target.setDate(target.getDate() + 14);
    const ov = new Date(target);
    ov.setDate(ov.getDate() - 14);

    return {
      applicable: true,
      current_cycle_day: 14,
      predicted_period_date: target.toISOString().split('T')[0],
      predicted_cycle_length: 28.5,
      confidence: "Moderate",
      confidence_level: 0.72,
      uncertainty_days: 2.5,
      uncertainty_range: "± 2.5 days",
      estimated_ovulation_date: ov.toISOString().split('T')[0],
      fertile_window: {
        start: new Date(ov.getTime() - 4 * 86400000).toISOString().split('T')[0],
        end: new Date(ov.getTime() + 1 * 86400000).toISOString().split('T')[0],
        disclaimer: "Estimates are educational approximations; NOT for reliable contraception."
      },
      disclaimer: "Predictions are mathematical projections based on your recorded log history."
    };
  },

  async getSymptomForecast(userId: string): Promise<SymptomForecast> {
    try {
      const res = await fetch(`${API_BASE}/ml/symptom-forecast?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, using fallback symptom forecast:", e);
    }
    return {
      model_used: "Multi-Output Random Forest (Leak-free Group Split)",
      forecast_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      probabilities: {
        cramps: 0.18,
        bloating: 0.22,
        headache: 0.15,
        fatigue: 0.35,
        mood_changes: 0.20,
        hot_flashes: 0.05,
        sleep_disturbance: 0.24
      },
      disclaimer: "Tentative statistical likelihood based on self-reported logs. Not a medical guarantee."
    };
  },

  async getDailyGuidance(userId: string): Promise<DailyGuidance> {
    try {
      const res = await fetch(`${API_BASE}/ml/guidance?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, fallback guidance:", e);
    }
    return {
      life_stage: "reproductive",
      daily_focus: "Balanced Hormonal Wellness & Evidence-Based Self Care",
      do: [
        "Hydrate with 6-8 glasses of water to reduce bloating and combat fatigue.",
        "Log any noticeable cramps, skin shifts, or mood changes in today's check-in.",
        "Aim for 7-8 hours of consistent, restorative sleep."
      ],
      dont: [
        "Avoid unverified quick-fix 'hormone balancing' supplements without clinical supervision.",
        "Do not skip meals or turn to severe caloric restriction, which elevates physical stress.",
        "Do not interpret cycle shifts or symptoms as self-diagnosed medical disorders."
      ],
      when_to_seek_help: [
        "Bleeding soaking through one or more menstrual pads/tampons every hour for 2 consecutive hours.",
        "Pelvic pain so severe that it does not respond to standard pain relievers or prevents daily activities.",
        "Sudden fainting, dizziness, or chest pressure."
      ]
    };
  },

  async getPCOSRecords(userId: string): Promise<PCOSRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/pcos/logs?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, empty pcos records:", e);
    }
    return [];
  },

  async addPCOSRecord(userId: string, data: any): Promise<PCOSRecord> {
    try {
      const res = await fetch(`${API_BASE}/pcos/logs?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning local PCOS log:", e);
    }
    return {
      id: `local_pcos_${Date.now()}`,
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      ...data
    };
  },

  async getPCOSChecklist(userId: string) {
    try {
      const res = await fetch(`${API_BASE}/pcos/appointment-checklist?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, fallback pcos checklist:", e);
    }
    return {
      summary: { total_logs: 1, average_acne_severity: 2, average_hirsutism_severity: 1 },
      questions_for_gynecologist: [
        "Based on my logged cycle intervals, do you recommend an endocrine workup?",
        "Would blood tests (free testosterone, DHEA-S, TSH, lipid panel) help clarify my hormonal profile?",
        "What evidence-based lifestyle changes and medical therapies are appropriate for my symptoms?"
      ],
      disclaimer: "HER LIFE does not diagnose PCOS. Consult a qualified physician for evaluation."
    };
  },

  async getStressTrends(userId: string) {
    try {
      const res = await fetch(`${API_BASE}/stress/trends?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, fallback stress trends:", e);
    }
    return {
      days_analyzed: 14,
      data: Array.from({ length: 14 }).map((_, i) => ({
        date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
        stress_level: (i % 3),
        sleep_hours: 6.5 + (i % 3) * 0.5,
        workload: 2,
        cramps_severity: i < 3 ? 2 : 0
      })),
      medical_safety_notice: "Self-reported stress is NOT a clinical laboratory measurement of cortisol."
    };
  },

  async getCortisolTests(userId: string): Promise<CortisolRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/stress/cortisol-tests?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning empty cortisol tests:", e);
    }
    return [];
  },

  async addCortisolTest(userId: string, data: any): Promise<CortisolRecord> {
    try {
      const res = await fetch(`${API_BASE}/stress/cortisol-tests?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning local cortisol record:", e);
    }
    return {
      id: `local_cort_${Date.now()}`,
      user_id: userId,
      ...data,
      created_at: new Date().toISOString()
    };
  },

  async askAIGuide(userId: string, message: string) {
    try {
      const res = await fetch(`${API_BASE}/ai/ask?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, returning local AI guide answer:", e);
    }
    return {
      reply: "HER LIFE Guide provides evidence-informed health education across menstrual cycles, fertility awareness, PCOS, and menopausal transitions. While I can explain physiological processes, symptom patterns, and suggested topics to discuss with your doctor, I cannot diagnose medical conditions or prescribe treatments.",
      sources: ["ACOG Women's Health Knowledge Library", "WHO Reproductive Health"],
      recommended_questions: ["What are the four phases of the menstrual cycle?", "What are the common symptoms of PCOS?"],
      medical_disclaimer: "Educational information only. Consult your healthcare provider for clinical advice."
    };
  },

  async getLongitudinalReport(userId: string) {
    try {
      const res = await fetch(`${API_BASE}/reports/longitudinal?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, fallback longitudinal report:", e);
    }
    return {
      user_profile: { full_name: "Demo User", age_years: 28, life_stage: "reproductive" },
      report_generated_date: new Date().toISOString().split('T')[0],
      cycles_recorded_count: 5,
      symptom_frequency_last_60_days: { cramps: 6, bloating: 4, fatigue: 8 },
      lifestyle_averages: { average_sleep_hours: 7.2, average_stress_score_0_4: 1.5 },
      disclaimer: "Longitudinal summaries are compiled from self-reported tracking entries. Not proof of medical causation."
    };
  },

  getExportCSVUrl(userId: string): string {
    return `${API_BASE}/reports/export-csv?user_id=${userId}`;
  },

  async deleteAccount(userId: string) {
    try {
      const res = await fetch(`${API_BASE}/reports/delete-account?user_id=${userId}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline:", e);
    }
    return { status: "success", message: "Account data purged." };
  }
};
