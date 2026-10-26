import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLogRecord } from '../types';
import { api } from '../services/api';
import { PlusCircle, Check, Moon, Zap, Droplets, Coffee, Flower2, HeartPulse, Activity, ArrowRight, Smile, BatteryCharging } from 'lucide-react';

interface CheckInPageProps {
  currentUser: UserProfile;
  onNavigateTab?: (tab: any) => void;
}

export const CheckInPage: React.FC<CheckInPageProps> = ({ currentUser, onNavigateTab }) => {
  const [log, setLog] = useState<Partial<DailyLogRecord>>({
    date: new Date().toISOString().split('T')[0],
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
    basal_temp_c: undefined,
    cervical_mucus: 'dry',
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function fetchToday() {
      try {
        const todayData = await api.getTodayLog(currentUser.id);
        if (todayData) setLog(todayData);
      } catch (e) {
        console.error(e);
      }
    }
    fetchToday();
  }, [currentUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await api.upsertDailyLog(currentUser.id, log);
      if (saved) setLog(saved);
      setSavedSuccess(true);
      
      // Auto-navigate to dashboard so user immediately sees their updated cards
      if (onNavigateTab) {
        setTimeout(() => {
          onNavigateTab('dashboard');
        }, 1200);
      } else {
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (e) {
      console.error("Failed to save daily check-in:", e);
    } finally {
      setSaving(false);
    }
  }

  const SEVERITY_NAMES = ['None', 'Mild', 'Moderate', 'Severe'];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] sm:text-xs uppercase font-semibold text-brand-600 tracking-wider">Daily Health Check-in</span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-warm-textDark mt-0.5 sm:mt-1">Today's Symptom & Lifestyle Log</h2>
          <p className="text-xs text-warm-textMuted mt-1">
            Logged entries automatically update your dashboard quick metrics, daily guide, and cycle projections.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-bold border border-emerald-300 shadow-xs animate-fadeIn self-start sm:self-auto">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Saved! Updating Dashboard...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Lifestyle & Recovery Section */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 text-warm-textDark font-serif font-bold text-base sm:text-lg pb-3 border-b border-warm-border">
            <Activity className="w-5 h-5 text-brand-600" />
            <span>1. Sleep, Stress & Daily Habits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Sleep Hours */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-warm-textDark">
                <span className="flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Sleep Duration
                </span>
                <span className="font-mono text-brand-700 font-bold">{log.sleep_hours || 7.0} hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={log.sleep_hours || 7.0}
                onChange={(e) => setLog({ ...log, sleep_hours: parseFloat(e.target.value) })}
                className="w-full accent-brand-500 py-1"
              />
            </div>

            {/* Self-reported Stress */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-warm-textDark">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Self-Reported Stress (0 to 4)
                </span>
                <span className="font-mono text-amber-700 font-bold">Level {log.stress_level_0_4 || 0}/4</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={log.stress_level_0_4 || 0}
                onChange={(e) => setLog({ ...log, stress_level_0_4: parseInt(e.target.value) })}
                className="w-full accent-amber-500 py-1"
              />
              <span className="text-[10px] text-warm-textMuted mt-1 block">
                0: Calm & Relaxed • 2: Moderate • 4: High Pressure
              </span>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-warm-textDark">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  Hydration
                </span>
                <span className="font-mono text-cyan-700 font-bold">{log.hydration_glasses || 6} glasses</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[2, 4, 6, 8, 10].map((glasses) => (
                  <button
                    type="button"
                    key={glasses}
                    onClick={() => setLog({ ...log, hydration_glasses: glasses })}
                    className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-semibold border transition active:scale-95 min-h-[42px] ${
                      log.hydration_glasses === glasses
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-xs'
                        : 'bg-warm-cardMuted text-warm-textDark hover:bg-warm-border border-warm-border'
                    }`}
                  >
                    {glasses}
                  </button>
                ))}
              </div>
            </div>

            {/* Caffeine */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-warm-textDark">
                <span className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  Caffeine Intake
                </span>
                <span className="font-mono text-amber-800 font-bold">{log.caffeine_cups || 1} cups</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2, 3, 4].map((cups) => (
                  <button
                    type="button"
                    key={cups}
                    onClick={() => setLog({ ...log, caffeine_cups: cups })}
                    className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-semibold border transition active:scale-95 min-h-[42px] ${
                      log.caffeine_cups === cups
                        ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                        : 'bg-warm-cardMuted text-warm-textDark hover:bg-warm-border border-warm-border'
                    }`}
                  >
                    {cups}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-warm-textDark">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-rose-500" />
                  Energy Level
                </span>
                <span className="font-mono text-rose-700 font-bold text-xs">
                  {log.energy_score_0_4 === 4 ? 'High & Vibrant' :
                   log.energy_score_0_4 === 3 ? 'Rested & Good' :
                   log.energy_score_0_4 === 2 ? 'Balanced' :
                   log.energy_score_0_4 === 1 ? 'Low' : 'Exhausted'}
                </span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[
                  { val: 0, label: 'Exhausted' },
                  { val: 1, label: 'Low' },
                  { val: 2, label: 'Balanced' },
                  { val: 3, label: 'Rested' },
                  { val: 4, label: 'High' }
                ].map(({ val, label }) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setLog({ ...log, energy_score_0_4: val })}
                    className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[11px] font-semibold border transition active:scale-95 min-h-[42px] ${
                      (log.energy_score_0_4 ?? 2) === val
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-warm-cardMuted text-warm-textDark hover:bg-warm-border border-warm-border'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood & Emotional State */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-warm-textDark">
                <span className="flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-purple-500" />
                  Mood & Emotional Well-Being
                </span>
                <span className="font-mono text-purple-700 font-bold text-xs">
                  {log.mood_score_0_4 === 4 ? 'Joyful' :
                   log.mood_score_0_4 === 3 ? 'Positive' :
                   log.mood_score_0_4 === 2 ? 'Calm' :
                   log.mood_score_0_4 === 1 ? 'Sensitive' : 'Anxious'}
                </span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[
                  { val: 0, label: 'Anxious' },
                  { val: 1, label: 'Sensitive' },
                  { val: 2, label: 'Calm' },
                  { val: 3, label: 'Good' },
                  { val: 4, label: 'Joyful' }
                ].map(({ val, label }) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setLog({ ...log, mood_score_0_4: val })}
                    className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[11px] font-semibold border transition active:scale-95 min-h-[42px] ${
                      (log.mood_score_0_4 ?? 2) === val
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-warm-cardMuted text-warm-textDark hover:bg-warm-border border-warm-border'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Physical Symptoms Multi-Factor Checklist */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 text-warm-textDark font-serif font-bold text-base sm:text-lg pb-3 border-b border-warm-border">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span>2. Symptoms & Body Signals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { key: 'cramps_severity_0_3', label: 'Cramps & Abdominal Pain' },
              { key: 'bloating_severity_0_3', label: 'Bloating & Fluid Retention' },
              { key: 'headache_severity_0_3', label: 'Headache & Migraine' },
              { key: 'fatigue_severity_0_3', label: 'Fatigue & Lethargy' },
              { key: 'mood_changes_severity_0_3', label: 'Mood Shifts & Sensitivity' },
              { key: 'hot_flashes_severity_0_3', label: 'Hot Flashes & Night Sweats' },
              { key: 'sleep_disturbance_severity_0_3', label: 'Sleep Disruption' },
              { key: 'pelvic_pain_severity_0_3', label: 'Deep Pelvic Discomfort' },
            ].map(({ key, label }) => {
              const currentVal = (log as any)[key] || 0;
              return (
                <div key={key} className="p-3 bg-warm-cardMuted/50 rounded-2xl border border-warm-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-warm-textDark truncate pr-2">{label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      currentVal === 3 ? 'bg-rose-100 text-rose-700' :
                      currentVal === 2 ? 'bg-amber-100 text-amber-700' :
                      currentVal === 1 ? 'bg-indigo-50 text-indigo-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {SEVERITY_NAMES[currentVal]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setLog({ ...log, [key]: num })}
                        className={`py-2 rounded-xl text-xs font-bold border transition active:scale-95 min-h-[40px] flex items-center justify-center ${
                          currentVal === num
                            ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                            : 'bg-white text-warm-textDark border-warm-border hover:bg-warm-cardMuted'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Fertility Observations */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-warm-textDark font-serif font-bold text-base sm:text-lg pb-3 border-warm-border">
            <Flower2 className="w-5 h-5 text-plum-600" />
            <span>3. Optional Fertility & Basal Observations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-warm-textDark mb-1">
                Basal Body Temp (°C)
              </label>
              <input
                type="number"
                step="0.05"
                placeholder="e.g. 36.65"
                value={log.basal_temp_c || ''}
                onChange={(e) => setLog({ ...log, basal_temp_c: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-textDark mb-1">
                Cervical Mucus Observation
              </label>
              <select
                value={log.cervical_mucus || 'dry'}
                onChange={(e) => setLog({ ...log, cervical_mucus: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white"
              >
                <option value="dry">Dry / Minimal</option>
                <option value="sticky">Sticky / Thick</option>
                <option value="creamy">Creamy / Lotion-like</option>
                <option value="egg_white">Egg-white / Stretchy (High Fertility Sign)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-textDark mb-1">Personal Notes</label>
            <textarea
              rows={2}
              placeholder="Any notable changes, foods, exam deadlines, or medications taken..."
              value={log.notes || ''}
              onChange={(e) => setLog({ ...log, notes: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {savedSuccess && onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-soft transition flex items-center justify-center gap-2 min-h-[48px] active:scale-95"
            >
              <span>View Updated Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-soft hover:shadow-glow transition flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
          >
            {saving ? 'Saving...' : 'Save Today\'s Health Check-In'}
          </button>
        </div>
      </form>
    </div>
  );
};
