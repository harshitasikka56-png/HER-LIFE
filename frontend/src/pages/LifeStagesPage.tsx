import React from 'react';
import { UserProfile, LifeStage } from '../types';
import { Flower2, Check, ArrowRight, Heart, BookOpen, Baby, ShieldAlert } from 'lucide-react';
import { FirstPeriodEducationSlide } from '../components/FirstPeriodEducationSlide';
import { Language } from '../services/i18n';

interface LifeStagesPageProps {
  currentUser: UserProfile;
  onUpdateStage: (stage: LifeStage) => void;
  language?: Language;
}

const STAGES = [
  {
    id: 'teen_menarche' as LifeStage,
    title: 'A. Puberty & First Period',
    subtitle: 'Teens & First-Time Menstruators',
    badge: 'Puberty Education & Hygiene',
    color: 'from-rose-500 to-pink-500',
    description: 'Empowering young people and families with gentle, age-appropriate knowledge on body changes, cycle tracking, and menstrual products.',
    features: [
      'First-period preparation checklist and backpack wellness pouch advice.',
      'Tracking newly established cycles (normal for periods to be irregular during the first 2-3 years).',
      'Hygiene guidance: pads, tampons, cups, and period underwear.',
      'Trusted-adult and parental support with safeguarding and privacy.'
    ]
  },
  {
    id: 'college_gen_z' as LifeStage,
    title: 'B. Gen Z & College Students',
    subtitle: 'Campus Life & Early Adulthood',
    badge: 'Study & Hormone Balance',
    color: 'from-lavender-700 to-plum-700',
    description: 'Managing cycle health alongside academic deadlines, irregular sleep, exam stress, and early endocrine awareness.',
    features: [
      'Exam-stress and deadline-aware routine & study break planner.',
      'PCOS awareness: monitoring acne, hirsutism, and prolonged cycle delays.',
      'Sleep, hydration, and caffeine balance insights.',
      'Discreet reminders tailored to college timetables.'
    ]
  },
  {
    id: 'reproductive' as LifeStage,
    title: 'C. Millennials & Reproductive Years',
    subtitle: 'Cycle Mastery & Fertility Intelligence',
    badge: 'Fertility & Hormonal Health',
    color: 'from-brand-600 to-brand-500',
    description: 'Advanced cycle tracking, evidence-informed fertility education, endometriosis awareness, and optional pregnancy mode.',
    features: [
      'Accurate period tracking with historical variance & Bayesian bounds.',
      'Estimated fertile window education (with non-contraception disclaimers).',
      'Deep pelvic discomfort, severe dysmenorrhea, and endometriosis awareness.',
      'Optional pregnancy & postpartum tracking mode.'
    ]
  },
  {
    id: 'perimenopause' as LifeStage,
    title: 'D. Perimenopause Transition',
    subtitle: 'Navigating Hormonal Fluctuations',
    badge: 'Vasomotor & Mood Support',
    color: 'from-plum-800 to-plum-600',
    description: 'Personalized support for changing bleeding patterns, vasomotor hot flashes, sleep shifts, and cognitive brain fog.',
    features: [
      'Vasomotor symptom diary (tracking hot flashes & night sweats).',
      'Irregular cycle interval logging and bleeding duration monitoring.',
      'Brain fog, fatigue, and mood variability tracking.',
      'NAMS evidence-based non-hormonal and lifestyle strategies.'
    ]
  },
  {
    id: 'menopause' as LifeStage,
    title: 'E. Menopause & Later Life',
    subtitle: 'Post-Menopausal Vitality & Long-Term Health',
    badge: 'Bone & Longevity Wellness',
    color: 'from-sage-700 to-sage-800',
    description: 'Long-term health monitoring focusing on bone density, cardiovascular health, vaginal/urinary wellness, and symptom relief.',
    features: [
      'Post-menopausal symptom diary (mood, vitality, sleep quality).',
      'Bone-health, calcium, and weight-bearing exercise recommendations.',
      'Vaginal and urinary health education with non-judgmental guidance.',
      'Urgent red-flag alerts: Any post-menopausal bleeding warrants immediate medical checkup.'
    ]
  }
];

export const LifeStagesPage: React.FC<LifeStagesPageProps> = ({ currentUser, onUpdateStage, language }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-soft">
        <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
          Personalized Life Stages
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warm-textDark mt-1">
          Every Stage. Every Cycle. Every You.
        </h2>
        <p className="text-xs sm:text-sm text-warm-textMuted mt-2 max-w-2xl leading-relaxed">
          HER LIFE adapts its algorithms, daily guidance, reminders, and symptom forms to your actual reproductive circumstances. You can switch stages at any time as your journey evolves.
        </p>
      </div>

      {/* First Period Education Slide (Interactive zero-knowledge beginner guide) */}
      <FirstPeriodEducationSlide
        language={language || 'en'}
        defaultExpanded={currentUser.life_stage === 'teen_menarche'}
      />

      {/* Grid of 5 Life Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAGES.map((stage) => {
          const isSelected = currentUser.life_stage === stage.id;
          return (
            <div
              key={stage.id}
              className={`rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-brand-500 shadow-soft-lg ring-2 ring-brand-400/30'
                  : 'bg-white/80 hover:bg-white border-warm-border shadow-soft'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-warm-cardMuted text-warm-textDark border border-warm-border">
                    {stage.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                      Current Active Stage
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold font-serif text-warm-textDark">{stage.title}</h3>
                <p className="text-xs text-warm-textMuted font-medium mt-0.5">{stage.subtitle}</p>

                <p className="text-xs text-warm-textDark mt-3 leading-relaxed">
                  {stage.description}
                </p>

                <div className="mt-4 pt-4 border-t border-warm-border space-y-2">
                  {stage.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-warm-textDark">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-warm-border">
                {isSelected ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    <span>Currently Selected</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateStage(stage.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-warm-cardMuted hover:bg-brand-500 hover:text-white text-warm-textDark border border-warm-border hover:border-brand-500 transition duration-200 flex items-center justify-center gap-1.5"
                  >
                    <span>Switch to this Life Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
