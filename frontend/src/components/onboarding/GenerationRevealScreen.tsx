import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Heart, Check, RefreshCw, X, Feather } from 'lucide-react';
import { LotusBloomIcon } from '../common/LotusBloomIcon';
import { useBackHandler } from '../../services/backNavigation';

export interface GenerationInfo {
  id: string;
  name: string;
  headline: string;
  badge: string;
  years: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  description: string;
  highlights: string[];
}

export const GENERATIONS_DATA: Record<string, GenerationInfo> = {
  gen_alpha: {
    id: 'gen_alpha',
    name: 'Gen Alpha',
    headline: 'You are Gen Alpha 💜',
    badge: 'Digital Era • Born 2013 onwards',
    years: '2013 onwards',
    accentColor: 'text-purple-600',
    bgGradient: 'from-purple-500/15 via-pink-400/10 to-lavender-500/15',
    borderColor: 'border-purple-200',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    description: 'Empowered, curious, and growing up with gentle, science-backed body education and zero taboos.',
    highlights: ['First Period Preparation', 'Body Changes & Hygiene', 'Teen Privacy & Safe Adult Support']
  },
  gen_z: {
    id: 'gen_z',
    name: 'Gen Z',
    headline: 'You are Gen Z 💗',
    badge: 'Next Gen • Born 1997–2012',
    years: '1997–2012',
    accentColor: 'text-pink-600',
    bgGradient: 'from-pink-500/15 via-rose-400/10 to-lavender-500/15',
    borderColor: 'border-pink-200',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    description: 'Cycle syncing, holistic self-care, exam and career stress balance, and proactive hormonal awareness.',
    highlights: ['Exam & Work Stress Sync', 'PCOS & Hormone Tracking', 'Restful Sleep & Energy Management']
  },
  millennial: {
    id: 'millennial',
    name: 'Millennial',
    headline: 'You are a Millennial 🌸',
    badge: 'Trailblazers • Born 1981–1996',
    years: '1981–1996',
    accentColor: 'text-rose-600',
    bgGradient: 'from-rose-500/15 via-amber-400/10 to-pink-500/15',
    borderColor: 'border-rose-200',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    description: 'Cycle variance mastery, fertility & reproductive wisdom, endometriosis awareness, and work-life balance.',
    highlights: ['Historical Variance & Bayesian Bounds', 'Fertility & Ovulation Tracking', 'Pelvic Pain & Work-Life Harmony']
  },
  gen_x: {
    id: 'gen_x',
    name: 'Gen X',
    headline: 'You are Gen X 🌷',
    badge: 'Resilient • Born 1965–1980',
    years: '1965–1980',
    accentColor: 'text-plum-700',
    bgGradient: 'from-plum-600/15 via-purple-400/10 to-rose-400/15',
    borderColor: 'border-plum-200',
    glowColor: 'rgba(147, 51, 234, 0.35)',
    description: 'Navigating perimenopausal hormonal shifts, vasomotor tracking, vitality, and long-term strength.',
    highlights: ['Vasomotor Hot Flash Diary', 'Irregular Cycle Interval Logging', 'Brain Fog & Sleep Support']
  },
  boomer: {
    id: 'boomer',
    name: 'Baby Boomer',
    headline: 'You are a Baby Boomer 🌼',
    badge: 'Wisdom & Vitality • Born 1946–1964',
    years: '1946–1964',
    accentColor: 'text-amber-700',
    bgGradient: 'from-amber-500/15 via-orange-400/10 to-rose-400/15',
    borderColor: 'border-amber-200',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    description: 'Post-menopausal vitality, bone and heart health, clinical safeguards, and celebrating lifelong resilience.',
    highlights: ['Post-Menopausal Vitality', 'Bone & Longevity Education', 'Post-Menopausal Bleeding Safeguards']
  },
  golden: {
    id: 'golden',
    name: 'Golden Era',
    headline: 'You are Golden Generation 🌾',
    badge: 'Timeless Grace • Born before 1946',
    years: '1945 & earlier',
    accentColor: 'text-emerald-700',
    bgGradient: 'from-emerald-500/15 via-sage-400/10 to-amber-400/15',
    borderColor: 'border-emerald-200',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    description: 'Cherishing your lifetime health story with gentle longevity care, dignity, and personal health metrics.',
    highlights: ['Lifelong Vitality Tracking', 'Comfort & Gentle Wellness', 'Health Story History']
  },
  other: {
    id: 'other',
    name: 'Timeless Journey',
    headline: 'Your Timeless Journey 🌸',
    badge: 'Universal Cohort',
    years: 'Personalized Range',
    accentColor: 'text-brand-700',
    bgGradient: 'from-brand-500/15 via-rose-400/10 to-lavender-500/15',
    borderColor: 'border-brand-200',
    glowColor: 'rgba(194, 109, 92, 0.35)',
    description: 'Customized reproductive tracking tailored to your personal health baseline and lived experience.',
    highlights: ['Universal Cycle Tracking', 'Evidence-Based Education', 'Private On-Device Data']
  }
};

/**
 * Standard classification based on birth year
 * - Gen Alpha: 2013 onwards
 * - Gen Z: 1997–2012
 * - Millennials: 1981–1996
 * - Gen X: 1965–1980
 * - Baby Boomers: 1946–1964
 * - Golden / Older: < 1946
 */
export function calculateGenerationFromBirthYear(birthYear: number): string {
  if (birthYear >= 2013) return 'gen_alpha';
  if (birthYear >= 1997) return 'gen_z';
  if (birthYear >= 1981) return 'millennial';
  if (birthYear >= 1965) return 'gen_x';
  if (birthYear >= 1946) return 'boomer';
  return 'golden';
}

interface GenerationRevealScreenProps {
  preferredName: string;
  age: number;
  birthYear: number;
  generation: string;
  onContinue: () => void;
  onChangeGeneration: (newGen: string) => void;
  onBack: () => void;
}

export const GenerationRevealScreen: React.FC<GenerationRevealScreenProps> = ({
  preferredName,
  age,
  birthYear,
  generation,
  onContinue,
  onChangeGeneration,
  onBack
}) => {
  const [showChangeModal, setShowChangeModal] = useState<boolean>(false);
  const cohort = GENERATIONS_DATA[generation] || GENERATIONS_DATA['gen_z'];

  useBackHandler(
    'generation_change_modal',
    85,
    () => {
      if (showChangeModal) {
        setShowChangeModal(false);
        return true;
      }
      return false;
    },
    showChangeModal
  );

  useBackHandler(
    'generation_reveal_screen',
    70,
    () => {
      onBack();
      return true;
    },
    !showChangeModal
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-[#FFF5F7] via-[#FDF2F8] to-[#F5F0FB] text-warm-textDark flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none">
      {/* Background Floating Ambient Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-tr from-pink-300/30 to-rose-200/25 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-16 right-10 w-80 h-80 bg-gradient-to-bl from-purple-300/25 to-lavender-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Botanical Petals & Butterflies in Background */}
      <div className="absolute top-20 right-1/4 text-pink-300 text-lg animate-float pointer-events-none opacity-70">🌸</div>
      <div className="absolute top-1/3 left-8 text-purple-300 text-base animate-pulse pointer-events-none opacity-60">🌺</div>
      <div className="absolute bottom-32 left-1/4 text-rose-300 text-xl animate-float pointer-events-none opacity-70" style={{ animationDelay: '1.5s' }}>💕</div>
      <div className="absolute top-24 left-1/4 text-purple-300 text-sm animate-pulse pointer-events-none opacity-60">🌷</div>
      <div className="absolute bottom-40 right-16 text-pink-300 text-base animate-float pointer-events-none opacity-70" style={{ animationDelay: '2s' }}>🌸</div>

      {/* Top Bar with Back Button & Branding */}
      <div className="relative z-10 max-w-lg w-full mx-auto flex items-center justify-between pt-1 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/80 text-warm-textMuted hover:text-warm-textDark transition flex items-center gap-1.5 text-xs font-semibold backdrop-blur-xs shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#F8EBDC] border border-[#E8D5C4] flex items-center justify-center p-0.5 shadow-2xs">
            <img src="/logo_transparent.png" alt="HerLife Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-bold font-serif text-brand-700">HerLife</span>
        </div>

        <div className="w-12" />
      </div>

      {/* Main Center Content: Animated Reveal Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-auto py-4 sm:py-6 animate-generation-reveal flex flex-col items-center text-center">
        {/* Subtle Animated Butterfly & Flower Centerpiece */}
        <div className="relative mb-4 flex items-center justify-center">
          {/* Glowing Aura Ring */}
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-lg relative"
            style={{
              background: `radial-gradient(circle, #FFFFFF 0%, #FFF1F5 60%, rgba(255,255,255,0) 100%)`,
              boxShadow: `0 0 35px ${cohort.glowColor}`
            }}
          >
            {/* Subtle Blooming Flower Background */}
            <svg className="w-20 h-20 sm:w-24 sm:h-24 text-pink-200/70 animate-rotate-slow pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 C40 25 40 25 50 50 C60 25 60 25 50 0 Z" />
              <path d="M50 100 C40 75 40 75 50 50 C60 75 60 75 50 100 Z" />
              <path d="M0 50 C25 40 25 40 50 50 C25 60 25 60 0 50 Z" />
              <path d="M100 50 C75 40 75 40 50 50 C75 60 75 60 100 50 Z" />
              <path d="M15 15 C35 30 35 30 50 50 C30 35 30 35 15 15 Z" />
              <path d="M85 85 C65 70 65 70 50 50 C70 65 70 65 85 85 Z" />
              <path d="M85 15 C70 35 70 35 50 50 C65 30 65 30 85 15 Z" />
              <path d="M15 85 C30 65 30 65 50 50 C35 70 35 70 15 85 Z" />
            </svg>

            {/* Delicate Floating Butterfly with Flapping Wings */}
            <div className="absolute flex items-center justify-center animate-float">
              <div className="relative flex items-center">
                {/* Left Wing */}
                <svg className="w-7 h-9 sm:w-8 sm:h-10 text-pink-500 animate-wing-left" viewBox="0 0 50 60" fill="currentColor">
                  <path d="M48 30 C35 5 10 0 5 15 C0 30 20 40 45 32 C20 45 10 55 25 58 C40 60 45 45 48 30 Z" />
                </svg>
                {/* Butterfly Body */}
                <div className="w-1.5 h-6 bg-plum-700 rounded-full mx-0.5 shadow-2xs z-10 relative">
                  <div className="w-2 h-2 bg-plum-800 rounded-full -top-1 -left-0.5 absolute" />
                </div>
                {/* Right Wing */}
                <svg className="w-7 h-9 sm:w-8 sm:h-10 text-rose-500 animate-wing-right" viewBox="0 0 50 60" fill="currentColor">
                  <path d="M2 30 C15 5 40 0 45 15 C50 30 30 40 5 32 C30 45 40 55 25 58 C10 60 5 45 2 30 Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sparkle Badges */}
          <span className="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-white shadow-soft flex items-center justify-center text-xs animate-sparkle-glow">
            🌸
          </span>
          <span className="absolute -bottom-1 -left-2 w-6 h-6 rounded-full bg-white shadow-soft flex items-center justify-center text-xs animate-sparkle-glow" style={{ animationDelay: '1.2s' }}>
            🌸
          </span>
        </div>

        {/* Top Cohort Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-700 bg-white/90 backdrop-blur-xs px-3.5 py-1 rounded-full border border-pink-200/80 shadow-2xs">
            <LotusBloomIcon className="w-3.5 h-3.5 text-pink-500" />
            <span>Generation Detected • {cohort.years}</span>
          </span>
        </div>

        {/* Main Personalized Headline */}
        <h1
          className="text-3xl sm:text-4xl md:text-[38px] font-serif font-black tracking-tight text-warm-textDark mt-1 mb-2 leading-tight drop-shadow-xs"
          style={{ textShadow: `0 2px 14px ${cohort.glowColor}` }}
        >
          {cohort.headline}
        </h1>

        {/* Key Required Quote */}
        <p className="text-sm sm:text-base font-serif italic text-brand-800 font-medium mb-4">
          “Your journey, your phase, your HER LIFE 💕”
        </p>

        {/* Detailed Supportive Card */}
        <div className={`w-full bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border ${cohort.borderColor} shadow-soft-lg space-y-3.5 text-left transition-all duration-300`}>
          <div className="flex items-center justify-between text-xs border-b border-warm-border/60 pb-2.5">
            <div>
              <span className="text-warm-textMuted block text-[10px]">Identified For</span>
              <span className="font-bold text-warm-textDark text-sm">{preferredName}</span>
            </div>
            <div className="text-right">
              <span className="text-warm-textMuted block text-[10px]">Calculated Cohort</span>
              <span className="font-bold text-brand-700 text-sm">{cohort.name} (Age {age})</span>
            </div>
          </div>

          <p className="text-xs text-warm-textDark leading-relaxed">
            {cohort.description}
          </p>

          {/* Personalized Highlights */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-warm-textMuted block">
              Tailored For Your Phase:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cohort.highlights.map((h, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-warm-textDark bg-warm-cardMuted/90 border border-warm-border/80 px-2.5 py-1 rounded-xl"
                >
                  <span className="text-pink-500 text-xs">✓</span>
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-warm-textMuted italic flex items-center justify-between pt-1">
            <span>Approx. Birth Year: ~{birthYear}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-emerald-500 text-emerald-500" /> Personalized for you
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="relative z-10 max-w-md w-full mx-auto pb-2 pt-3 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-plum-600 hover:from-brand-700 hover:to-plum-700 text-white font-bold text-sm shadow-soft transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue with {cohort.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowChangeModal(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white text-warm-textMuted hover:text-brand-700 text-xs font-semibold border border-warm-border/70 transition flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Think this is incorrect? Tap to Change</span>
        </button>
      </div>

      {/* Change Generation Modal / Drawer */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-warm-border shadow-soft-lg space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-warm-border pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-warm-textDark">
                  Select Your Generation
                </h3>
                <p className="text-xs text-warm-textMuted">
                  Choose the cohort you self-identify with most.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="p-1.5 rounded-full hover:bg-warm-cardMuted text-warm-textMuted transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {Object.values(GENERATIONS_DATA).map((g) => {
                const isSelected = g.id === generation;
                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      onChangeGeneration(g.id);
                      setShowChangeModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/70 shadow-2xs'
                        : 'border-warm-border hover:border-brand-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-warm-textDark">{g.name}</span>
                        <span className="text-[10px] text-warm-textMuted font-medium">({g.years})</span>
                      </div>
                      <p className="text-[11px] text-warm-textMuted mt-0.5 line-clamp-1">{g.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowChangeModal(false)}
              className="w-full py-2.5 rounded-xl bg-warm-cardMuted hover:bg-warm-border text-warm-textDark text-xs font-bold transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
