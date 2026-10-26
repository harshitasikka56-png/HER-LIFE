import React, { useState } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { ShieldCheck, EyeOff, Lock, AlertTriangle, Check, LogOut } from 'lucide-react';

interface PrivacyPageProps {
  currentUser: UserProfile;
  discreteMode: boolean;
  onToggleDiscrete: () => void;
  onLogout?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  currentUser,
  discreteMode,
  onToggleDiscrete,
  onLogout
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Title */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy, Consent & Safety</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-warm-textDark mt-1">
          Your Health Data Belongs Exclusively to You
        </h2>
        <p className="text-xs text-warm-textMuted mt-1 leading-relaxed">
          Women's reproductive health information is profoundly personal. HER LIFE enforces strict data sovereignty, privacy-by-design, and zero third-party data monetization.
        </p>
      </div>

      {/* Discrete Preview Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-warm-textDark flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-plum-600" />
              <span>Discrete Notification Previews</span>
            </h3>
            <p className="text-xs text-warm-textMuted mt-0.5">
              Replaces sensitive reproductive terms with neutral reminders on shared screens and mobile lockscreens.
            </p>
          </div>
          <button
            onClick={onToggleDiscrete}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              discreteMode ? 'bg-plum-700' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                discreteMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-3.5 bg-warm-cardMuted rounded-2xl text-xs space-y-1.5 border border-warm-border">
          <div className="flex justify-between font-medium">
            <span className="text-warm-textMuted">When Discrete Mode is ON:</span>
            <span className="text-plum-700 font-bold">"Reminder: Personal Check-In"</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-warm-textMuted">When Discrete Mode is OFF:</span>
            <span className="text-warm-textDark font-bold">"Upcoming Period Expected in 3 Days"</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantees */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-3">
        <h3 className="text-base font-bold text-warm-textDark font-serif">Core Privacy Commitments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-warm-textDark">
          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Zero Commercial Ad Sharing
            </span>
            <p className="text-warm-textMuted leading-relaxed">
              We never sell or distribute your cycles, symptom logs, or fertility observations to advertising brokers.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              Data Encryption & Isolation
            </span>
            <p className="text-warm-textMuted leading-relaxed">
              Real user health data is stored in isolated relational stores separate from synthetic benchmark records.
            </p>
          </div>
        </div>
      </div>

      {/* Account Session & Log Out */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-3">
        <h3 className="text-base font-bold text-warm-textDark font-serif">Account Session</h3>
        <p className="text-xs text-warm-textMuted">
          Signed in as <strong className="text-warm-textDark font-semibold">{currentUser.full_name}</strong> ({currentUser.email}). You can log out anytime to exit your current session.
        </p>

        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition min-h-[46px] active:scale-98 shadow-xs"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
