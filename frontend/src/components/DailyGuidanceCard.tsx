import React from 'react';
import { DailyGuidance } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Flower2 } from 'lucide-react';

interface DailyGuidanceCardProps {
  guidance: DailyGuidance | null;
}

export const DailyGuidanceCard: React.FC<DailyGuidanceCardProps> = ({ guidance }) => {
  if (!guidance) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-2 bg-sage-100 text-sage-800 rounded-xl">
          <Flower2 className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-warm-textDark font-serif">Daily Routine & Guidance</h3>
          <p className="text-xs text-warm-textMuted capitalize">Tailored to your current life stage ({guidance.life_stage.replace('_', ' ')})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* DO SECTION */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DO (Recommended)</span>
          </div>
          <ul className="space-y-2 text-xs text-warm-textDark flex-1">
            {guidance.do.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DON'T SECTION */}
        <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-rose-800 font-bold text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>DON'T (Avoid)</span>
          </div>
          <ul className="space-y-2 text-xs text-warm-textDark flex-1">
            {guidance.dont.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-rose-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WHEN TO SEEK HELP SECTION */}
        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>WHEN TO SEEK HELP</span>
          </div>
          <ul className="space-y-2 text-xs text-warm-textDark flex-1">
            {guidance.when_to_seek_help.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-amber-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
