import React from 'react';
import { 
  Calendar, 
  Activity, 
  Clock, 
  Flower2, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  BookOpen, 
  CheckCircle2,
  Users,
  MessageSquare
} from 'lucide-react';
import { LotusBloomIcon } from '../common/LotusBloomIcon';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onExploreFeatures?: () => void;
  onOpenPrivacy?: () => void;
  onOpenDoctorLibrary?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onOpenPrivacy,
  onOpenDoctorLibrary
}) => {
  function scrollToFeatures() {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const LIFE_STAGES = [
    { title: "Puberty & First Period", subtitle: "Ages 9-16", color: "from-rose-400 to-pink-300", badge: "First Period Guide" },
    { title: "Gen Z & College Health", subtitle: "Ages 17-24", color: "from-lavender-400 to-indigo-300", badge: "Stress & Irregular Cycles" },
    { title: "Reproductive & Fertility", subtitle: "Ages 25-39", color: "from-brand-500 to-rose-400", badge: "Ovulation & Hormones" },
    { title: "Perimenopause Transition", subtitle: "Ages 40-50", color: "from-plum-600 to-purple-400", badge: "Vasomotor & Mood Rhythm" },
    { title: "Menopause & Healthy Aging", subtitle: "Ages 51+", color: "from-sage-600 to-emerald-400", badge: "Bone & Heart Longevity" }
  ];

  const FEATURES = [
    {
      icon: Calendar,
      title: "1. Personal Menstrual Tracking",
      desc: "Intuitive period logging, cycle history calculation, flow volume recording, and mathematical forecasting with transparent confidence bounds."
    },
    {
      icon: Activity,
      title: "2. Symptom & Lifestyle Tracking",
      desc: "Correlate cramps, sleep quality, daily hydration, physical stress, and mood changes to observe holistic hormonal interplay."
    },
    {
      icon: Clock,
      title: "3. Personalized Health Timeline",
      desc: "A continuous medical-grade journey tracking cycle variations, life-stage transitions, and key reproductive milestones over years."
    },
    {
      icon: Flower2,
      title: "4. Health & Rhythm Insights",
      desc: "Discover hidden symptom patterns without diagnostic guesswork. Powered by clinical heuristics and empathetic explanations."
    },
    {
      icon: BookOpen,
      title: "5. Menopause & Life-Stage Education",
      desc: "Evidence-based clinical guides vetted by OB/GYN clinicians, debunking myths and guiding preparation for every reproductive milestone."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-warm-textDark flex flex-col font-sans selection:bg-brand-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F8EBDC] border border-[#E8D5C4] flex items-center justify-center p-1 shadow-soft">
              <img src="/logo_transparent.png" alt="HerLife Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-serif font-black text-lg tracking-tight text-warm-textDark">
                HerLife
              </span>
              <span className="text-[10px] ml-2 font-bold uppercase tracking-wider text-plum-700 bg-plum-50 px-2 py-0.5 rounded-full border border-plum-100 hidden sm:inline">
                From Menarche to Menopause
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToFeatures}
              className="text-xs font-semibold text-warm-textMuted hover:text-warm-textDark transition hidden sm:block"
            >
              Explore Features
            </button>
            <button
              onClick={onStartOnboarding}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs shadow-soft transition transform hover:scale-105 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Soft Ambient Pastel Glow Blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-rose-200/30 via-lavender-200/30 to-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-5">
          {/* Animated Hero Lotus Emblem */}
          <div className="flex flex-col items-center justify-center mb-1">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-rose-300/30 via-brand-200/20 to-amber-200/30 blur-2xl animate-glow pointer-events-none" />
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 p-1 animate-lotus-breathe">
                <img 
                  src="/logo_transparent.png" 
                  alt="HerLife Lotus Emblem" 
                  className="w-full h-full object-contain filter drop-shadow-md select-none" 
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-rose-200/80 shadow-2xs text-xs font-semibold text-brand-700">
            <LotusBloomIcon className="w-3.5 h-3.5 text-brand-500" />
            <span>AI-Powered Women's Health Companion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-warm-textDark leading-[1.15]">
            Your Body. Your Journey. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-rose-500 to-plum-600">
              Your HerLife.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-textMuted max-w-2xl mx-auto leading-relaxed font-normal">
            Understand your menstrual health, track your symptoms, and discover your personal patterns through every stage of life — from your first period to menopause.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-plum-600 hover:from-brand-700 hover:to-plum-700 text-white font-bold text-sm shadow-soft transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-warm-cardMuted text-warm-textDark font-bold text-sm border border-warm-border shadow-2xs transition"
            >
              Explore Features
            </button>
          </div>

          {/* Privacy Trust Badge */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-warm-textMuted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy-First • No Data Selling • Clinical Evidence-Grade</span>
          </div>
        </div>

        {/* Life Stages Horizontal Showcase Cards */}
        <div className="mt-14 pt-8 border-t border-warm-border/60">
          <span className="text-xs font-bold uppercase tracking-widest text-warm-textMuted block mb-4">
            Designed For Every Chapter Of A Woman's Life
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 max-w-6xl mx-auto items-stretch">
            {LIFE_STAGES.map((st, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl bg-white border border-warm-border/80 shadow-2xs hover:shadow-soft transition-all text-left flex flex-col justify-between h-full ${
                  i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${st.color} mb-2.5 shadow-2xs`} />
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-warm-textDark">{st.title}</h4>
                  <span className="text-[10px] text-warm-textMuted font-medium">{st.subtitle}</span>
                </div>
                <div className="pt-3">
                  <span className="text-[9px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded-full inline-block border border-brand-100">
                    {st.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section id="features-section" className="py-16 bg-white border-y border-warm-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warm-textDark">
              Scientific Precision Meets Deep Empathy
            </h2>
            <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
              Every feature is built to validate personal health baselines while respecting privacy and autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#FAF7F4] border border-warm-border/80 shadow-2xs hover:shadow-soft transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white text-brand-600 flex items-center justify-center shadow-2xs border border-warm-border">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-warm-textDark">{feat.title}</h3>
                  <p className="text-xs text-warm-textMuted leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}

            {/* Sixth highlight card: Clinical Assurance */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-plum-900 to-brand-900 text-white shadow-soft space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base">Doctor-Reviewed Library</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Clear separation between algorithmic estimates and real clinical diagnoses, with PubMed references and vetted OB/GYN guidelines.
                </p>
              </div>
              <button
                onClick={onStartOnboarding}
                className="mt-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 py-2.5 px-4 rounded-xl transition flex items-center justify-between"
              >
                <span>Start Your Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Reassurance Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-sage-50/80 border border-emerald-200/80 shadow-soft flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-soft">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-serif font-bold text-base text-emerald-950">
              Your Health Information Is Sensitive and Protected
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              HerLife adheres to strict data minimization. Your personal biomarker entries, cycle records, and notes are never sold to advertisers or third-party data brokers. You retain 100% control with export and deletion capabilities.
            </p>
          </div>
          <button
            onClick={onStartOnboarding}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 shadow-2xs transition"
          >
            Join HerLife
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-warm-border py-8 text-xs text-warm-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-serif font-bold text-warm-textDark text-sm">HerLife</span>
            <span>— Every Stage of Her. Every Story Matters.</span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <button onClick={scrollToFeatures} className="hover:text-brand-600 transition">About</button>
            <button onClick={onOpenPrivacy} className="hover:text-brand-600 transition">Privacy Policy</button>
            <button onClick={onOpenPrivacy} className="hover:text-brand-600 transition">Terms of Service</button>
            <button onClick={onOpenDoctorLibrary} className="hover:text-brand-600 transition">Clinical Evidence</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
