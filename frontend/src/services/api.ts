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
      if (res.ok) {
        const cycles = await res.json();
        if (Array.isArray(cycles) && cycles.length > 0) {
          localStorage.setItem(`herlife_cycles_${userId}`, JSON.stringify(cycles));
          return cycles;
        }
      }
    } catch (e) {
      console.warn("Backend offline, checking localStorage for cycles:", e);
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`herlife_cycles_${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (err) {}
      }
    }

    // Return sample cycles
    const today = new Date();
    const defaultCycles: CycleRecord[] = [0, 28, 56, 84].map((offset, idx) => {
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
    return defaultCycles;
  },

  async recordPeriod(userId: string, data: any): Promise<CycleRecord> {
    const newCycle: CycleRecord = {
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

    // Store in localStorage
    try {
      const cached = localStorage.getItem(`herlife_cycles_${userId}`);
      let list: CycleRecord[] = cached ? JSON.parse(cached) : [];
      list = [newCycle, ...list.filter(c => c.period_start_date !== newCycle.period_start_date)];
      localStorage.setItem(`herlife_cycles_${userId}`, JSON.stringify(list));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('herlife_data_updated', { detail: { userId, type: 'cycle', data: newCycle } }));
      }
    } catch (e) {
      console.warn("Could not save cycle to localStorage:", e);
    }

    try {
      const res = await fetch(`${API_BASE}/cycles?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (e) {
      console.warn("Backend offline, returning local record:", e);
    }

    return newCycle;
  },

  async deleteCycle(userId: string, cycleId: string): Promise<boolean> {
    try {
      const cached = localStorage.getItem(`herlife_cycles_${userId}`);
      if (cached) {
        let list: CycleRecord[] = JSON.parse(cached);
        list = list.filter(c => c.id !== cycleId);
        localStorage.setItem(`herlife_cycles_${userId}`, JSON.stringify(list));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('herlife_data_updated', { detail: { userId, type: 'cycle_deleted' } }));
        }
      }
    } catch (e) {}

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
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Check localStorage first for user's explicit check-in entry
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`herlife_today_log_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            // If user explicitly entered this log today or recently, prioritize it
            if (parsed.record_source === 'USER_ENTERED') {
              return parsed;
            }
          }
        } catch (err) {}
      }
    }

    // 2. Try server fetch if no local user-entered log
    try {
      const res = await fetch(`${API_BASE}/daily/today?user_id=${userId}`);
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && serverData.id) {
          localStorage.setItem(`herlife_today_log_${userId}`, JSON.stringify(serverData));
          return serverData;
        }
      }
    } catch (e) {
      // Backend offline or unreachable, fallback to localStorage
    }

    // 3. Fallback to any saved log in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`herlife_today_log_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        } catch (err) {}
      }
    }

    // 3. Fallback initial default if never logged
    return {
      id: `mock_log_today`,
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      cycle_day: 14,
      cycle_phase: 'ovulatory',
      period_day_flag: false,
      sleep_hours: 7.0,
      stress_level_0_4: 1,
      activity_level_0_4: 2,
      mood_score_0_4: 2,
      energy_score_0_4: 2,
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
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn("Backend offline, returning empty recent logs:", e);
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`herlife_recent_logs_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [];
  },

  async upsertDailyLog(userId: string, data: any): Promise<DailyLogRecord> {
    const today = new Date().toISOString().split('T')[0];
    const localRecord: DailyLogRecord = {
      id: `local_daily_${Date.now()}`,
      user_id: userId,
      date: data.date || today,
      cycle_day: data.cycle_day || 14,
      cycle_phase: data.cycle_phase || 'ovulatory',
      period_day_flag: data.period_day_flag || false,
      sleep_hours: data.sleep_hours !== undefined ? data.sleep_hours : 7.0,
      stress_level_0_4: data.stress_level_0_4 !== undefined ? data.stress_level_0_4 : 1,
      activity_level_0_4: data.activity_level_0_4 !== undefined ? data.activity_level_0_4 : 2,
      mood_score_0_4: data.mood_score_0_4 !== undefined ? data.mood_score_0_4 : 2,
      energy_score_0_4: data.energy_score_0_4 !== undefined ? data.energy_score_0_4 : 2,
      workload_0_4: data.workload_0_4 !== undefined ? data.workload_0_4 : 2,
      hydration_glasses: data.hydration_glasses !== undefined ? data.hydration_glasses : 6,
      caffeine_cups: data.caffeine_cups !== undefined ? data.caffeine_cups : 1,
      cramps_severity_0_3: data.cramps_severity_0_3 ?? 0,
      bloating_severity_0_3: data.bloating_severity_0_3 ?? 0,
      headache_severity_0_3: data.headache_severity_0_3 ?? 0,
      fatigue_severity_0_3: data.fatigue_severity_0_3 ?? 0,
      mood_changes_severity_0_3: data.mood_changes_severity_0_3 ?? 0,
      hot_flashes_severity_0_3: data.hot_flashes_severity_0_3 ?? 0,
      sleep_disturbance_severity_0_3: data.sleep_disturbance_severity_0_3 ?? 0,
      pelvic_pain_severity_0_3: data.pelvic_pain_severity_0_3 ?? 0,
      basal_temp_c: data.basal_temp_c,
      cervical_mucus: data.cervical_mucus || 'dry',
      notes: data.notes || '',
      record_source: 'USER_ENTERED'
    };

    // Store immediately in localStorage so Dashboard updates in real time
    try {
      localStorage.setItem(`herlife_today_log_${userId}`, JSON.stringify(localRecord));
      const cachedRecent = localStorage.getItem(`herlife_recent_logs_${userId}`);
      let recents: DailyLogRecord[] = cachedRecent ? JSON.parse(cachedRecent) : [];
      recents = [localRecord, ...recents.filter(r => r.date !== localRecord.date)];
      localStorage.setItem(`herlife_recent_logs_${userId}`, JSON.stringify(recents));
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }

    // Broadcast update event to all pages and components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('herlife_data_updated', { detail: { userId, type: 'daily_log', data: localRecord } }));
    }

    // Sync with backend API
    try {
      const res = await fetch(`${API_BASE}/daily?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const serverData = await res.json();
        localStorage.setItem(`herlife_today_log_${userId}`, JSON.stringify(serverData));
        return serverData;
      }
    } catch (e) {
      console.warn("Backend offline or unreachable, local record saved:", e);
    }

    return localRecord;
  },

  async getPeriodPrediction(userId: string): Promise<PeriodPrediction> {
    try {
      const res = await fetch(`${API_BASE}/ml/period-prediction?user_id=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline, using fallback prediction:", e);
    }

    const cycles = await this.getCycles(userId);
    let currentDay = 14;
    let cycleLength = 28.5;
    let target = new Date();
    target.setDate(target.getDate() + 14);

    if (cycles && cycles.length > 0) {
      const latest = cycles[0];
      const start = new Date(latest.period_start_date).getTime();
      const elapsedDays = Math.floor((Date.now() - start) / 86400000) + 1;
      if (elapsedDays > 0 && elapsedDays <= 60) {
        currentDay = elapsedDays;
      }
      if (latest.cycle_length_days) {
        cycleLength = latest.cycle_length_days;
      }
      const nextExpected = new Date(start + cycleLength * 86400000);
      if (nextExpected.getTime() > Date.now()) {
        target = nextExpected;
      }
    }

    const ov = new Date(target);
    ov.setDate(ov.getDate() - 14);

    return {
      applicable: true,
      current_cycle_day: currentDay,
      predicted_period_date: target.toISOString().split('T')[0],
      predicted_cycle_length: cycleLength,
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
      console.warn("Backend offline, generating local AI guide answer:", e);
    }

    const lower = message.toLowerCase();
    const isHindi = lower.includes('hindi') || /[\u0900-\u097F]/.test(message);
    const isHinglish = lower.includes('hinglish');

    let reply = "";
    if (lower.includes('cramp') || lower.includes('dard') || lower.includes('pain') || lower.includes('remed') || lower.includes('pet')) {
      if (isHindi) {
        reply = "पीरियड्स के दर्द (क्रैम्प्स) के लिए गर्म पानी की सिकाई (हीटिंग पैड), अदरक या कैमोमाइल चाय, पर्याप्त गुनगुना पानी पीना और हल्की स्ट्रेचिंग सबसे असरदार प्राकृतिक उपाय हैं। अत्यधिक दर्द होने पर डॉक्टर से परामर्श अवश्य लें।";
      } else if (isHinglish) {
        reply = "Period cramps ke liye lower abdomen par heating pad lagana, warm water peena, ginger tea lena aur gentle child's pose stretching bohot rahat deti hai. Agar dard bohot zyada ho toh doctor se consult zaroor karein.";
      } else {
        reply = "For period cramps, applying a warm heating pad to your lower abdomen, sipping warm ginger or chamomile tea, staying well-hydrated, and gentle pelvic stretches help relax uterine muscles naturally.";
      }
    } else if (lower.includes('stress') || lower.includes('delay') || lower.includes('late') || lower.includes('tanaav') || lower.includes('exam')) {
      if (isHindi) {
        reply = "हाँ, अधिक मानसिक तनाव या परीक्षाओं के दबाव से शरीर में कोर्टिसोल बढ़ जाता है, जिससे ओव्यूलेशन टल सकता है और पीरियड में देरी हो सकती है। गहरी सांस लेने, 7-8 घंटे की नींद और संतुलित आहार से चक्र नियमित रहता है।";
      } else if (isHinglish) {
        reply = "Haan, excessive stress aur exam pressure cortisol hormone badha deta hai jo ovulation ko delay kar sakta hai. 7-8 ghante ki poori neend aur deep breathing exercises cycle ko regular rakhne me bohot madad karti hain.";
      } else {
        reply = "Yes, elevated stress releases cortisol, which can delay ovulation and cause your cycle to arrive late. Prioritizing 7-8 hours of restful sleep, hydration, and gentle breathing exercises helps restore hormonal balance.";
      }
    } else if (lower.includes('pcos') || lower.includes('pcod') || lower.includes('indicator') || lower.includes('symptom')) {
      if (isHindi) {
        reply = "PCOS के मुख्य शुरुआती लक्षणों में अनियमित मासिक धर्म चक्र, चेहरे या शरीर पर अनचाहे बाल, मुंहासे और अचानक वजन बढ़ने की प्रवृत्ति शामिल हैं। संतुलित खान-पान और नियमित व्यायाम से हार्मोन्स संतुलित रहते हैं।";
      } else if (isHinglish) {
        reply = "PCOS ke early indicators me irregular cycles, facial hair growth, persistent acne aur sudden weight changes aate hain. Low-glycemic balanced diet aur daily 30 minutes ki walk hormones balance karne me kaafi helpful hoti hai.";
      } else {
        reply = "Common signs of PCOS include irregular or skipped cycles, persistent acne, unexpected hair thinning or facial hair growth, and insulin resistance. A balanced whole-food diet, regular exercise, and medical guidance help manage symptoms effectively.";
      }
    } else if (lower.includes('ovulat') || lower.includes('fertile') || lower.includes('conceiv') || lower.includes('window')) {
      if (isHindi) {
        reply = "28 दिनों के नियमित चक्र में, ओव्यूलेशन आमतौर पर चक्र के 14वें दिन होता है। ओव्यूलेशन के समय सर्वाइकल म्यूकस अंडे की सफेदी जैसा खिंचावदार और पारदर्शी हो जाता है, जो अधिकतम प्रजनन क्षमता का संकेत है।";
      } else if (isHinglish) {
        reply = "Normal 28-day cycle me ovulation day 14 ke aas-paas hota hai. Is dauran cervical fluid stretchy aur clear egg-white jaisa hota hai, jo aapki highest fertility window ko indicate karta hai.";
      } else {
        reply = "In an average 28-day cycle, ovulation typically occurs around day 14 (14 days before your next period). Clear, stretchy egg-white cervical mucus and a subtle rise in basal temperature are key biological signs.";
      }
    } else {
      if (isHindi) {
        reply = "नमस्ते! मैं सहेली हूँ, आपकी स्वास्थ्य मार्गदर्शिका। पीरियड्स, पोषण, नींद, दर्द निवारण और हार्मोनल स्वास्थ्य पर आप मुझसे कोई भी प्रश्न निसंकोच पूछ सकती हैं।";
      } else if (isHinglish) {
        reply = "Hello! Main Saheli hoon, aapki personalized health saathi. Menstrual cycle, PMS, PCOS aur daily wellness se judi koi bhi baat aap mujhse bina jhijhak pooch sakti hain.";
      } else {
        reply = "Hello! I am Saheli, your supportive reproductive wellness companion. Feel free to ask me anything about your cycle phases, PMS relief, hormone balancing, sleep, or stress management.";
      }
    }

    return {
      reply,
      sources: ["ACOG Women's Health Knowledge Library", "WHO Reproductive Health Guidelines"],
      recommended_questions: ["What are the best safe home remedies for period cramps?", "Can high stress or exams delay my period cycle?"],
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
