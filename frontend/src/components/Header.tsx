import React, { useState } from 'react';
import { UserProfile, LifeStage } from '../types';
import { Heart, Bell, Eye, EyeOff, Users, ChevronDown, Sparkles, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  demoUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onUpdateStage: (stage: LifeStage) => void;
  discreteMode: boolean;
  onToggleDiscrete: () => void;
}

const STAGE_LABELS: Record<LifeStage, { label: string; color: string }> = {
  teen_menarche: { label: 'Puberty & First Period', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  college_gen_z: { label: 'Gen Z & College', color: 'bg-lavender-200 text-lavender-700 border-lavender-300' },
  reproductive: { label: 'Reproductive Years', color: 'bg-brand-100 text-brand-700 border-brand-200' },
  perimenopause: { label: 'Perimenopause', color: 'bg-plum-100 text-plum-700 border-plum-200' },
  menopause: { label: 'Menopause & Beyond', color: 'bg-sage-100 text-sage-800 border-sage-200' },
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  demoUsers,
  onSelectUser,
  onUpdateStage,
  discreteMode,
  onToggleDiscrete
}) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-border">
      {/* Demo Synthetic Banner as required by specification */}
      {currentUser.is_demo && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-b border-amber-200/60 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5 max-w-4xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>DEMO DATA — SYNTHETIC, NOT REAL PATIENT RECORDS.</strong> Values are algorithmically simulated for demonstration and machine learning validation.
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
                AI COMPANION
              </span>
            </div>
            <p className="text-xs text-warm-textMuted hidden sm:block">Every Stage. Every Cycle. Every You.</p>
          </div>
        </div>

        {/* Persona Switcher & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Life Stage Badge */}
          <div className="relative">
            <select
              value={currentUser.life_stage}
              onChange={(e) => onUpdateStage(e.target.value as LifeStage)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-7 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                STAGE_LABELS[currentUser.life_stage]?.color || 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="teen_menarche">Puberty & First Period</option>
              <option value="college_gen_z">Gen Z & College</option>
              <option value="reproductive">Reproductive Years</option>
              <option value="perimenopause">Perimenopause</option>
              <option value="menopause">Menopause & Later Life</option>
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
              <span className="hidden md:inline">{currentUser.full_name}</span>
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
            title={discreteMode ? "Discrete mode ON (sensitive terms masked)" : "Discrete mode OFF"}
            className="p-2 rounded-full text-warm-textMuted hover:text-brand-600 hover:bg-warm-cardMuted transition relative"
          >
            {discreteMode ? <EyeOff className="w-4 h-4 text-plum-500" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-warm-textMuted hover:text-brand-600 hover:bg-warm-cardMuted transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-soft-lg border border-warm-border p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-warm-border text-xs font-semibold text-warm-textDark">
                  <span>Smart Reminders</span>
                  <span className="text-[10px] text-plum-600 bg-plum-50 px-1.5 py-0.5 rounded">
                    {discreteMode ? 'Discrete Mask Active' : 'Normal'}
                  </span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div className="p-2 bg-brand-50/60 rounded-xl border border-brand-100">
                    <p className="font-medium text-brand-800">
                      {discreteMode ? 'Reminder: Personal Check-In' : 'Upcoming Period Notice'}
                    </p>
                    <p className="text-[11px] text-brand-600 mt-0.5">
                      {discreteMode ? 'Time for your daily wellness check-in.' : 'Estimated in 3 days. Carry your preferred products.'}
                    </p>
                  </div>
                  <div className="p-2 bg-sage-50/60 rounded-xl border border-sage-100">
                    <p className="font-medium text-sage-800">Hydration & Rest</p>
                    <p className="text-[11px] text-sage-600 mt-0.5">Remember your 6-8 glasses of water today.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
