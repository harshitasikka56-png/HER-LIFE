import React from 'react';
import { SymptomForecast } from '../types';
import { Brain, Activity, Info } from 'lucide-react';

interface SymptomForecastCardProps {
  forecast: SymptomForecast | null;
}

const SYMPTOM_LABELS: Record<string, { name: string; color: string }> = {
  cramps: { name: 'Menstrual Cramps', color: 'bg-rose-500' },
  bloating: { name: 'Bloating / Fluid Retention', color: 'bg-amber-500' },
  headache: { name: 'Tension / Headache', color: 'bg-indigo-500' },
  fatigue: { name: 'Fatigue / Low Energy', color: 'bg-orange-500' },
  mood_changes: { name: 'Mood Sensitivity', color: 'bg-purple-500' },
  hot_flashes: { name: 'Vasomotor / Hot Flashes', color: 'bg-red-500' },
  sleep_disturbance: { name: 'Sleep Disturbance', color: 'bg-blue-500' },
};

export const SymptomForecastCard: React.FC<SymptomForecastCardProps> = ({ forecast }) => {
  if (!forecast || !forecast.probabilities) {
    return null;
  }

  const entries = Object.entries(forecast.probabilities);

  return (
    <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-lavender-100 text-lavender-700 rounded-xl">
            <Brain className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-warm-textDark">Tomorrow's Symptom Forecast</h3>
            <p className="text-xs text-warm-textMuted">Trained Multi-Output Machine Learning Model</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-lavender-50 text-lavender-700 px-2.5 py-1 rounded-full border border-lavender-200">
          Model B
        </span>
      </div>

      <div className="space-y-3 mt-4">
        {entries.map(([key, prob]) => {
          const info = SYMPTOM_LABELS[key] || { name: key, color: 'bg-brand-500' };
          const percent = Math.round(prob * 100);
          return (
            <div key={key}>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-warm-textDark">{info.name}</span>
                <span className="text-warm-textMuted font-mono">{percent}% likelihood</span>
              </div>
              <div className="w-full bg-warm-cardMuted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${info.color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-warm-border flex items-center gap-1.5 text-[11px] text-warm-textMuted">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>Predictions highlight tentative statistical tendencies based on sleep, stress, and cycle day. Not a medical guarantee.</span>
      </div>
    </div>
  );
};
