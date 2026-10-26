import React from 'react';
import { Heart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OnboardingData } from './OnboardingWizard';

interface WelcomeTransitionProps {
  data: OnboardingData;
  onEnterDashboard: () => void;
}

export const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ data, onEnterDashboard }) => {
  // Determine supportive, non-diagnostic message based on menstrual journey
  let headline = "Welcome to your health sanctuary";
  let supportiveMessage = "Your health journey starts here. Begin building your personal cycle history.";
  let badgeText = "Cycle Intelligence Ready";
  let themeGradient = "from-brand-600 via-rose-500 to-plum-600";

  if (data.menstrualJourney === 'not_started') {
    headline = `Welcome to your journey, ${data.preferredName}`;
    supportiveMessage = "Let's help you understand the changes your body may experience with empathy, science, and zero shame.";
    badgeText = "Puberty & First Period Companion";
    themeGradient = "from-rose-500 via-pink-400 to-amber-400";
  } else if (data.menstrualJourney === 'currently_on_period') {
    headline = `We're here with you today, ${data.preferredName}`;
    supportiveMessage = "Let's check in with your body today. Track your flow, cramps, and how you are feeling in a quiet, private space.";
    badgeText = "Active Period Tracking";
    themeGradient = "from-rose-600 via-brand-500 to-amber-500";
  } else if (data.menstrualJourney === 'menopausal_transition' || data.menstrualJourney === 'menopause') {
    headline = `Your journey continues, ${data.preferredName}`;
    supportiveMessage = "Learn about your symptoms, honor your body's rhythm, and track hormonal changes over time with gentle clarity.";
    badgeText = "Menopause & Longevity Wellness";
    themeGradient = "from-plum-700 via-purple-600 to-rose-400";
  } else {
    headline = `Welcome, ${data.preferredName}`;
    supportiveMessage = "Your personal baseline is initialized. Begin building your cycle history and discovering patterns at your own pace.";
    badgeText = "Reproductive Health Companion";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F4] via-[#FDF5F7] to-[#F7EFF8] flex flex-col items-center justify-center p-6 sm:p-12 text-center animate-fade-in select-none">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-md rounded-[36px] p-8 sm:p-10 border border-rose-200/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Soft decorative background aura */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-rose-200/40 via-lavender-200/30 to-amber-100/40 blur-2xl pointer-events-none" />

        {/* Celebrating Lotus Emblem */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-[#F8EBDC] border border-[#E8D5C4] p-3 flex items-center justify-center shadow-glow animate-lotus-breathe">
          <img src="/logo_transparent.png" alt="HerLife Logo" className="w-full h-full object-contain" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        {/* Badge & Title */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100 inline-block">
            {badgeText}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
            {headline}
          </h2>
        </div>

        {/* Supportive Message */}
        <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed max-w-md mx-auto">
          {supportiveMessage}
        </p>

        {/* Profile Snapshot Pills */}
        <div className="p-4 bg-warm-cardMuted/70 rounded-2xl border border-warm-border text-xs text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-warm-textMuted">Preferred Name:</span>
            <span className="font-bold text-warm-textDark">{data.preferredName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-warm-textMuted">Selected Priorities:</span>
            <span className="font-bold text-brand-700">{data.goals.length} areas configured</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-warm-textMuted">Data Protection:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Encrypted On Device
            </span>
          </div>
        </div>

        {/* Enter Dashboard CTA */}
        <button
          onClick={onEnterDashboard}
          className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${themeGradient} hover:opacity-95 text-white font-bold text-sm shadow-soft transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}
        >
          <span>Enter HerLife Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-warm-textMuted italic">
          Every stage of her. Every story matters.
        </p>
      </div>
    </div>
  );
};
