import React, { useEffect, useState } from 'react';
import { UserProfile, PeriodPrediction, SymptomForecast, DailyGuidance, DailyLogRecord } from '../types';
import { api } from '../services/api';
import { PredictionCard } from '../components/PredictionCard';
import { SymptomForecastCard } from '../components/SymptomForecastCard';
import { DailyGuidanceCard } from '../components/DailyGuidanceCard';
import { DailyRewardCard } from '../components/DailyRewardCard';
import { FirstPeriodEducationSlide } from '../components/FirstPeriodEducationSlide';
import { CycleWheelDial } from '../components/CycleWheelDial';
import { MenstrualDayGuide } from '../components/MenstrualDayGuide';
import { Moon, Zap, Droplets, ArrowRight, HeartPulse, Bot } from 'lucide-react';
import { LotusBloomIcon } from '../components/common/LotusBloomIcon';
import { Language, translations } from '../services/i18n';

interface DashboardPageProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: any) => void;
  language: Language;
  onOpenVoiceAssistant?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  currentUser, 
  onNavigateTab, 
  language,
  onOpenVoiceAssistant = () => {}
}) => {
  const [prediction, setPrediction] = useState<PeriodPrediction | null>(null);
  const [forecast, setForecast] = useState<SymptomForecast | null>(null);
  const [guidance, setGuidance] = useState<DailyGuidance | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLogRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const isHinglish = language === 'hinglish';
  const t = translations[language];

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [predData, forecastData, guideData, logData] = await Promise.all([
          api.getPeriodPrediction(currentUser.id),
          api.getSymptomForecast(currentUser.id),
          api.getDailyGuidance(currentUser.id),
          api.getTodayLog(currentUser.id),
        ]);
        if (isMounted) {
          setPrediction(predData);
          setForecast(forecastData);
          setGuidance(guideData);
          setTodayLog(logData);
        }
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    // Listen for check-in or cycle log updates from any tab or component
    const handleDataUpdate = () => {
      loadData();
    };
    window.addEventListener('herlife_data_updated', handleDataUpdate);

    return () => { 
      isMounted = false;
      window.removeEventListener('herlife_data_updated', handleDataUpdate);
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-warm-textMuted">
        <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium">
          {isHinglish ? 'Aapka health summary load ho raha hai...' : 'Loading personalized health intelligence...'}
        </p>
      </div>
    );
  }

  const firstName = currentUser.full_name.split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-plum-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="max-w-xl relative z-10">
          <span className="text-[11px] uppercase tracking-wider font-bold text-brand-100 bg-white/15 px-3 py-1 rounded-full border border-white/20 inline-block mb-2">
            Personalized Health Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">
            Welcome back, {firstName}
          </h2>
          <p className="text-xs sm:text-sm text-brand-100/90 mt-2 leading-relaxed">
            Your daily reproductive biomarker forecast and personalized routine are synchronized. Review your metrics and upcoming cycle milestones below.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="bg-white text-brand-700 hover:bg-brand-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-soft transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t.daily_checkin}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('aiguide')}
              className="bg-brand-700/60 hover:bg-brand-700/80 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <LotusBloomIcon className="w-3.5 h-3.5 text-brand-200" />
              <span>Ask Health Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aesthetic Circular Menstrual Dial - Prominently at top of dashboard */}
      <CycleWheelDial
        prediction={prediction}
        lifeStage={currentUser.life_stage}
        onLogClick={() => onNavigateTab('checkin')}
      />

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Sleep metric */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium block">{t.metrics.sleep}</span>
            <div className="text-lg font-bold text-warm-textDark">
              {todayLog?.sleep_hours !== undefined ? todayLog.sleep_hours : 7.0} hrs
            </div>
          </div>
        </div>

        {/* Stress metric */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium block">{t.metrics.stress}</span>
            <div className="text-lg font-bold text-warm-textDark">
              Level {todayLog?.stress_level_0_4 !== undefined ? todayLog.stress_level_0_4 : 1} / 4
            </div>
          </div>
        </div>

        {/* Hydration metric */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium block">{t.metrics.hydration}</span>
            <div className="text-lg font-bold text-warm-textDark">
              {todayLog?.hydration_glasses !== undefined ? todayLog.hydration_glasses : 6} / 8 glasses
            </div>
          </div>
        </div>

        {/* Mood & Energy */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium block">{t.metrics.energy}</span>
            <div className="text-base sm:text-lg font-bold text-warm-textDark">
              {todayLog?.energy_score_0_4 !== undefined
                ? (todayLog.energy_score_0_4 >= 3
                    ? (isHinglish ? 'Urja Aur Rested' : 'Vibrant & Rested')
                    : todayLog.energy_score_0_4 === 2
                    ? t.metrics.balanced
                    : (isHinglish ? 'Thakan & Low' : t.metrics.fatigue))
                : t.metrics.balanced}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Affirmation & Wellness Gesture Card */}
      <DailyRewardCard
        userName={currentUser.full_name}
        language={language}
        sleepHours={todayLog?.sleep_hours || 7.0}
        hydrationGlasses={todayLog?.hydration_glasses || 6}
        stressLevel={todayLog?.stress_level_0_4 || 1}
      />

      {/* Beginner Education Deck — shown prominently for Puberty & Teen stage */}
      {currentUser.life_stage === 'teen_menarche' && (
        <FirstPeriodEducationSlide
          language={language}
          defaultExpanded={true}
        />
      )}

      {/* Menstrual Day-by-Day Guide & Proactive Saheli Check-In */}
      <MenstrualDayGuide
        currentUser={currentUser}
        prediction={prediction}
        language={language}
        onOpenCheckIn={() => onNavigateTab('checkin')}
        onOpenVoiceAssistant={onOpenVoiceAssistant}
      />

      {/* Main Prediction & Symptom Forecasting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PredictionCard prediction={prediction} lifeStage={currentUser.life_stage} />
          <DailyGuidanceCard guidance={guidance} />
        </div>
        <div className="space-y-6">
          <SymptomForecastCard forecast={forecast} />

          {/* Quick AI Assistant Card */}
          <div className="bg-gradient-to-br from-lavender-50/80 via-white to-plum-50/80 rounded-3xl p-5 border border-lavender-200/80 shadow-soft">
            <div className="flex items-center gap-2 mb-2 text-plum-700 font-bold text-sm">
              <Bot className="w-4 h-4 text-plum-600" />
              <span>Ask HER LIFE Health Guide</span>
            </div>
            <p className="text-xs text-warm-textMuted leading-relaxed">
              Have questions regarding menstrual cramps, cycle regularity, PCOS markers, or sleep rhythms? Our clinical knowledge base is available 24/7.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigateTab('aiguide')}
                className="w-full text-left bg-white hover:bg-brand-50/60 hover:text-brand-800 text-xs text-warm-textDark font-medium p-2.5 rounded-xl border border-lavender-200/70 transition shadow-2xs"
              >
                "Why is my period late or irregular this month?"
              </button>
              <button
                onClick={() => onNavigateTab('aiguide')}
                className="w-full text-left bg-white hover:bg-brand-50/60 hover:text-brand-800 text-xs text-warm-textDark font-medium p-2.5 rounded-xl border border-lavender-200/70 transition shadow-2xs"
              >
                "What symptoms indicate a clinical evaluation for PCOS?"
              </button>
              <button
                onClick={() => onNavigateTab('aiguide')}
                className="w-full text-left bg-white hover:bg-brand-50/60 hover:text-brand-800 text-xs text-warm-textDark font-medium p-2.5 rounded-xl border border-lavender-200/70 transition shadow-2xs"
              >
                "What is the difference between normal cramps and endometriosis?"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
