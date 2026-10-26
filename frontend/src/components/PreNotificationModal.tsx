import React, { useState } from 'react';
import { Bell, ShieldCheck, Eye, EyeOff, Check, Heart, X, Clock, Calendar, Droplets } from 'lucide-react';
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
  const [welcomeAlertEnabled, setWelcomeAlertEnabled] = useState(true);
  const [ovulationAlertEnabled, setOvulationAlertEnabled] = useState(true);
  const [checkinTime, setCheckinTime] = useState('20:00');
  const [hydrationAlertEnabled, setHydrationAlertEnabled] = useState(true);
  const [hydrationIntervalHours, setHydrationIntervalHours] = useState<number>(2);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);

  if (!isOpen) return null;

  function handleSendTestAlert(type: 'period' | 'welcome' | 'hydration' = 'period') {
    if (type === 'welcome') {
      const title = discreteMode 
        ? "HerLife: Welcome to your safe space" 
        : "HerLife: Welcome! Your cycle baseline is active";
      const body = discreteMode
        ? "Saheli is here whenever you need private guidance."
        : "Your health sanctuary is set up. Feel free to talk with Saheli or log symptoms anytime.";
      onTriggerToast(title, body);
      return;
    }

    if (type === 'hydration') {
      const title = discreteMode 
        ? "Gentle Reminder: Take a moment" 
        : "Hydration Alert: Time for a warm sip 💧";
      const body = discreteMode
        ? "Pause and refresh yourself."
        : "Drink a glass of warm water or herbal tea to soothe uterine muscles and sustain energy.";
      onTriggerToast(title, body);
      return;
    }

    const title = discreteMode 
      ? "Reminder: Scheduled Wellness Check-In" 
      : `Advance Alert: Period Expected in ${advanceDays} Days`;

    const body = discreteMode
      ? "Time for your private health check-in."
      : `Prepare your preferred cycle products and maintain optimal hydration. Rest and take it easy.`;

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
          {/* Welcome Notification 1 Hour Post-Onboarding */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-warm-border bg-white text-xs">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-600 fill-brand-100" />
              <div>
                <span className="font-bold text-warm-textDark">
                  {isHinglish ? "Welcome Notification (1 Ghante Baad)" : "Welcome Notification (1 Hr Post-Onboarding)"}
                </span>
                <p className="text-[10px] text-warm-textMuted">
                  {isHinglish ? "Onboarding ke baad Saheli ka pehla comforting check-in" : "Initial gentle check-in from Saheli once your profile is set up"}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={welcomeAlertEnabled}
              onChange={(e) => setWelcomeAlertEnabled(e.target.checked)}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
          </div>

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
          <div className="p-3 rounded-2xl border border-warm-border bg-white text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <div>
                  <span className="font-bold text-warm-textDark">
                    {isHinglish ? "Paani Peene Ka Reminder (Hydration Alert)" : "Smart Hydration Prompts"}
                  </span>
                  <p className="text-[10px] text-warm-textMuted">
                    {isHinglish ? "Uterine cramps aur fatigue kam karne ke liye" : "Supports pelvic blood flow and reduces fatigue"}
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

            {hydrationAlertEnabled && (
              <div className="pt-2 border-t border-warm-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-warm-textMuted font-medium">Frequency:</span>
                  <div className="flex gap-1.5">
                    {[1.5, 2, 3, 4].map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setHydrationIntervalHours(hrs)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          hydrationIntervalHours === hrs
                            ? 'bg-cyan-600 text-white border-cyan-600'
                            : 'bg-warm-cardMuted text-warm-textDark border-warm-border'
                        }`}
                      >
                        Every {hrs}h
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-warm-textMuted">Quiet Hours (10 PM – 7 AM):</span>
                  <button
                    type="button"
                    onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                      quietHoursEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {quietHoursEnabled ? 'Silenced at Night' : 'Always Active'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Live Test Notification Simulator Buttons */}
        <div className="pt-1 space-y-2">
          <span className="text-[11px] font-bold text-warm-textMuted uppercase tracking-wider block">
            Test Realtime Notification Banners
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSendTestAlert('period')}
              className="py-2.5 px-3 bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-soft transition flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Period Alert</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendTestAlert('welcome')}
              className="py-2.5 px-3 bg-gradient-to-r from-plum-600 to-brand-600 hover:from-plum-700 hover:to-brand-700 text-white font-bold text-xs rounded-xl shadow-soft transition flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Welcome Note</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendTestAlert('hydration')}
              className="py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-soft transition flex items-center justify-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Hydration Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
