import React, { useEffect, useState } from 'react';
import { UserProfile, PeriodPrediction, SymptomForecast, DailyGuidance, DailyLogRecord } from '../types';
import { api } from '../services/api';
import { PredictionCard } from '../components/PredictionCard';
import { SymptomForecastCard } from '../components/SymptomForecastCard';
import { DailyGuidanceCard } from '../components/DailyGuidanceCard';
import { Moon, Zap, Droplets, Sparkles, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface DashboardPageProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, onNavigateTab }) => {
  const [prediction, setPrediction] = useState<PeriodPrediction | null>(null);
  const [forecast, setForecast] = useState<SymptomForecast | null>(null);
  const [guidance, setGuidance] = useState<DailyGuidance | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLogRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
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
    return () => { isMounted = false; };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-warm-textMuted">
        <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium">Loading personalized health intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-500 via-brand-600 to-plum-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-200">
            Welcome to HER LIFE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
            Hello, {currentUser.full_name.split(' ')[0]}
          </h2>
          <p className="text-sm text-brand-100 mt-2 leading-relaxed">
            Your daily health summary is updated. Here is your personalized hormonal and lifestyle overview for today.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="bg-white text-brand-700 hover:bg-brand-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-soft transition flex items-center gap-1.5"
            >
              <span>Daily Check-In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('aiguide')}
              className="bg-brand-700/60 hover:bg-brand-700/80 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask HER LIFE Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Sleep metric */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium">Logged Sleep</span>
            <div className="text-lg font-bold text-warm-textDark">{todayLog?.sleep_hours || 7.0} hrs</div>
          </div>
        </div>

        {/* Stress metric */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium">Stress Rating</span>
            <div className="text-lg font-bold text-warm-textDark">
              Level {todayLog?.stress_level_0_4 || 1}/4
            </div>
          </div>
        </div>

        {/* Hydration metric */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium">Hydration</span>
            <div className="text-lg font-bold text-warm-textDark">{todayLog?.hydration_glasses || 6}/8 glasses</div>
          </div>
        </div>

        {/* Mood & Energy */}
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-warm-textMuted font-medium">Energy & Mood</span>
            <div className="text-lg font-bold text-warm-textDark">
              {todayLog?.energy_score_0_4 && todayLog.energy_score_0_4 >= 2 ? 'Balanced' : 'Mild Fatigue'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Prediction & Symptom Forecasting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PredictionCard prediction={prediction} lifeStage={currentUser.life_stage} />
          <DailyGuidanceCard guidance={guidance} />
        </div>
        <div className="space-y-6">
          <SymptomForecastCard forecast={forecast} />

          {/* Quick AI Assistant Card */}
          <div className="bg-gradient-to-br from-lavender-50 to-plum-50 rounded-3xl p-5 border border-lavender-200 shadow-soft">
            <div className="flex items-center gap-2 mb-2 text-plum-700 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-plum-600" />
              <span>Ask HER LIFE Guide</span>
            </div>
            <p className="text-xs text-warm-textMuted leading-relaxed">
              Have questions about cramps, irregular cycles, PCOS, or sleep rhythms? Our evidence-grounded assistant is here to help.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigateTab('aiguide')}
                className="w-full text-left bg-white/80 hover:bg-white text-xs text-warm-textDark font-medium p-2.5 rounded-xl border border-lavender-200 transition"
              >
                "Why is my period irregular this month?"
              </button>
              <button
                onClick={() => onNavigateTab('aiguide')}
                className="w-full text-left bg-white/80 hover:bg-white text-xs text-warm-textDark font-medium p-2.5 rounded-xl border border-lavender-200 transition"
              >
                "What symptoms warrant PCOS evaluation?"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
