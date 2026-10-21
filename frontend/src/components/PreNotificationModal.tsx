import React, { useState } from 'react';
import { Bell, ShieldCheck, Eye, EyeOff, Check, Sparkles, X, Clock, Calendar, Droplets } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface PreNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  discreteMode: boolean;
  onToggleDiscrete: () => void;
  language: Language;
  onTriggerToast: (title: string, body: string) => void;
}

export const PreNotificationModal: React.FC<PreNotificationModalProps> = ({
  isOpen,
  onClose,
  discreteMode,
  onToggleDiscrete,
  language,
  onTriggerToast
}) => {
  const t = translations[language].notifications;
  const isHinglish = language === 'hinglish';

  const [advanceDays, setAdvanceDays] = useState<number>(2);
  const [periodAlertEnabled, setPeriodAlertEnabled] = useState(true);
  const [ovulationAlertEnabled, setOvulationAlertEnabled] = useState(true);
  const [checkinTime, setCheckinTime] = useState('20:00');
  const [hydrationAlertEnabled, setHydrationAlertEnabled] = useState(true);

  if (!isOpen) return null;

  function handleSendTestAlert() {
    const title = discreteMode 
      ? (isHinglish ? "Reminder: Personal Check-In" : "Reminder: Personal Check-In")
      : (isHinglish ? `Alert: Period ${advanceDays} Din Mein Expected Hai` : `Advance Alert: Period Expected in ${advanceDays} Days`);

    const body = discreteMode
      ? (isHinglish ? "Aapka daily wellness update check karne ka waqt." : "Time for your scheduled health check-in.")
      : (isHinglish 
          ? `Apne pads ya period products bag mein rakh lein. Aaram se rahein aur paani peete rahein.`
          : `Prepare your preferred period products and maintain hydration. Relax and take it easy.`);

    onTriggerToast(title, body);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-warm-border shadow-soft-lg space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-warm-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-warm-textDark font-serif">{t.title}</h3>
              <p className="text-xs text-warm-textMuted">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Advance Period Pre-Notification Settings */}
        <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              {t.advance_warning}
            </span>
            <input
              type="checkbox"
              checked={periodAlertEnabled}
              onChange={(e) => setPeriodAlertEnabled(e.target.checked)}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
          </div>

          <p className="text-[11px] text-warm-textMuted leading-relaxed">
            {t.advance_desc}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-warm-textDark">
              {isHinglish ? "Kitne din pehle alert chahiye:" : "Notify me in advance:"}
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setAdvanceDays(days)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                    advanceDays === days
                      ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                      : 'bg-white text-warm-textDark border-warm-border hover:bg-warm-cardMuted'
                  }`}
                >
                  {days} {isHinglish ? "Din Pehle" : days === 1 ? "Day Before" : "Days Before"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Discrete Notification Preview Mode (Privacy Requirement) */}
        <div className="p-4 bg-warm-cardMuted/70 rounded-2xl border border-warm-border space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {discreteMode ? <EyeOff className="w-4 h-4 text-plum-600" /> : <Eye className="w-4 h-4 text-warm-textMuted" />}
              <span className="text-xs font-bold text-warm-textDark">
                {isHinglish ? "Discrete Mode (Parda / Privacy Mode)" : "Discrete Mode (Mask Sensitive Words)"}
              </span>
            </div>
            <button
              onClick={onToggleDiscrete}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                discreteMode ? 'bg-plum-700' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  discreteMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="text-[11px] space-y-1 pt-1 text-warm-textMuted">
            <div className="flex justify-between">
              <span>{isHinglish ? "Lockscreen Par Kaisa Dikhega:" : "Lockscreen Preview:"}</span>
              <span className="font-bold text-plum-700">
                {discreteMode 
                  ? (isHinglish ? '"Reminder: Personal Check-In"' : '"Reminder: Personal Check-In"')
                  : (isHinglish ? `"Alert: Period ${advanceDays} din mein expected"` : `"Alert: Period in ${advanceDays} days"`)}
              </span>
            </div>
            <p className="text-[10px] text-warm-textMuted italic">
              {isHinglish 
                ? "* Discrete mode mein lockscreen par period ya bleeding ka naam nahi aayega."
                : "* Discrete mode ensures friends or family glancing at your phone cannot see private health details."}
            </p>
          </div>
        </div>

        {/* 3. Daily & Lifestyle Reminders */}
        <div className="space-y-3">
          {/* Daily Evening Check-In */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-warm-border bg-white text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="font-bold text-warm-textDark">
                  {isHinglish ? "Roz Sham Ka Check-In Reminder" : "Daily Evening Check-In Reminder"}
                </span>
                <p className="text-[10px] text-warm-textMuted">
                  {isHinglish ? "Rozana symptoms aur stress log karne ke liye" : "To log symptoms, stress, and mood"}
                </p>
              </div>
            </div>
            <input
              type="time"
              value={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-warm-border focus:ring-1 focus:ring-brand-400"
            />
          </div>

          {/* Hydration & Paani Alerts */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-warm-border bg-white text-xs">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <div>
                <span className="font-bold text-warm-textDark">
                  {isHinglish ? "Paani Peene Ka Reminder (Hydration Alert)" : "Hydration & Rest Pre-Alert"}
                </span>
                <p className="text-[10px] text-warm-textMuted">
                  {isHinglish ? "Har 3-4 ghante mein gentle paani reminder" : "Gentle hydration prompt every few hours"}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hydrationAlertEnabled}
              onChange={(e) => setHydrationAlertEnabled(e.target.checked)}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
          </div>
        </div>

        {/* 4. Live Test Notification Simulator Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSendTestAlert}
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-plum-600 hover:from-brand-600 hover:to-plum-700 text-white font-bold text-xs rounded-2xl shadow-soft transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.test_btn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
