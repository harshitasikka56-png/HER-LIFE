import React, { useState } from 'react';
import { 
  Droplet, 
  Flame, 
  Heart, 
  Mic, 
  Moon, 
  Coffee, 
  Smile, 
  ShieldCheck, 
  ChevronRight, 
  Calendar,
  Utensils,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { UserProfile, PeriodPrediction } from '../types';
import { Language, translations } from '../services/i18n';

interface MenstrualDayGuideProps {
  currentUser: UserProfile;
  prediction: PeriodPrediction | null;
  language: Language;
  onOpenCheckIn: () => void;
  onOpenVoiceAssistant: () => void;
}

interface DayGuideDetail {
  day: number;
  label: string;
  flowPhase: string;
  flowBadge: string;
  flowColor: string;
  headline: string;
  crampGuidance: string;
  nutritionTip: string;
  hydrationTip: string;
  movementTip: string;
  sleepRestTip: string;
  saheliWhisper: string;
}

export const MenstrualDayGuide: React.FC<MenstrualDayGuideProps> = ({
  currentUser,
  prediction,
  language,
  onOpenCheckIn,
  onOpenVoiceAssistant
}) => {
  const isHinglish = language === 'hinglish';
  const isHindi = language === 'hi';

  // Calculate actual cycle day if available, otherwise default to day 1 or 2
  const today = new Date();
  const bleedingDays = currentUser.usual_bleeding_duration_days || 5;
  const cycleLength = currentUser.usual_cycle_length || 28;

  // Compute cycle day: if prediction has current_cycle_day, use it, else default to 2
  const currentDay = prediction?.current_cycle_day ? Math.min(prediction.current_cycle_day, 35) : 2;
  const [selectedDay, setSelectedDay] = useState<number>(Math.min(currentDay, bleedingDays));

  // Quick Check-in state
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [checkInResponse, setCheckInResponse] = useState<string | null>(null);

  const MOOD_CHIPS = [
    { id: 'cramps', label: isHinglish ? '⚡ Cramps' : isHindi ? '⚡ पेट दर्द' : '⚡ Cramps', tip: isHinglish ? 'Garam paani ki bottle ya heating pad lower abdomen par 15 minute rakhein. Saunf ya adrak ki chai cramps relax karegi.' : 'Apply a warm compress or hot water bottle to your lower pelvis for 15-20 mins. Warm ginger tea will soothe prostaglandins.' },
    { id: 'tired', label: isHinglish ? '😴 Thakan (Tired)' : isHindi ? '😴 थकान' : '😴 Low Energy', tip: isHinglish ? 'Day 1-2 par progesterone aur estrogen drop hone se fatigue normal hai. Aaj 30 minute jaldi so jayein aur halka khana lein.' : 'Hormone levels are at their lowest right now. Give yourself permission to slow down and rest without guilt.' },
    { id: 'bloated', label: isHinglish ? '🎈 Bloating' : isHindi ? '🎈 ब्लोटिंग' : '🎈 Bloating', tip: isHinglish ? 'Namak (sodium) aur carbonated drinks kam lein. Gun-guna paani aur cucumber/jeera water bloating kam karega.' : 'Sip warm water with a pinch of cumin or mint. Limit high-sodium snacks to minimize water retention.' },
    { id: 'calm', label: isHinglish ? '🌸 Calm & Peaceful' : isHindi ? '🌸 शांत' : '🌸 Calm', tip: isHinglish ? 'Bahut accha! Apne comfort routine ko continue rakhein aur hydrating fluids lete rahein.' : 'Wonderful! Honor your body’s quiet rhythm with mindful deep breathing and steady hydration.' },
    { id: 'energized', label: isHinglish ? '🌸 Active' : isHindi ? '🌸 ऊर्जावान' : '🌸 Good Mood', tip: isHinglish ? 'Shabash! Light yoga, walk ya journaling se apni energy channel karein.' : 'Great to hear! Gentle stretching or a short brisk walk in fresh air will elevate your endorphins.' }
  ];

  const DAY_GUIDANCE: DayGuideDetail[] = [
    {
      day: 1,
      label: 'Day 1',
      flowPhase: isHinglish ? 'Period Shuru (Onset)' : 'Period Onset',
      flowBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      flowColor: 'from-rose-500 to-rose-600',
      headline: isHinglish 
        ? 'Aapke period ka pehla din: Softness aur warm care' 
        : 'Day 1: Embrace Rest & Gentle Warmth',
      crampGuidance: isHinglish
        ? 'Uterine contractions prostaglandins release ki wajah se hoti hain. Lower abdomen par heating pad 20 minute lagayein.'
        : 'Uterine prostaglandins peak on Day 1. Apply a warm heating pad to your lower abdomen or lower back for 15-20 minutes.',
      nutritionTip: isHinglish
        ? 'Garam daal, khichdi, aur adrak ki chai lein. Cold drinks aur thanda khana avoid karein.'
        : 'Opt for warm, easily digestible meals like lentil soup, ginger broth, or oats. Avoid cold beverages.',
      hydrationTip: isHinglish
        ? 'Har 2 ghante mein 1 glass gun-guna paani. Kam se kam 8-9 glasses.'
        : 'Aim for 8-9 glasses of room temperature or warm water. Chamomile or fennel infusions reduce pelvic tension.',
      movementTip: isHinglish
        ? 'Heavy workout na karein. Child’s pose (Balasana) aur gentle stretches cramps shant karenge.'
        : 'Skip intense cardio. Reclined Butterfly pose (Supta Baddha Konasana) and slow deep diaphragmatic breathing relax the pelvic floor.',
      sleepRestTip: isHinglish
        ? 'Side sleeping (foetal position) pait par pressure kam karta hai.'
        : 'Sleep in the foetal position on your side to take pressure off abdominal muscles.',
      saheliWhisper: isHinglish
        ? '“Pehle din apna sabse zyada khayal rakhein. Har kaam turant karna zaroori nahi hai.”'
        : '“Be kind to yourself today. Day 1 is an invitation to pause, breathe, and slow your pace.”'
    },
    {
      day: 2,
      label: 'Day 2',
      flowPhase: isHinglish ? 'Peak Flow (Zyada Bleeding)' : 'Peak Flow Day',
      flowBadge: 'bg-red-100 text-red-800 border-red-200',
      flowColor: 'from-red-500 to-rose-600',
      headline: isHinglish 
        ? 'Day 2: Peak flow aur iron replenish karne ka din' 
        : 'Day 2: Managing Peak Flow & Restoring Iron',
      crampGuidance: isHinglish
        ? 'Flow heavy ho sakta hai. Period pads har 4-6 ghante mein change karein. Magnesium rich food cramps kam karega.'
        : 'Peak flow often coincides with strong cramps. Ensure prompt pad or menstrual cup hygiene every 4-6 hours.',
      nutritionTip: isHinglish
        ? 'Palak, chana, beetroot, ya anar jaise iron-rich foods lein taaki hemoglobin aur energy bani rahe.'
        : 'Prioritize iron-rich foods: spinach, beets, lentils, pomegranate, or dates paired with Vitamin C for absorption.',
      hydrationTip: isHinglish
        ? 'ORS ya coconut water (nariyal paani) electrolytes balance karega.'
        : 'Sip tender coconut water or electrolyte-infused water to replenish essential minerals lost with heavy bleeding.',
      movementTip: isHinglish
        ? 'Aaram sabse zaroori hai. Bas 10-15 minute ki gentle room walk kaafi hai.'
        : 'Allow yourself restful downtime. A slow 10-minute stroll or restorative legs-up-the-wall pose helps circulation.',
      sleepRestTip: isHinglish
        ? 'Pillow dono ghutnon ke beech rakh kar soyein, pelvic spine align rahegi.'
        : 'Place a soft pillow between your knees while sleeping on your side to relieve lower back pressure.',
      saheliWhisper: isHinglish
        ? '“Day 2 par thakan hona bilkul natural hai. Aapka shareer mehnat kar raha hai, uski suniye.”'
        : '“Your body is working hard today. Stay hydrated, keep warm, and honor your need for quiet rest.”'
    },
    {
      day: 3,
      label: 'Day 3',
      flowPhase: isHinglish ? 'Flow Kam Hona Shuru' : 'Flow Tapering',
      flowBadge: 'bg-rose-100 text-rose-700 border-rose-200',
      flowColor: 'from-rose-400 to-brand-500',
      headline: isHinglish 
        ? 'Day 3: Cramps shant hone lagte hain, energy wapas aati hai' 
        : 'Day 3: Flow Tapers & Energy Gently Rebounds',
      crampGuidance: isHinglish
        ? 'Cramps kaafi kam ho jate hain. Halka stretch aur deep breathing se bachi hui tightness nikal jayegi.'
        : 'Pelvic cramping typically subsides significantly. Cat-Cow stretches gently mobilize the lower spine.',
      nutritionTip: isHinglish
        ? 'Anti-inflammatory khana: Haldi doodh (Golden Milk), nuts (badaam/akhrot), aur fresh fruits.'
        : 'Incorporate anti-inflammatory foods: warm turmeric milk, walnuts, chia seeds, and citrus fruits.',
      hydrationTip: isHinglish
        ? 'Pudina (mint) paani ya jeera paani gas aur bloating dur karega.'
        : 'Mint or fennel tea works wonders for lingering bloating and digestive comfort.',
      movementTip: isHinglish
        ? '15-20 minute ki outdoor walk dhoop mein mood boost karegi.'
        : 'Enjoy a peaceful 20-minute morning walk in natural sunlight to regulate circadian rhythms and boost mood.',
      sleepRestTip: isHinglish
        ? 'Screen time sone se 45 minute pehle band karein taaki melatonin natural bane.'
        : 'Turn off blue screens 45 minutes before bedtime to support deep restorative REM sleep.',
      saheliWhisper: isHinglish
        ? '“Aapka shareer ab recovery mode mein hai. Halka aur khush-numa mehsus karein.”'
        : '“You are over the heaviest crest. Notice the gradual return of your clear, calm focus.”'
    },
    {
      day: 4,
      label: 'Day 4',
      flowPhase: isHinglish ? 'Halka Flow (Light Flow)' : 'Light Flow',
      flowBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      flowColor: 'from-amber-400 to-rose-400',
      headline: isHinglish 
        ? 'Day 4: Halka flow aur follicular phase ki taiyari' 
        : 'Day 4: Light Flow & Transition Toward Clarity',
      crampGuidance: isHinglish
        ? 'Cramps na ke barabar honge. Agar fir bhi dard ho, toh lower back par circular massage karein.'
        : 'Cramps are usually minimal. Light circular lower back massage with warm sesame or lavender oil provides comfort.',
      nutritionTip: isHinglish
        ? 'Protein aur fiber balance karein: paneer, sprouts, daal, green vegetables.'
        : 'Focus on balanced protein and fiber: tofu, sprouted mung, fresh greens, and whole grains.',
      hydrationTip: isHinglish
        ? '8 glasses paani daily habit maintain karein.'
        : 'Keep steady hydration with 8 full glasses throughout the day.',
      movementTip: isHinglish
        ? 'Gentle yoga, surya namaskar (slow), ya light cycling.'
        : 'Engage in gentle yoga flows or moderate brisk walking as physical stamina reawakens.',
      sleepRestTip: isHinglish
        ? 'Consistent 7-8 ghante ki uninterrupted neend.'
        : 'Aim for 7.5 to 8 hours of uninterrupted sleep to nourish cellular repair.',
      saheliWhisper: isHinglish
        ? '“Energy wapas aane lagi hai! Apne din ki nayi shuruat confidence ke saath karein.”'
        : '“Your stamina is quietly rising. Channel your fresh perspective into creative projects.”'
    },
    {
      day: 5,
      label: 'Day 5',
      flowPhase: isHinglish ? 'Aakhri Din / Spotting' : 'Spotting / Completion',
      flowBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      flowColor: 'from-emerald-400 to-teal-500',
      headline: isHinglish 
        ? 'Day 5: Period ka aakhri padav aur fresh feeling' 
        : 'Day 5: Cycle Renewal & Follicular Awakening',
      crampGuidance: isHinglish
        ? 'Bleeding spotting mein badal jati hai. Normal comfortable cotton innerwear use karein.'
        : 'Flow turns into light spotting. Breathable cotton underwear keeps the intimate area dry and comfortable.',
      nutritionTip: isHinglish
        ? 'Fermented food (dahi, curd, idli) gut microbiome balance karne ke liye behtareen hai.'
        : 'Probiotic-rich yogurt, fermented foods, and fresh seasonal berries help restore the gut and vaginal microbiome.',
      hydrationTip: isHinglish
        ? 'Lemon water with honey subah lein energy ke liye.'
        : 'A glass of warm water with lemon and honey kickstarts fresh metabolic vitality.',
      movementTip: isHinglish
        ? 'Full energy workout, dancing, ya pilates bina kisi rukawat ke!'
        : 'You can safely resume regular workouts, pilates, jogging, or dance sessions.',
      sleepRestTip: isHinglish
        ? 'Relaxing bedtime routine se subah fresh feel hoga.'
        : 'Maintain a peaceful sleep sanctuary. You will wake up feeling refreshed and energized.',
      saheliWhisper: isHinglish
        ? '“Mubarak ho, aapne is cycle ka bleeding phase paar kar liya! Aapka shareer behad shaktishali hai.”'
        : '“Congratulations on completing this bleeding phase. Your body is resilient and truly remarkable.”'
    }
  ];

  const activeGuidance = DAY_GUIDANCE.find(d => d.day === selectedDay) || DAY_GUIDANCE[0];

  function handleSelectMood(moodId: string, tip: string) {
    setSelectedMood(moodId);
    setCheckInResponse(tip);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: HerLife Daily Menstrual Guide */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                {isHinglish ? 'Rozana Period Guide' : 'Personalized Menstrual Day Guide'}
              </span>
              <span className="text-xs font-semibold text-warm-textMuted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                Cycle Day {currentDay} of ~{cycleLength}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-black text-warm-textDark mt-1">
              {isHinglish ? 'My HerLife Daily Guide (Din-Ba-Din Sahayata)' : 'Day-by-Day Cycle Companion'}
            </h3>
            <p className="text-xs text-warm-textMuted">
              {isHinglish 
                ? `Aapke periods aam taur par ${bleedingDays} din chalte hain (Total cycle ~${cycleLength} din). Har din ke mutabiq guidance dekhein.`
                : `Tailored day-by-day care calibrated for your ~${bleedingDays}-day bleeding duration and ${cycleLength}-day cycle length.`}
            </p>
          </div>

          <button
            onClick={onOpenVoiceAssistant}
            className="self-start sm:self-center px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white text-xs font-bold shadow-soft transition flex items-center gap-2 shrink-0"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isHinglish ? 'Saheli Se Baat Karein' : 'Talk with Saheli'}</span>
          </button>
        </div>

        {/* Horizontal Day Selector Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-warm-textDark">
            <span>{isHinglish ? 'Period ke din chunein:' : 'Select bleeding day:'}</span>
            <span className="text-brand-600 text-[11px]">
              {selectedDay === currentDay ? (isHinglish ? '📍 Aaj ka din' : '📍 Today') : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DAY_GUIDANCE.map((d) => {
              const isSelected = selectedDay === d.day;
              const isToday = currentDay === d.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDay(d.day)}
                  className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-b from-rose-500 to-brand-600 text-white border-transparent shadow-soft scale-102'
                      : 'bg-warm-cardMuted hover:bg-white text-warm-textDark border-warm-border'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black">{d.label}</span>
                    {isToday && (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-brand-500'} animate-ping`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold truncate max-w-[90px] ${
                    isSelected ? 'text-rose-100' : 'text-warm-textMuted'
                  }`}>
                    {d.flowPhase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detailed Guide Box */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-[#FFF9F7] via-white to-[#FDF4F2] rounded-2xl border border-rose-200/70 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-rose-100">
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeGuidance.flowBadge}`}>
                {activeGuidance.flowPhase}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-warm-textDark mt-1">
                {activeGuidance.headline}
              </h4>
            </div>
            <div className="text-xs text-warm-textMuted flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>Recommended daily rhythm</span>
            </div>
          </div>

          {/* 4 Pillars Grid (Comfort, Nutrition, Hydration, Sleep/Movement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Comfort & Cramps */}
            <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>{isHinglish ? 'Cramp Care & Comfort' : 'Cramp Relief & Comfort'}</span>
              </div>
              <p className="text-warm-textMuted text-[11px] leading-relaxed">
                {activeGuidance.crampGuidance}
              </p>
            </div>

            {/* 2. Nutrition */}
            <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-700">
                <Utensils className="w-4 h-4 text-amber-500" />
                <span>{isHinglish ? 'Poshan & Khana' : 'Nourishment & Iron'}</span>
              </div>
              <p className="text-warm-textMuted text-[11px] leading-relaxed">
                {activeGuidance.nutritionTip}
              </p>
            </div>

            {/* 3. Hydration */}
            <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-700">
                <Droplet className="w-4 h-4 text-cyan-500" />
                <span>{isHinglish ? 'Paani & Fluids' : 'Hydration & Electrolytes'}</span>
              </div>
              <p className="text-warm-textMuted text-[11px] leading-relaxed">
                {activeGuidance.hydrationTip}
              </p>
            </div>

            {/* 4. Sleep & Movement */}
            <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>{isHinglish ? 'Neend & Halka Aaram' : 'Rest, Movement & Sleep'}</span>
              </div>
              <p className="text-warm-textMuted text-[11px] leading-relaxed">
                {activeGuidance.sleepRestTip} • {activeGuidance.movementTip}
              </p>
            </div>
          </div>

          {/* Saheli Quote Whisper */}
          <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200/60 flex items-start gap-2.5 text-xs text-rose-900">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[11px] text-rose-800 block">
                {isHinglish ? 'Saheli Ka Sandesh:' : "Saheli's Gentle Whisper:"}
              </span>
              <p className="italic text-[11px] leading-snug">{activeGuidance.saheliWhisper}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proactive Saheli Daily Check-In Card */}
      <div className="bg-gradient-to-br from-white via-rose-50/30 to-plum-50/30 rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-soft space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-rose-100/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-soft">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-warm-textDark">
                {isHinglish ? 'Saheli Daily Check-In: Aaj aap kaisa feel kar rahi hain?' : 'Saheli Daily Check-In: How are you feeling right now?'}
              </h4>
              <p className="text-[11px] text-warm-textMuted">
                {isHinglish ? 'Ek tap karein aur turant personalized tip payein' : 'Tap an emotion or symptom for instant caring guidance'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCheckIn}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition shrink-0"
          >
            <span>Full Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mood / Feeling Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {MOOD_CHIPS.map((chip) => {
            const isSelected = selectedMood === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelectMood(chip.id, chip.tip)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition ${
                  isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-soft scale-105'
                    : 'bg-white hover:bg-rose-50 text-warm-textDark border-warm-border'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Instant Saheli Feedback Response */}
        {checkInResponse && (
          <div className="p-3.5 bg-white rounded-2xl border border-brand-200 text-xs text-warm-textDark shadow-2xs space-y-1 animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold text-brand-700">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{isHinglish ? 'Saheli Ki Salah:' : 'Saheli recommends:'}</span>
            </div>
            <p className="text-warm-textMuted leading-relaxed">{checkInResponse}</p>
          </div>
        )}
      </div>

      {/* Your Daily HerLife Note (Evening Motivational Affirmation) */}
      <div className="bg-gradient-to-r from-plum-700 via-brand-600 to-rose-600 rounded-3xl p-5 sm:p-6 text-white shadow-soft relative overflow-hidden">
        <div className="max-w-lg relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
              {isHinglish ? 'Roz Sham Ka Sandesh' : 'Your Daily HerLife Note'}
            </span>
            <span className="text-xs text-rose-200 font-medium">
              {today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-serif font-bold">
            {isHinglish 
              ? '“Aapki taqat aapke har badlaav ko apnane mein hai.”'
              : '“Your rhythm is your strength. Honor every phase of your story.”'}
          </h4>

          <p className="text-xs text-rose-100/90 leading-relaxed">
            {isHinglish
              ? 'Chahe aaj ka din aasan raha ho ya thoda thaka dene wala, yaad rakhein ki aapka shareer ek chamatkari biological cycle se guzar raha hai. Ek glass gun-guna paani pijiye aur shaanti se aaram kijiye.'
              : 'Whether today brought swift progress or called for quiet retreat, remember that cyclical rest is not lost time—it is how strength regenerates. Sip warm water, let go of today’s tasks, and sleep in deep peace.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-rose-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>HerLife Private Health Sanctuary • With you at every stage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
