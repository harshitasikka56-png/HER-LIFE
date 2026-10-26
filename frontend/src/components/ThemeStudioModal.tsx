import React, { useState } from 'react';
import { X, Palette, Check, Sliders, Eye } from 'lucide-react';

interface ThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  primary: string;
  accent: string;
  bgPreview: string;
  badge: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'blush-rose',
    name: 'Blush Rose & Coral (Default)',
    description: 'Empathetic, warm, and comforting tones tailored for everyday menstrual wellness.',
    primary: '#C26D5C',
    accent: '#F77F88',
    bgPreview: 'from-rose-100 via-rose-50 to-amber-50',
    badge: 'Popular for Teens & Gen Z'
  },
  {
    id: 'lavender-dream',
    name: 'Lavender & Velvet Plum',
    description: 'Calming, hormone-balancing hues that reduce visual stress and anxiety.',
    primary: '#8A508F',
    accent: '#A288E3',
    bgPreview: 'from-lavender-100 via-plum-50 to-pink-50',
    badge: 'Stress Relief & Sleep'
  },
  {
    id: 'peach-blossom',
    name: 'Peach Blossom & Golden Sunrise',
    description: 'Vibrant, energetic palette supporting ovulatory vitality and mood boosting.',
    primary: '#E07A5F',
    accent: '#F4A261',
    bgPreview: 'from-amber-100 via-orange-50 to-rose-50',
    badge: 'Energizing & Mood Lift'
  },
  {
    id: 'sage-wellness',
    name: 'Sage Green & Organic Mint',
    description: 'Clinical botanical palette inspired by natural wellness and hormone health.',
    primary: '#4D7C5F',
    accent: '#82A790',
    bgPreview: 'from-emerald-100 via-teal-50 to-sage-50',
    badge: 'Holistic & Clinical'
  }
];

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({ isOpen, onClose }) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('blush-rose');

  if (!isOpen) return null;

  function handleApplyTheme(themeId: string) {
    setSelectedThemeId(themeId);
    // Apply dynamic CSS variable root modifications if desired
    document.documentElement.setAttribute('data-theme', themeId);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-rose-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-warm-bg to-brand-50 border-b border-warm-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-rose-400 text-white flex items-center justify-center shadow-soft">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-warm-textDark">Canva-Style Theme Studio</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Live Customizer
                </span>
              </div>
              <p className="text-xs text-warm-textMuted">Customize aesthetic palettes and feminine design vibes in 1-click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-100 text-warm-textMuted hover:text-warm-textDark transition border border-warm-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            {COLOR_THEMES.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleApplyTheme(theme.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-soft'
                      : 'border-warm-border hover:border-brand-200 bg-white hover:bg-warm-cardMuted/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual Color Swatches */}
                    <div className="flex items-center -space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-xs" 
                        style={{ backgroundColor: theme.primary }} 
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-xs" 
                        style={{ backgroundColor: theme.accent }} 
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-warm-textDark">{theme.name}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-warm-border text-warm-textMuted">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-warm-textMuted mt-0.5 leading-snug">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 bg-brand-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xs">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <button 
                        type="button"
                        className="text-xs px-3 py-1.5 rounded-full border border-warm-border text-warm-textMuted hover:text-warm-textDark bg-white hover:bg-warm-cardMuted font-medium transition"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-gradient-to-r from-rose-50 to-brand-50 rounded-2xl border border-rose-200/80 text-xs text-warm-textDark space-y-1">
            <span className="font-bold text-brand-800 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brand-600" /> Instant Live Visual Tuning
            </span>
            <p className="text-warm-textMuted leading-relaxed">
              Just like designing in Canva, your changes update seamlessly across period charts, ovulation rings, symptom logs, and the Saheli Voice Orb without reloading.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-warm-cardMuted border-t border-warm-border text-xs text-warm-textMuted flex items-center justify-between">
          <span>HER LIFE Aesthetics Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
