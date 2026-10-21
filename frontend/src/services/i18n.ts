/**
 * HER LIFE — Bilingual Localization (English & Everyday Hinglish)
 * Designed for practical, everyday accessibility without intimidating medical jargon.
 */

export type Language = 'en' | 'hinglish';

export const translations = {
  en: {
    app_tagline: "Every Stage. Every Cycle. Every You.",
    demo_badge: "DEMO DATA — SYNTHETIC, NOT REAL PATIENT RECORDS",
    cycle_day: "Cycle Day",
    next_period: "Estimated Next Period",
    confidence: "Confidence",
    fertile_window: "Estimated Fertile Window",
    daily_checkin: "Daily Check-In",
    ask_ai: "Ask HER LIFE Guide",
    nav: {
      dashboard: "Dashboard",
      calendar: "Calendar & Cycles",
      checkin: "Daily Check-In",
      pcos: "PCOS Center",
      stress: "Stress & Hormones",
      lifestages: "Life Stages",
      firstperiod: "First Period Guide 🌸",
      aiguide: "AI Guide",
      reports: "Health Timeline",
      privacy: "Privacy & Safety"
    },
    metrics: {
      sleep: "Logged Sleep",
      stress: "Stress Rating",
      hydration: "Hydration",
      energy: "Energy & Mood",
      balanced: "Balanced",
      fatigue: "Mild Fatigue"
    },
    guidance: {
      title: "Daily Routine & Guidance",
      subtitle: "Tailored to your current life stage",
      do_title: "DO (Recommended)",
      dont_title: "DON'T (Avoid)",
      seek_help_title: "WHEN TO SEEK HELP"
    },
    notifications: {
      title: "Smart Pre-Notification System",
      subtitle: "Advance alerts before periods, ovulation & daily check-ins",
      advance_warning: "Advance Period Warning",
      advance_desc: "Receive alert 1, 2, or 3 days before your estimated period starts",
      test_btn: "Send Test Notification",
      test_success: "Test alert triggered on your screen!",
      discrete_active: "Discrete mode is ON (Private terms hidden on lockscreen)"
    },
    symptoms: {
      cramps: "Menstrual Cramps / Pain",
      bloating: "Bloating / Fullness",
      headache: "Headache",
      fatigue: "Fatigue / Low Energy",
      mood_changes: "Mood Sensitivity",
      hot_flashes: "Hot Flashes",
      sleep_disturbance: "Sleep Disturbance",
      pelvic_pain: "Pelvic Discomfort"
    }
  },
  hinglish: {
    app_tagline: "Har Umar. Har Cycle. Aapka Apna Saathi.",
    demo_badge: "DEMO DATA — SYNTHETIC, ASLI PATIENT DATA NAHI HAI",
    cycle_day: "Cycle Ka Din",
    next_period: "Agla Period Kab Aayega",
    confidence: "Andaza Accuracy",
    fertile_window: "Fertile Window (Pregnant hone ke chances)",
    daily_checkin: "Roz Ka Check-In",
    ask_ai: "AI Saheli Se Poochein",
    nav: {
      dashboard: "Aaj Ka Summary",
      calendar: "Period Calendar",
      checkin: "Roz Ka Check-In",
      pcos: "PCOS Awareness",
      stress: "Stress Aur Neend",
      lifestages: "Life Stage Hub",
      firstperiod: "Pehla Period Guide 🌸",
      aiguide: "AI Saheli Guide",
      reports: "Doctor Report",
      privacy: "Privacy Aur Suraksha"
    },
    metrics: {
      sleep: "Neend Ka Time",
      stress: "Tension / Stress Level",
      hydration: "Paani (Glasses)",
      energy: "Energy Aur Mood",
      balanced: "Sab Theek Hai",
      fatigue: "Thoda Thaka Hua"
    },
    guidance: {
      title: "Rozana Ki Routine Aur Tips",
      subtitle: "Aapki body aur stage ke hisaab se",
      do_title: "KAREIN (Faydemand Aadatein)",
      dont_title: "NA KAREIN (Bachna Chahiye)",
      seek_help_title: "DOCTOR KO KAB DIKHAYEIN"
    },
    notifications: {
      title: "Smart Pre-Notification System",
      subtitle: "Periods aane se pehle advance alerts aur daily reminders",
      advance_warning: "Period Shuru Hone Ka Advance Alert",
      advance_desc: "Periods shuru hone se 1, 2 ya 3 din pehle reminder paayein taaki aap ready rahein",
      test_btn: "Test Notification Bhejein",
      test_success: "Test alert screen par dikhayi de raha hai!",
      discrete_active: "Discrete mode ON hai (Lockscreen par private shabd hide rahenge)"
    },
    symptoms: {
      cramps: "Pet / Kamar Dard (Cramps)",
      bloating: "Pet Phoolna (Bloating)",
      headache: "Sar Dard (Headache)",
      fatigue: "Thakaan / Sustee (Fatigue)",
      mood_changes: "Chidchidapan / Mood Swings",
      hot_flashes: "Achanak Garmi Lagna (Hot Flashes)",
      sleep_disturbance: "Neend Na Aana",
      pelvic_pain: "Neeche Ka Dard (Pelvic Pain)"
    }
  }
};
