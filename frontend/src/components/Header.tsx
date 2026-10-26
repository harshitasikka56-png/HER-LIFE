import React, { useState } from 'react';
import { UserProfile, LifeStage } from '../types';
import { Heart, Bell, Eye, EyeOff, Users, ChevronDown, Palette, ArrowLeft } from 'lucide-react';
import { LotusBloomIcon } from './common/LotusBloomIcon';
import { Language, translations } from '../services/i18n';
import { useBackHandler } from '../services/backNavigation';

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
  onOpenThemeStudio?: () => void;
  onOpenOnboarding?: () => void;
  onOpenLanding?: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

const STAGE_LABELS: Record<LifeStage, { en: string; color: string }> = {
  teen_menarche: { en: 'Puberty & First Period', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  college_gen_z: { en: 'Gen Z & College Health', color: 'bg-lavender-200 text-lavender-700 border-lavender-300' },
  reproductive: { en: 'Reproductive & Fertility', color: 'bg-brand-100 text-brand-700 border-brand-200' },
  perimenopause: { en: 'Perimenopause Transition', color: 'bg-plum-100 text-plum-700 border-plum-200' },
  menopause: { en: 'Menopause & Healthy Aging', color: 'bg-sage-100 text-sage-800 border-sage-200' },
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
  onOpenPreNotifications,
  onOpenThemeStudio,
  onOpenOnboarding,
  onOpenLanding,
  onBack,
  canGoBack
}) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const t = translations[language];

  // Close persona dropdown on back button
  useBackHandler(
    'header_persona_dropdown',
    85,
    () => {
      if (showPersonaDropdown) {
        setShowPersonaDropdown(false);
        return true;
      }
      return false;
    },
    showPersonaDropdown
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-border shadow-xs pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand Logo & Back Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {canGoBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Navigate Back"
              title="Go back"
              className="p-1.5 -ml-1 sm:ml-0 rounded-xl bg-warm-cardMuted hover:bg-warm-border/80 text-warm-textDark transition active:scale-95 flex items-center justify-center shadow-2xs border border-warm-border/60 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-warm-textDark" />
              <span className="text-xs font-bold hidden sm:inline ml-1">Back</span>
            </button>
          )}

          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F8EBDC] border border-[#E8D5C4] flex items-center justify-center p-0.5 sm:p-1 shadow-2xs transition-transform hover:scale-105 overflow-hidden group shrink-0">
            <img 
              src="/logo_transparent.png" 
              alt="HerLife Lotus Logo" 
              className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-warm-textDark font-serif whitespace-nowrap">HER LIFE</span>
              {/* Only show AI Companion tag on medium and larger screens so mobile controls are never pushed off */}
              <span className="hidden md:inline-flex text-[10px] font-bold bg-[#F8EBDC] text-[#8A3E31] px-2 py-0.5 rounded-full border border-[#E8D5C4] tracking-wide uppercase">
                AI Companion
              </span>
            </div>
            <p className="text-xs text-warm-textMuted hidden lg:block font-medium">{t.app_tagline}</p>
          </div>
        </div>

        {/* Persona Switcher & Mobile Visible Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Life Stage Badge & Selector */}
          <div className="relative">
            <select
              value={currentUser.life_stage}
              onChange={(e) => onUpdateStage(e.target.value as LifeStage)}
              className={`text-[11px] sm:text-xs font-semibold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border cursor-pointer appearance-none pr-5 sm:pr-6 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-2xs max-w-[74px] xs:max-w-[95px] sm:max-w-none truncate ${
                STAGE_LABELS[currentUser.life_stage]?.color || 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="teen_menarche">Puberty & First Period</option>
              <option value="college_gen_z">Gen Z & College Health</option>
              <option value="reproductive">Reproductive & Fertility</option>
              <option value="perimenopause">Perimenopause Transition</option>
              <option value="menopause">Menopause & Healthy Aging</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* Discrete Preview Toggle (Parda Mode) */}
          <button
            onClick={onToggleDiscrete}
            title={discreteMode ? "Discrete mode ON (Parda mode)" : "Discrete mode OFF"}
            className="p-1.5 sm:p-2 rounded-xl text-warm-textMuted hover:text-brand-600 hover:bg-warm-cardMuted transition relative active:scale-95 shrink-0"
          >
            {discreteMode ? <EyeOff className="w-4 h-4 text-plum-600" /> : <Eye className="w-4 h-4 text-warm-textMuted" />}
          </button>

          {/* Pre-Notification Center Button */}
          <button
            onClick={onOpenPreNotifications}
            title="Pre-Notification Center (Advance alerts for periods & check-ins)"
            className="p-1.5 sm:p-2 rounded-xl text-warm-textMuted hover:text-brand-600 hover:bg-brand-50 transition relative active:scale-95 shrink-0"
          >
            <Bell className="w-4 h-4 text-brand-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Canva-Style Theme Studio Button */}
          {onOpenThemeStudio && (
            <button
              onClick={onOpenThemeStudio}
              title="Theme Studio: Change Colors & Aesthetic"
              className="p-1.5 sm:p-2 rounded-xl text-warm-textMuted hover:text-rose-600 hover:bg-rose-50 transition relative active:scale-95 shrink-0"
            >
              <Palette className="w-4 h-4 text-rose-500" />
            </button>
          )}

          {/* User Persona Profile Avatar & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
              className="flex items-center gap-1 text-xs font-semibold text-warm-textDark bg-warm-cardMuted hover:bg-warm-border p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-warm-border transition shrink-0 active:scale-95"
              title="Switch Demo Persona / Profile Settings"
            >
              <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.full_name.charAt(0)}
              </div>
              <span className="hidden md:inline">{currentUser.full_name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-warm-textMuted" />
            </button>

            {showPersonaDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-warm-border p-2 z-50">
                <div className="px-3 py-2 border-b border-warm-border text-xs font-semibold text-warm-textMuted flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <LotusBloomIcon className="w-3.5 h-3.5 text-brand-500" />
                    Select Demo Persona
                  </span>
                  <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-bold">
                    {currentUser.full_name.split(' ')[0]}
                  </span>
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

                {/* Onboarding & Landing actions */}
                <div className="pt-2 mt-1 border-t border-warm-border space-y-1">
                  {onOpenOnboarding && (
                    <button
                      onClick={() => {
                        setShowPersonaDropdown(false);
                        onOpenOnboarding();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-brand-700 hover:bg-brand-50 flex items-center gap-1.5 font-semibold transition"
                    >
                      <LotusBloomIcon className="w-3.5 h-3.5 text-brand-500" />
                      <span>Launch Onboarding Wizard</span>
                    </button>
                  )}
                  {onOpenLanding && (
                    <button
                      onClick={() => {
                        setShowPersonaDropdown(false);
                        onOpenLanding();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-warm-textMuted hover:bg-warm-cardMuted hover:text-warm-textDark flex items-center gap-1.5 transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>View Landing Page & Splash</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
