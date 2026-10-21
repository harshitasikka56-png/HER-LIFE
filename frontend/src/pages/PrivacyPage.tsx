import React, { useState } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { ShieldCheck, EyeOff, Lock, Trash2, Download, AlertTriangle, Check } from 'lucide-react';

interface PrivacyPageProps {
  currentUser: UserProfile;
  discreteMode: boolean;
  onToggleDiscrete: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  currentUser,
  discreteMode,
  onToggleDiscrete
}) => {
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    if (window.confirm("ARE YOU SURE? This will permanently delete all your cycle history, symptom logs, and account records. This action cannot be undone.")) {
      setDeleting(true);
      try {
        await api.deleteAccount(currentUser.id);
        setDeleted(true);
      } catch (e) {
        console.error(e);
      } finally {
        setDeleting(false);
      }
    }
  }

  function handleExport() {
    window.open(api.getExportCSVUrl(currentUser.id), '_blank');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy, Consent & Safety</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-warm-textDark mt-1">
          Your Health Data Belongs Exclusively to You
        </h2>
        <p className="text-xs text-warm-textMuted mt-1 leading-relaxed">
          Women's reproductive health information is profoundly personal. HER LIFE enforces strict data sovereignty, privacy-by-design, and zero third-party data monetization.
        </p>
      </div>

      {/* Discrete Preview Controls */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
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
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-3">
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

      {/* Data Export & Deletion */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <h3 className="text-base font-bold text-warm-textDark font-serif">Data Portability & Account Erasure</h3>
        <p className="text-xs text-warm-textMuted">
          You have full rights to export your entire dataset in CSV format or permanently erase your account.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-warm-cardMuted hover:bg-warm-border text-warm-textDark border border-warm-border transition"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>Download All Data (.CSV)</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={deleting || deleted}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleted ? 'Account Deleted' : deleting ? 'Purging records...' : 'Permanently Delete Account & Data'}</span>
          </button>
        </div>

        {deleted && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
            All records and history have been purged from the database.
          </div>
        )}
      </div>
    </div>
  );
};
