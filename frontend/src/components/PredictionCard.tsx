import React from 'react';
import { PeriodPrediction } from '../types';
import { Calendar, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface PredictionCardProps {
  prediction: PeriodPrediction | null;
  lifeStage: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, lifeStage }) => {
  if (!prediction || !prediction.applicable) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft">
        <div className="flex items-center gap-2 text-warm-textMuted text-xs font-semibold uppercase tracking-wider mb-2">
          <Info className="w-4 h-4 text-plum-500" />
          <span>Cycle Intelligence</span>
        </div>
        <h3 className="text-lg font-bold text-warm-textDark font-serif">
          {lifeStage === 'menopause' ? 'Menopause Wellness Stage' : 'Cycle Prediction Status'}
        </h3>
        <p className="text-sm text-warm-textMuted mt-2">
          {prediction?.reason || (lifeStage === 'menopause' 
            ? 'Menstrual cycle tracking is paused for post-menopausal wellness monitoring. Focus shifts to bone, cardiovascular, and vaginal health.'
            : 'Log past periods in the Calendar tab to initialize mathematical estimates.')}
        </p>
      </div>
    );
  }

  const confidenceBadgeColor = 
    prediction.confidence.includes('High') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    prediction.confidence.includes('Moderate') ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </span>
          <div>
            <span className="text-xs font-semibold text-warm-textMuted uppercase tracking-wider">Cycle Day</span>
            <div className="text-2xl font-black text-warm-textDark font-serif">
              Day {prediction.current_cycle_day || 14}
            </div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold ${confidenceBadgeColor}`}>
            <Sparkles className="w-3 h-3" />
            {prediction.confidence} Confidence
          </span>
          {prediction.uncertainty_range && (
            <p className="text-[11px] text-warm-textMuted mt-1">Uncertainty: {prediction.uncertainty_range}</p>
          )}
        </div>
      </div>

      {/* Grid of Predictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-warm-border">
        {/* Next Period Box */}
        <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
          <span className="text-xs font-semibold text-brand-700">Estimated Next Period</span>
          <div className="text-xl font-bold text-warm-textDark mt-1">
            {prediction.predicted_period_date ? new Date(prediction.predicted_period_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not enough data yet'}
          </div>
          <p className="text-[11px] text-warm-textMuted mt-1">
            Based on ~{prediction.predicted_cycle_length || 28} day average cycle length.
          </p>
        </div>

        {/* Ovulation / Fertile Window Box */}
        <div className="p-4 bg-plum-50/50 rounded-2xl border border-plum-100">
          <span className="text-xs font-semibold text-plum-700">Estimated Fertile Window</span>
          <div className="text-sm font-bold text-warm-textDark mt-1">
            {prediction.fertile_window ? (
              <span>
                {new Date(prediction.fertile_window.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(prediction.fertile_window.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            ) : (
              'Not applicable'
            )}
          </div>
          <p className="text-[10px] text-warm-textMuted mt-1 leading-tight">
            Approx. ovulation: {prediction.estimated_ovulation_date ? new Date(prediction.estimated_ovulation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}.
          </p>
        </div>
      </div>

      {/* Important Medical Disclaimer Notice */}
      <div className="mt-4 flex items-start gap-2 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/50 text-[11px] text-amber-900 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Important:</strong> Calendar and algorithm predictions are mathematical estimates based on logged history. They must <strong>NOT</strong> be used for natural contraception or as confirmed proof of ovulation.
        </span>
      </div>
    </div>
  );
};
