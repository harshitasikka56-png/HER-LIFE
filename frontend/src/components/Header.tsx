import React, { useState } from 'react';
import { UserProfile, LifeStage } from '../types';
import { Heart, Bell, Eye, EyeOff, Users, ChevronDown, Sparkles, ShieldAlert, Globe } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface HeaderProps {
  currentUser: UserProfile;
  demoUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onUpdateStage: (stage: LifeStage) => void;
  discreteMode: boolean;
  onToggleDiscrete: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenPreNotifications: () => void;
}

const STAGE_LABELS: Record<LifeStage, { en: string; hinglish: string; color: string }> = {
  teen_menarche: { en: 'Puberty & First Period', hinglish: 'Pehla Period (Teen)', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  college_gen_z: { en: 'Gen Z & College', hinglish: 'College & Gen Z (Study & Stress)', color: 'bg-lavender-200 text-lavender-700 border-lavender-300' },
  reproductive: { en: 'Reproductive Years', hinglish: 'Reproductive Years (Fertility & Cycles)', color: 'bg-brand-100 text-brand-700 border-brand-200' },
  perimenopause: { en: 'Perimenopause', hinglish: 'Perimenopause (Hormone Shifts)', color: 'bg-plum-100 text-plum-700 border-plum-200' },
  menopause: { en: 'Menopause & Beyond', hinglish: 'Menopause (Post-Period Health)', color: 'bg-sage-100 text-sage-800 border-sage-200' },
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  demoUsers,
  onSelectUser,
  onUpdateStage,
  discreteMode,
  onToggleDiscrete,
  language,
  onToggleLanguage,
  onOpenPreNotifications
}) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const isHinglish = language === 'hinglish';
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-border">
      {/* Demo Synthetic Banner as required by specification */}
      {currentUser.is_demo && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-b border-amber-200/60 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5 max-w-4xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>{t.demo_badge}.</strong> {isHinglish ? "Yeh records simulation aur testing ke liye hain, kisi real patient ke nahi." : "Values are algorithmically simulated for demonstration and machine learning validation."}
            </span>
          </div>
          <span className="hidden sm:inline-block bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider">
            SYNTHETIC
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-soft">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-warm-textDark font-serif">HER LIFE</span>
              <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                {isHinglish ? 'AI SAHELI' : 'AI COMPANION'}
              </span>
            </div>
            <p className="text-xs text-warm-textMuted hidden sm:block">{t.app_tagline}</p>
          </div>
        </div>

        {/* Persona Switcher & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Button (English / Hinglish) */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50/80 text-brand-800 hover:bg-brand-100 transition shadow-2xs"
            title="Toggle Language: English / Hinglish"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            <span>{isHinglish ? 'Hinglish (हिंदी)' : 'English'}</span>
          </button>

          {/* Life Stage Badge */}
          <div className="relative">
            <select
              value={currentUser.life_stage}
              onChange={(e) => onUpdateStage(e.target.value as LifeStage)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-7 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                STAGE_LABELS[currentUser.life_stage]?.color || 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="teen_menarche">{isHinglish ? 'Pehla Period (Puberty/Teen)' : 'Puberty & First Period'}</option>
              <option value="college_gen_z">{isHinglish ? 'Gen Z & College (Study/Stress)' : 'Gen Z & College'}</option>
              <option value="reproductive">{isHinglish ? 'Reproductive Years (Fertility/Cycles)' : 'Reproductive Years'}</option>
              <option value="perimenopause">{isHinglish ? 'Perimenopause (Garmi/Shifts)' : 'Perimenopause'}</option>
              <option value="menopause">{isHinglish ? 'Menopause (Post-Period)' : 'Menopause & Later Life'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
              className="flex items-center gap-2 text-xs font-medium text-warm-textDark bg-warm-cardMuted hover:bg-warm-border px-3 py-1.5 rounded-full border border-warm-border transition"
            >
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden md:inline">{currentUser.full_name.split(' ')[0]}</span>
              <span className="md:hidden">Persona</span>
              <ChevronDown className="w-3 h-3 text-warm-textMuted" />
            </button>

            {showPersonaDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-warm-border p-2 z-50">
                <div className="px-3 py-2 border-b border-warm-border text-xs font-semibold text-warm-textMuted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  Select Demo Persona
                </div>
                <div className="py-1">
                  {demoUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowPersonaDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition ${
                        u.id === currentUser.id
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'hover:bg-warm-cardMuted text-warm-textDark'
                      }`}
                    >
                      <span>{u.full_name}</span>
                      <span className="text-[10px] text-warm-textMuted capitalize">
                        Age {u.age_years} • {u.life_stage.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Discrete Preview Toggle (Privacy Requirement) */}
          <button
            onClick={onToggleDiscrete}
            title={discreteMode ? "Discrete mode ON (Parda mode)" : "Discrete mode OFF"}
            className="p-2 rounded-full text-warm-textMuted hover:text-brand-600 hover:bg-warm-cardMuted transition relative"
          >
            {discreteMode ? <EyeOff className="w-4 h-4 text-plum-500" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Pre-Notification Center Button */}
          <button
            onClick={onOpenPreNotifications}
            title="Pre-Notification Center (Advance alerts for periods & check-ins)"
            className="p-2 rounded-full text-warm-textMuted hover:text-brand-600 hover:bg-brand-50 transition relative"
          >
            <Bell className="w-4 h-4 text-brand-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};
