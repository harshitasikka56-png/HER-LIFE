import React from 'react';
import { Flower2, Heart, Droplet, Moon, Sun, Flame, Plus } from 'lucide-react';
import { PeriodPrediction, LifeStage } from '../types';

interface CycleWheelDialProps {
  prediction: PeriodPrediction | null;
  lifeStage: LifeStage;
  onLogClick: () => void;
}

export const CycleWheelDial: React.FC<CycleWheelDialProps> = ({
  prediction,
  lifeStage,
  onLogClick
}) => {
  const currentDay = prediction?.current_cycle_day || 14;
  const cycleLength = prediction?.predicted_cycle_length || 28;
  const daysUntilNext = prediction?.predicted_period_date 
    ? Math.max(0, Math.ceil((new Date(prediction.predicted_period_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 14;

  // Determine Cycle Phase
  let phaseName = 'Follicular Phase';
  let phaseQuote = 'Rising estrogen • High vitality & mental clarity';
  let phaseColor = 'text-amber-600 bg-amber-50 border-amber-200';
  let phaseIcon = Sun;
  let phaseGlow = 'from-amber-400/20 via-rose-300/20 to-purple-400/20';

  if (currentDay <= 5) {
    phaseName = 'Menstrual Phase';
    phaseQuote = 'Restorative rest • Warm nourishing hydration';
    phaseColor = 'text-rose-600 bg-rose-50 border-rose-200';
    phaseIcon = Droplet;
    phaseGlow = 'from-rose-500/25 via-pink-400/20 to-amber-300/15';
  } else if (currentDay >= 12 && currentDay <= 16) {
    phaseName = 'Ovulatory Window';
    phaseQuote = 'Peak fertility & confidence • High hormonal glow';
    phaseColor = 'text-plum-700 bg-plum-50 border-plum-200';
    phaseIcon = Flower2;
    phaseGlow = 'from-plum-500/25 via-purple-400/20 to-rose-300/20';
  } else if (currentDay > 16) {
    phaseName = 'Luteal Phase';
    phaseQuote = 'Progesterone dominance • Gentle movement & self-care';
    phaseColor = 'text-lavender-700 bg-lavender-50 border-lavender-200';
    phaseIcon = Moon;
    phaseGlow = 'from-lavender-400/25 via-plum-300/20 to-rose-200/20';
  }

  const PhaseIconComponent = phaseIcon;

  // Circular calculations
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressFraction = Math.min(1, Math.max(0, currentDay / cycleLength));
  const strokeDashoffset = circumference - (progressFraction * circumference);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FCF9F7] to-[#FAF3F0] rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 md:p-8 border border-rose-200/80 shadow-soft-lg flex flex-col items-center text-center">
      {/* Ambient background soft glow */}
      <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-gradient-to-r ${phaseGlow} blur-3xl pointer-events-none transition-all duration-700`} />

      {/* Top Phase Pill */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-lg mb-3 sm:mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-warm-textMuted">
          Cycle Dial
        </span>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${phaseColor}`}>
          <PhaseIconComponent className="w-3.5 h-3.5 animate-pulse" />
          <span>{phaseName}</span>
        </div>
      </div>

      {/* Radial Wheel Visualization */}
      <div className="relative flex items-center justify-center my-2 sm:my-4">
        <svg viewBox="0 0 240 240" className="w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 transform -rotate-90">
          {/* Background Track Ring */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="transparent"
            stroke="#F2DDD3"
            strokeWidth="12"
            strokeDasharray="4 6"
            className="opacity-70"
          />

          {/* Menstrual Phase segment marker (Days 1-5) */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="transparent"
            stroke="#F77F88"
            strokeWidth="12"
            strokeDasharray={`${(5 / cycleLength) * circumference} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* Fertile/Ovulation segment marker (Days 12-16) */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="transparent"
            stroke="#A288E3"
            strokeWidth="12"
            strokeDasharray={`${(5 / cycleLength) * circumference} ${circumference}`}
            strokeDashoffset={`-${(11 / cycleLength) * circumference}`}
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* Active Progress Ring */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="transparent"
            stroke="url(#cycleGradient)"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C26D5C" />
              <stop offset="50%" stopColor="#E07A5F" />
              <stop offset="100%" stopColor="#8A508F" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Inner Disc with Cycle Day */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 sm:p-6">
          <div className="w-36 h-36 xs:w-40 xs:h-40 sm:w-44 sm:h-44 rounded-full bg-white/95 backdrop-blur-md shadow-soft border border-rose-100 flex flex-col items-center justify-center p-3 sm:p-4 transition-transform hover:scale-105 duration-300">
            <span className="text-[10px] sm:text-[11px] font-bold text-warm-textMuted uppercase tracking-wider">
              Today is
            </span>
            <div className="text-3xl sm:text-5xl font-serif font-black text-warm-textDark tracking-tight my-0.5">
              Day {currentDay}
            </div>
            <span className="text-[10px] sm:text-xs text-brand-600 font-bold bg-brand-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-brand-100 truncate max-w-[120px] sm:max-w-none">
              {daysUntilNext > 0 ? `${daysUntilNext} days to period` : 'Period expected'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Insights & Quick Log Button */}
      <div className="relative z-10 w-full max-w-lg space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        <p className="text-xs sm:text-sm text-warm-textDark font-medium leading-relaxed italic bg-white/70 p-2.5 sm:p-3 rounded-2xl border border-rose-100">
          "{phaseQuote}"
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onLogClick}
            className="w-full bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-soft flex items-center justify-center gap-2 transform active:scale-98 transition min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Log Symptoms & Mood</span>
          </button>
        </div>
      </div>
    </div>
  );
};
