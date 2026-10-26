import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusBloomIcon } from '../common/LotusBloomIcon';

interface SplashScreenProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, reducedMotion = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2.5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [reducedMotion, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7EFE6] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* Top Controls: Accessible Skip */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs text-warm-textMuted z-20">
        <span className="font-semibold tracking-wider uppercase text-[10px] text-brand-700 bg-white/70 px-3 py-1 rounded-full border border-brand-200/50 shadow-2xs">
          HerLife Experience
        </span>
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-warm-textDark hover:text-brand-600 border border-warm-border/70 shadow-2xs transition transform hover:scale-105"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centerpiece: Official Animated Blooming Lotus Logo & Cycle Glow */}
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto relative z-10">
        {/* Soft Ambient Cycle Glow Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer glowing ripple ring */}
          <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-r from-rose-300/30 via-[#C26D5C]/20 to-amber-200/30 blur-3xl animate-glow pointer-events-none" />

          {/* Concentric blooming pulse ring 1 */}
          <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-rose-300/40 animate-lotus-ripple pointer-events-none" />
          
          {/* Concentric blooming pulse ring 2 */}
          <div 
            className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-brand-400/30 animate-lotus-ripple pointer-events-none" 
            style={{ animationDelay: '1.2s' }}
          />

          {/* Menstrual cycle flowing orbital ring line */}
          <div className="absolute w-60 h-60 sm:w-68 sm:h-68 rounded-full border-2 border-dashed border-[#8A3E31]/25 animate-rotate-slow pointer-events-none">
            {/* Radiant celestial cycle node */}
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#8A3E31] via-rose-500 to-amber-300 shadow-glow" />
          </div>

          {/* The App Lotus Logo with Blooming & Breathing Animations */}
          <div className="relative z-10 flex flex-col items-center justify-center animate-lotus-bloom">
            <div className="w-48 h-48 sm:w-56 sm:h-56 p-2 flex items-center justify-center animate-lotus-breathe">
              <img 
                src="/logo_transparent.png" 
                alt="HerLife Lotus Logo" 
                className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Tagline Reveal */}
        <div className="mt-4 space-y-1.5 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-xs sm:text-sm font-serif italic text-[#6E3228] tracking-wide">
            "Every Stage of Her. Every Story Matters."
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-[#8A3E31]/70 font-bold">
            <LotusBloomIcon className="w-3.5 h-3.5 text-brand-500" />
            <span>AI-Powered Women's Lifetime Health Companion</span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="w-full max-w-xs space-y-2 flex flex-col items-center z-20">
        <div className="w-full h-1.5 bg-[#EDE0D2] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#8A3E31] via-[#C26D5C] to-[#5C2D61] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-[#716864] font-bold uppercase tracking-widest">
          Harmonizing Cycle Intelligence
        </span>
      </div>
    </div>
  );
};
