/**
 * HER LIFE — Multilingual Localization & Voice Audio Configuration
 * Supports 14 Indian languages with native scripts, BCP-47 speech tags, and culturally empathetic guidance.
 */

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  speechTag: string;
  greeting: string;
  placeholder: string;
}

export const INDIAN_LANGUAGES: LanguageMeta[] = [
  { 
    code: 'en', 
    name: 'English (India)', 
    nativeName: 'English', 
    speechTag: 'en-IN', 
    greeting: 'Hello! I am Saheli, your private AI health companion. How are you feeling today?', 
    placeholder: 'Listening to your voice...' 
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिन्दी', 
    speechTag: 'hi-IN', 
    greeting: 'नमस्ते! मैं सहेली हूँ, आपकी पर्सनल हेल्थ साथी। आज आप कैसा महसूस कर रही हैं?', 
    placeholder: 'बोलिए, मैं सुन रही हूँ...' 
  },
  { 
    code: 'hinglish', 
    name: 'Hinglish', 
    nativeName: 'Hinglish', 
    speechTag: 'hi-IN', 
    greeting: 'Hello! Main Saheli hoon, aapki private health companion. Aaj aap kaisa feel kar rahi hain?', 
    placeholder: 'Boliye, main sun rahi hoon...' 
  },
  { 
    code: 'pa', 
    name: 'Punjabi', 
    nativeName: 'ਪੰਜਾਬੀ', 
    speechTag: 'pa-IN', 
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਹੇਲੀ ਹਾਂ, ਤੁਹਾਡੀ ਨਿੱਜੀ ਸਿਹਤ ਸਾਥੀ। ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?', 
    placeholder: 'ਬੋਲੋ, ਮੈਂ ਸੁਣ ਰਹੀ ਹਾਂ...' 
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    nativeName: 'বাংলা', 
    speechTag: 'bn-IN', 
    greeting: 'নমস্কার! আমি সহেলী, আপনার ব্যক্তিগত স্বাস্থ্য সঙ্গী। আজ আপনার কেমন লাগছে?', 
    placeholder: 'বলুন, আমি শুনছি...' 
  },
  { 
    code: 'ta', 
    name: 'Tamil', 
    nativeName: 'தமிழ்', 
    speechTag: 'ta-IN', 
    greeting: 'வணக்கம்! நான் சஹேலி, உங்கள் ஆரோக்கிய தோழி. இன்று உங்கள் உடல்நிலை எப்படி உள்ளது?', 
    placeholder: 'பேசுங்கள், நான் கேட்கிறேன்...' 
  },
  { 
    code: 'te', 
    name: 'Telugu', 
    nativeName: 'తెలుగు', 
    speechTag: 'te-IN', 
    greeting: 'నమస్కారం! నేను సహేలి, మీ వ్యక్తిగత ఆరోగ్య స్నేహితురాలిని. ఈ రోజు మీకు ఎలా ఉంది?', 
    placeholder: 'మాట్లాడండి, నేను వింటున్నాను...' 
  },
  { 
    code: 'mr', 
    name: 'Marathi', 
    nativeName: 'मराठी', 
    speechTag: 'mr-IN', 
    greeting: 'नमस्कार! मी सहेली, तुमची वैयक्तिक आरोग्य मैत्रीण. आज तुम्हाला कसे वाटत आहे?', 
    placeholder: 'बोला, मी ऐकत आहे...' 
  },
  { 
    code: 'gu', 
    name: 'Gujarati', 
    nativeName: 'ગુજરાતી', 
    speechTag: 'gu-IN', 
    greeting: 'નમસ્તે! હું સહેલી છું, તમારી સ્વાસ્થ્ય સાથી. આજે તમે કેવું અનુભવી રહ્યા છો?', 
    placeholder: 'બોલો, હું સાંભળી રહી છું...' 
  },
  { 
    code: 'kn', 
    name: 'Kannada', 
    nativeName: 'ಕನ್ನಡ', 
    speechTag: 'kn-IN', 
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಸಹೇಲಿ, ನಿಮ್ಮ ಆರೋಗ್ಯ ಒಡನಾಡಿ. ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯ ಹೇಗಿದೆ?', 
    placeholder: 'ಮಾತನಾಡಿ, ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ...' 
  },
  { 
    code: 'ml', 
    name: 'Malayalam', 
    nativeName: 'മലയാളം', 
    speechTag: 'ml-IN', 
    greeting: 'നമസ്കാരം! ഞാൻ സഹേലി, നിങ്ങളുടെ ആരോഗ്യ കൂട്ടുകാരി. ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?', 
    placeholder: 'സംസാരിക്കൂ, ഞാൻ കേൾക്കുന്നുണ്ട്...' 
  },
  { 
    code: 'or', 
    name: 'Odia', 
    nativeName: 'ଓଡ଼ିଆ', 
    speechTag: 'or-IN', 
    greeting: 'ନମସ୍କାର! ମୁଁ ସହେଲୀ, ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ। ଆଜି ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?', 
    placeholder: 'କୁହନ୍ତୁ, ମୁଁ ଶୁଣୁଛି...' 
  },
  { 
    code: 'ur', 
    name: 'Urdu', 
    nativeName: 'اردو', 
    speechTag: 'ur-IN', 
    greeting: 'السلام علیکم! میں سہیلی ہوں، آپ کی صحت کی ساتھی۔ آج آپ کیسا محسوس کر رہی ہیں؟', 
    placeholder: 'فرمائیے، میں سن رہی ہوں...' 
  },
  { 
    code: 'as', 
    name: 'Assamese', 
    nativeName: 'অসমীয়া', 
    speechTag: 'as-IN', 
    greeting: 'নমস্কাৰ! মই সহেলী, আপোনাৰ ব্যক্তিগত স্বাস্থ্য সতীৰ্থ। আজি আপোনাৰ কেনে লাগিছে?', 
    placeholder: 'কওক, মই শুনি আছো...' 
  }
];

export type Language = string;

export const translations: Record<string, any> = {
  en: {
    app_tagline: "Every Stage. Every Cycle. Every You.",
    demo_badge: "DEMO DATA — SYNTHETIC, NOT REAL PATIENT RECORDS",
    cycle_day: "Cycle Day",
    next_period: "Estimated Next Period",
    confidence: "Prediction Confidence",
    fertile_window: "Estimated Fertile Window",
    daily_checkin: "Daily Check-In",
    ask_ai: "Ask Health Guide",
    nav: {
      dashboard: "Dashboard",
      hercare: "HER CARE",
      hermove: "HER MOVE",
      calendar: "Calendar & Cycles",
      checkin: "Daily Check-In",
      pcos: "PCOS Center",
      stress: "Stress & Sleep",
      lifestages: "Life Stages",
      firstperiod: "First Period Guide",
      aiguide: "AI Health Guide",
      reports: "Health Timeline",
      privacy: "Privacy & Safety"
    },
    metrics: {
      sleep: "Logged Sleep",
      stress: "Stress Rating",
      hydration: "Hydration",
      energy: "Energy & Mood",
      balanced: "Balanced & Rested",
      fatigue: "Mild Fatigue"
    },
    guidance: {
      title: "Daily Routine & Clinical Guidance",
      subtitle: "Personalized to your current reproductive life stage",
      do_title: "DO (Recommended)",
      dont_title: "DON'T (Avoid)",
      seek_help_title: "WHEN TO SEEK CLINICAL CARE"
    },
    notifications: {
      title: "Smart Pre-Notification System",
      subtitle: "Timely alerts before periods, ovulation & daily check-ins",
      advance_warning: "Advance Period Warning",
      advance_desc: "Receive proactive alerts 1 to 3 days before your estimated period starts",
      test_btn: "Send Test Notification",
      test_success: "Test notification delivered to screen!",
      discrete_active: "Discrete Mode Active (Personal reproductive terms masked on lockscreen)"
    },
    symptoms: {
      cramps: "Menstrual Cramps (Dysmenorrhea)",
      bloating: "Abdominal Bloating",
      headache: "Headache / Migraine",
      fatigue: "Fatigue / Low Energy",
      mood_changes: "Mood Sensitivity",
      hot_flashes: "Vasomotor / Hot Flashes",
      sleep_disturbance: "Sleep Disturbance",
      pelvic_pain: "Pelvic Discomfort"
    }
  },
  hinglish: {
    app_tagline: "Every Stage. Every Cycle. Every You.",
    demo_badge: "DEMO DATA — SYNTHETIC, NOT REAL PATIENT RECORDS",
    cycle_day: "Cycle Day",
    next_period: "Estimated Next Period",
    confidence: "Prediction Confidence",
    fertile_window: "Estimated Fertile Window",
    daily_checkin: "Daily Check-In",
    ask_ai: "Ask Health Guide",
    nav: {
      dashboard: "Dashboard",
      hercare: "HER CARE",
      hermove: "HER MOVE",
      calendar: "Calendar & Cycles",
      checkin: "Daily Check-In",
      pcos: "PCOS Center",
      stress: "Stress & Sleep",
      lifestages: "Life Stages",
      firstperiod: "First Period Guide",
      aiguide: "AI Health Guide",
      reports: "Health Timeline",
      privacy: "Privacy & Safety"
    },
    metrics: {
      sleep: "Logged Sleep",
      stress: "Stress Rating",
      hydration: "Hydration",
      energy: "Energy & Mood",
      balanced: "Balanced & Rested",
      fatigue: "Mild Fatigue"
    },
    guidance: {
      title: "Daily Routine & Clinical Guidance",
      subtitle: "Personalized to your current reproductive life stage",
      do_title: "DO (Recommended)",
      dont_title: "DON'T (Avoid)",
      seek_help_title: "WHEN TO SEEK CLINICAL CARE"
    },
    notifications: {
      title: "Smart Pre-Notification System",
      subtitle: "Advance reminders before cycles & check-ins",
      advance_warning: "Advance Period Warning",
      advance_desc: "Receive proactive alerts 1 to 3 days before your estimated period",
      test_btn: "Send Test Notification",
      test_success: "Test notification delivered to screen!",
      discrete_active: "Discrete Mode Active (Personal terms masked)"
    },
    symptoms: {
      cramps: "Menstrual Cramps",
      bloating: "Abdominal Bloating",
      headache: "Headache",
      fatigue: "Fatigue / Low Energy",
      mood_changes: "Mood Sensitivity",
      hot_flashes: "Hot Flashes",
      sleep_disturbance: "Sleep Disturbance",
      pelvic_pain: "Pelvic Discomfort"
    }
  }
};
