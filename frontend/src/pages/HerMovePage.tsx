import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Dumbbell, 
  Flower2, 
  Heart, 
  Clock, 
  Check, 
  Play, 
  Pause,
  Search, 
  SlidersHorizontal, 
  Footprints, 
  Droplet, 
  Moon, 
  Compass, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Plus, 
  RotateCcw,
  RefreshCw,
  Zap,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { LotusBloomIcon } from '../components/common/LotusBloomIcon';
import { UserProfile, DailyLogRecord } from '../types';
import { Language } from '../services/i18n';
import { 
  Exercise, 
  FitnessProfile, 
  WorkoutCategory, 
  HER_MOVE_EXERCISES, 
  WORKOUT_CATEGORIES_DATA, 
  DAILY_LIFESTYLE_HABITS, 
  generateDailyPlan,
  WorkoutHistoryRecord
} from '../data/herMoveCatalog';
import { ExerciseIllustration } from '../components/fitness/ExerciseIllustration';
import { ActiveWorkoutModal } from '../components/fitness/ActiveWorkoutModal';
import { FitnessSetupModal } from '../components/fitness/FitnessSetupModal';
import { useBackHandler } from '../services/backNavigation';

interface HerMovePageProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: any) => void;
  onBack?: () => void;
  language: Language;
}

const FITNESS_PROFILE_KEY = 'herlife_fitness_profile';
const WORKOUT_HISTORY_KEY = 'herlife_workout_history';
const DAILY_STEPS_KEY = 'herlife_daily_steps';
const HYDRATION_COUNT_KEY = 'herlife_hydration_glasses';

export const HerMovePage: React.FC<HerMovePageProps> = ({
  currentUser,
  onNavigateTab,
  onBack,
  language
}) => {
  // 1. Fitness Profile State
  const [profile, setProfile] = useState<FitnessProfile>(() => {
    try {
      const saved = localStorage.getItem(FITNESS_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    // Smart default generation-aware preset
    const age = currentUser?.age_years || 24;
    return {
      goal: age < 16 ? 'general' : age >= 45 ? 'flexibility' : 'strength',
      preference: age < 16 ? 'home' : 'home',
      level: age < 16 ? 'beginner' : 'beginner',
      availableMinutes: 15,
      equipment: ['none'],
      mobilityConsiderations: [],
      dailyStepTarget: 6000,
      setupCompleted: false
    };
  });

  // 2. Modals state
  const [showSetupModal, setShowSetupModal] = useState<boolean>(() => !profile.setupCompleted);
  const [showActiveWorkout, setShowActiveWorkout] = useState<boolean>(false);
  const [activeExerciseDetail, setActiveExerciseDetail] = useState<Exercise | null>(null);

  // Back handler for exercise detail modal
  useBackHandler(
    'hermove_exercise_detail',
    80,
    () => {
      if (activeExerciseDetail) {
        setActiveExerciseDetail(null);
        return true;
      }
      return false;
    },
    Boolean(activeExerciseDetail)
  );

  // Back handler for fitness setup modal
  useBackHandler(
    'hermove_setup_modal',
    75,
    () => {
      if (showSetupModal) {
        setShowSetupModal(false);
        return true;
      }
      return false;
    },
    showSetupModal
  );

  // 3. Category & Search filtering
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // 4. Daily Plan State
  const [currentPlan, setCurrentPlan] = useState<{
    planTitle: string;
    planSubtitle: string;
    estimatedMinutes: number;
    exercises: Exercise[];
  }>(() => {
    return generateDailyPlan(profile, currentUser.age_years || 24, false);
  });

  // 5. Lifestyle trackers
  const [dailySteps, setDailySteps] = useState<number>(() => {
    const saved = localStorage.getItem(DAILY_STEPS_KEY);
    return saved ? parseInt(saved, 10) : 3450;
  });

  const [hydrationGlasses, setHydrationGlasses] = useState<number>(() => {
    const saved = localStorage.getItem(HYDRATION_COUNT_KEY);
    return saved ? parseInt(saved, 10) : 4;
  });

  // 6. Workout History
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(WORKOUT_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 7. Desk break interactive timer
  const [deskBreakSeconds, setDeskBreakSeconds] = useState(120);
  const [isDeskBreakRunning, setIsDeskBreakRunning] = useState(false);

  // Synchronize plan whenever profile changes
  useEffect(() => {
    const newPlan = generateDailyPlan(profile, currentUser.age_years || 24, false);
    setCurrentPlan(newPlan);
  }, [profile, currentUser.age_years]);

  // Save profile to localStorage
  function handleSaveProfile(newProfile: FitnessProfile) {
    setProfile(newProfile);
    try {
      localStorage.setItem(FITNESS_PROFILE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  }

  // Save completed workout
  function handleFinishWorkout(record: WorkoutHistoryRecord) {
    const updated = [record, ...workoutHistory];
    setWorkoutHistory(updated);
    try {
      localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  // Add steps
  function handleAddSteps(count: number) {
    const next = dailySteps + count;
    setDailySteps(next);
    localStorage.setItem(DAILY_STEPS_KEY, next.toString());
  }

  // Add hydration glass
  function handleAddGlass() {
    const next = Math.min(12, hydrationGlasses + 1);
    setHydrationGlasses(next);
    localStorage.setItem(HYDRATION_COUNT_KEY, next.toString());
  }

  // Desk break timer effect
  useEffect(() => {
    if (!isDeskBreakRunning) return;
    if (deskBreakSeconds <= 0) {
      setIsDeskBreakRunning(false);
      setDeskBreakSeconds(120);
      return;
    }
    const interval = setInterval(() => {
      setDeskBreakSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isDeskBreakRunning, deskBreakSeconds]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return HER_MOVE_EXERCISES.filter((ex) => {
      // Category filter
      if (selectedCategory !== 'all' && !ex.categories.includes(selectedCategory)) {
        return false;
      }
      // Level filter
      if (levelFilter !== 'all' && !ex.levels.includes(levelFilter)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscles = ex.targetMuscles.some((m) => m.toLowerCase().includes(q));
        const matchesBenefit = ex.fitnessBenefit.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscles && !matchesBenefit) return false;
      }
      return true;
    });
  }, [selectedCategory, levelFilter, searchQuery]);

  // Remove or replace exercise in plan
  function handleRemoveFromPlan(id: string) {
    setCurrentPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== id)
    }));
  }

  function handleAddExerciseToPlan(exercise: Exercise) {
    if (currentPlan.exercises.some((e) => e.id === exercise.id)) return;
    setCurrentPlan((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));
  }

  // Compute generation badge
  const age = currentUser.age_years || 24;
  const generationCohortLabel = 
    age < 15 ? 'Gen Alpha' :
    age <= 29 ? 'Gen Z' :
    age <= 45 ? 'Millennial' :
    age <= 61 ? 'Gen X' : 'Golden Cohort';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* 1. HERO & BRANDING BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-[#FFF9F5] to-[#F5F3FF] border border-pink-200/80 p-5 sm:p-8 shadow-sm">
        {/* Decorative Blooming Petals in Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-200/30 to-purple-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-amber-100/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {onBack && (
              <div>
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-warm-textDark text-xs font-bold shadow-2xs border border-pink-200/90 transition active:scale-95"
                  aria-label="Back to Previous Screen"
                >
                  <ArrowLeft className="w-4 h-4 text-rose-500" />
                  <span>Back</span>
                </button>
              </div>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-pink-200/90 shadow-2xs text-xs font-bold text-brand-700">
              <LotusBloomIcon className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>HER MOVE • Personalized Movement & Healthy Lifestyle</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-warm-textDark tracking-tight leading-tight">
              Move Your Way, <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">Feel Your Best.</span>
            </h1>

            <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
              Empowering, scientifically tailored movement routines for women across every phase of life. 
              Adapted to your age, energy levels, physical preferences, and joint comfort.
            </p>

            {/* Profile Meta Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-purple-100/80 text-purple-800 font-bold border border-purple-200">
                {generationCohortLabel} ({age} yrs)
              </span>
              <span className="px-3 py-1 rounded-xl bg-rose-100/80 text-rose-800 font-bold border border-rose-200 capitalize">
                Goal: {profile.goal.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-100/80 text-amber-900 font-bold border border-amber-200 capitalize">
                {profile.preference.replace('_', ' ')} • {profile.level}
              </span>
              <button
                type="button"
                onClick={() => setShowSetupModal(true)}
                className="px-3 py-1 rounded-xl bg-white hover:bg-brand-50 text-brand-700 font-bold border border-brand-200 transition shadow-2xs flex items-center gap-1 active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize Goals</span>
              </button>
            </div>
          </div>

          {/* Quick Action Card (Start Today's Workout) */}
          <div className="p-5 bg-white/95 rounded-2xl border border-pink-200 shadow-md flex flex-col justify-between space-y-4 shrink-0 md:w-72">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Today's Recommended Session
              </span>
              <h3 className="font-serif font-bold text-base text-warm-textDark mt-1.5 leading-snug">
                {currentPlan.planTitle}
              </h3>
              <p className="text-xs text-warm-textMuted mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>~{currentPlan.estimatedMinutes} mins • {currentPlan.exercises.length} Exercises</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowActiveWorkout(true)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-bold text-xs shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Workout Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S MOVEMENT PLAN SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-warm-textDark flex items-center gap-2">
              <LotusBloomIcon className="w-5 h-5 text-brand-600" />
              <span>Your Movement Plan for Today</span>
            </h2>
            <p className="text-xs sm:text-sm text-warm-textMuted">
              Personalized daily progression designed to keep you energized without fatigue.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const refreshed = generateDailyPlan(profile, currentUser.age_years || 24, false);
                setCurrentPlan(refreshed);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-warm-border text-warm-textMuted hover:text-warm-textDark text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Routine</span>
            </button>
            <button
              type="button"
              onClick={() => setShowActiveWorkout(true)}
              className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start</span>
            </button>
          </div>
        </div>

        {/* Planned Exercises Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentPlan.exercises.map((exercise, idx) => (
            <div 
              key={exercise.id}
              className="bg-white rounded-2xl border border-warm-border hover:border-pink-300 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="relative">
                  <ExerciseIllustration type={exercise.animationType} className="h-32 rounded-xl" isAnimated={false} />
                  <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 text-brand-700 font-black text-xs flex items-center justify-center shadow-xs">
                    {idx + 1}
                  </span>
                  {exercise.isPeriodComfortSafe && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold bg-rose-100/90 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                      Comfort Safe
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-warm-textDark group-hover:text-brand-600 transition">
                    {exercise.name}
                  </h4>
                  <p className="text-[11px] text-warm-textMuted line-clamp-1 mt-0.5">
                    {exercise.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-warm-textMuted pt-1 border-t border-warm-border/60">
                  <span className="text-brand-700">
                    {exercise.isTimed ? `${exercise.durationSeconds}s Hold` : exercise.defaultReps}
                  </span>
                  <span>{exercise.defaultSets} Sets</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveExerciseDetail(exercise)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-warm-cardMuted hover:bg-rose-50 text-warm-textDark font-semibold text-xs transition text-center"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveFromPlan(exercise.id)}
                  title="Replace or skip"
                  className="p-1.5 rounded-xl hover:bg-rose-100 text-warm-textMuted hover:text-rose-600 transition text-xs"
                >
                  Skip
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HEALTHY LIFESTYLE RECOMMENDATIONS & DAILY HABITS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-warm-textDark flex items-center gap-2">
              <Flower2 className="w-5 h-5 text-rose-500" />
              <span>Daily Supportive Lifestyle Habits</span>
            </h2>
            <p className="text-xs sm:text-sm text-warm-textMuted">
              Micro-habits to naturally nurture your metabolism, spine alignment, and hormonal calm throughout the day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card A: 2-Minute Desk Movement Break */}
          <div className="p-4 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/70 rounded-2xl border border-pink-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full">
                  Post-Sitting Reset
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-warm-textDark">
                2-Min Desk Spine Stretch
              </h4>
              <p className="text-xs text-warm-textMuted leading-relaxed">
                Shoulder rolls, gentle neck extension, and seated spinal decompress to awaken circulation.
              </p>
            </div>

            <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-800">
                {Math.floor(deskBreakSeconds / 60)}:{(deskBreakSeconds % 60) < 10 ? '0' : ''}{deskBreakSeconds % 60}
              </span>
              <button
                type="button"
                onClick={() => setIsDeskBreakRunning(!isDeskBreakRunning)}
                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center gap-1 active:scale-95"
              >
                {isDeskBreakRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                <span>{isDeskBreakRunning ? 'Pause' : 'Start 2m'}</span>
              </button>
            </div>
          </div>

          {/* Card B: Walking & Daily Step Tracker */}
          <div className="p-4 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70 rounded-2xl border border-amber-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Footprints className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full">
                  Step Activity
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-warm-textDark">
                Gentle Walking Rhythm
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-amber-800">{dailySteps.toLocaleString()}</span>
                <span className="text-xs text-warm-textMuted">/ {profile.dailyStepTarget.toLocaleString()} steps</span>
              </div>
              <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (dailySteps / profile.dailyStepTarget) * 100)}%` }} 
                />
              </div>
            </div>

            <div className="pt-2 border-t border-amber-100 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAddSteps(500)}
                className="flex-1 py-1 rounded-xl bg-white border border-amber-200 text-amber-900 font-bold text-[11px] hover:bg-amber-50 transition"
              >
                +500 Steps
              </button>
              <button
                type="button"
                onClick={() => handleAddSteps(1000)}
                className="flex-1 py-1 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition"
              >
                +1,000 Steps
              </button>
            </div>
          </div>

          {/* Card C: Hydration Vitality Tracker */}
          <div className="p-4 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/70 rounded-2xl border border-blue-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Droplet className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100/60 px-2 py-0.5 rounded-full">
                  Fascia & Muscle Water
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-warm-textDark">
                Daily Hydration Balance
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-blue-800">{hydrationGlasses}</span>
                <span className="text-xs text-warm-textMuted">/ 8 glasses logged</span>
              </div>
              {/* Glass Indicators */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-sm transition-all ${
                      i < hydrationGlasses ? 'bg-blue-500' : 'bg-blue-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
              <span className="text-[10px] text-warm-textMuted">Keeps joints lubricated</span>
              <button
                type="button"
                onClick={handleAddGlass}
                className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Log Glass</span>
              </button>
            </div>
          </div>

          {/* Card D: Restorative Recovery & Pelvic Comfort */}
          <div className="p-4 bg-gradient-to-br from-purple-50/70 via-white to-lavender-50/70 rounded-2xl border border-purple-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Moon className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100/60 px-2 py-0.5 rounded-full">
                  Recovery & Calm
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-warm-textDark">
                Period & Nervous System Care
              </h4>
              <p className="text-xs text-warm-textMuted leading-relaxed">
                During cramping or low-energy days, prioritize resting poses like Child's Pose and gentle leg elevation.
              </p>
            </div>

            <div className="pt-2 border-t border-purple-100">
              <button
                type="button"
                onClick={() => setSelectedCategory('period_comfort')}
                className="w-full py-1.5 rounded-xl bg-purple-100/80 hover:bg-purple-200/80 text-purple-800 font-bold text-xs transition text-center"
              >
                Browse Period Comfort Flow →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. COMPLETE EXERCISE DIRECTORY & FILTERABLE CATEGORIES */}
      <section className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-warm-textDark">
                Explore Exercise Library ({filteredExercises.length})
              </h2>
              <p className="text-xs sm:text-sm text-warm-textMuted">
                Filtered and adaptable to your physical comfort, available gear, and fitness level.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-warm-textMuted" />
              <input
                type="text"
                placeholder="Search squats, core, yoga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-warm-border focus:border-brand-400 focus:ring-2 focus:ring-brand-100 text-xs text-warm-textDark shadow-2xs"
              />
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {WORKOUT_CATEGORIES_DATA.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'bg-white border border-warm-border text-warm-textMuted hover:text-warm-textDark hover:bg-rose-50/40'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary filter chips (Level) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-warm-textMuted">Filter Level:</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-0.5 rounded-lg capitalize text-[11px] transition ${
                  levelFilter === lvl
                    ? 'bg-brand-100 text-brand-800 font-bold border border-brand-300'
                    : 'bg-white border border-warm-border text-warm-textMuted hover:text-warm-textDark'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((exercise) => {
            const isAlreadyInPlan = currentPlan.exercises.some((e) => e.id === exercise.id);
            return (
              <div 
                key={exercise.id}
                className="bg-white rounded-3xl border border-warm-border hover:border-pink-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <ExerciseIllustration type={exercise.animationType} className="h-36" isAnimated={false} />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                      {exercise.levels.map((lvl) => (
                        <span key={lvl} className="text-[9px] font-bold uppercase tracking-wider bg-white/90 text-warm-textDark px-2 py-0.5 rounded-full border border-warm-border shadow-2xs capitalize">
                          {lvl}
                        </span>
                      ))}
                    </div>
                    {exercise.isPeriodComfortSafe && (
                      <span className="absolute top-2.5 right-2.5 text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                        Comfort Safe
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-black text-base text-warm-textDark hover:text-brand-600 transition cursor-pointer" onClick={() => setActiveExerciseDetail(exercise)}>
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-warm-textMuted line-clamp-1 mt-0.5">
                      {exercise.tagline}
                    </p>
                  </div>

                  {/* Sets / Reps / Duration / Rest */}
                  <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-xl bg-warm-cardMuted/70 border border-warm-border text-center text-xs">
                    <div>
                      <span className="text-[9px] text-warm-textMuted uppercase font-semibold block">Sets</span>
                      <span className="font-bold text-warm-textDark">{exercise.defaultSets}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-warm-textMuted uppercase font-semibold block">Target</span>
                      <span className="font-bold text-brand-700">
                        {exercise.isTimed ? `${exercise.durationSeconds}s` : (exercise.defaultReps || '10 reps')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-warm-textMuted uppercase font-semibold block">Rest</span>
                      <span className="font-bold text-warm-textDark">{exercise.restSeconds}s</span>
                    </div>
                  </div>

                  {/* Target Muscles */}
                  <div className="flex flex-wrap gap-1">
                    {exercise.targetMuscles.slice(0, 3).map((m) => (
                      <span key={m} className="text-[10px] bg-rose-50/70 text-rose-800 font-medium px-2 py-0.5 rounded-md border border-rose-100">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Beginner Alternative Cues */}
                  <p className="text-[11px] text-warm-textMuted leading-relaxed bg-pink-50/40 p-2 rounded-xl border border-pink-100/60">
                    <strong className="text-brand-700">Alternative:</strong> {exercise.beginnerAlternative}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-warm-border/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveExerciseDetail(exercise)}
                    className="flex-1 py-2 rounded-xl bg-warm-cardMuted hover:bg-rose-50 text-warm-textDark font-bold text-xs transition"
                  >
                    Guide & Form
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAlreadyInPlan) handleAddExerciseToPlan(exercise);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isAlreadyInPlan
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-2xs'
                    }`}
                  >
                    {isAlreadyInPlan ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAlreadyInPlan ? 'In Plan' : 'Add to Plan'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MOVEMENT HISTORY & STREAK */}
      <section className="p-5 sm:p-6 bg-white rounded-3xl border border-warm-border shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-warm-textDark flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Your Movement History</span>
            </h3>
            <p className="text-xs text-warm-textMuted">
              Tracking your consistency and gentle progress on your device.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-full">
            {workoutHistory.length} Sessions Logged
          </span>
        </div>

        {workoutHistory.length === 0 ? (
          <div className="p-6 text-center text-warm-textMuted text-xs bg-warm-cardMuted/50 rounded-2xl border border-warm-border space-y-2">
            <LotusBloomIcon className="w-8 h-8 text-brand-400 mx-auto" />
            <p className="font-semibold text-warm-textDark">No completed sessions yet.</p>
            <p>Complete your first workout above to start building your personal movement timeline!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {workoutHistory.slice(0, 6).map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-warm-cardMuted/60 border border-warm-border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-warm-textDark truncate max-w-[150px]">{item.routineName}</span>
                  <span className="text-[10px] text-warm-textMuted">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-warm-textMuted text-[11px]">
                  <span>⏱ {Math.round(item.totalDurationSeconds / 60)} mins</span>
                  <span>•</span>
                  <span>🔥 ~{item.caloriesBurnedEst} kcal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. CLINICAL SAFETY & EMPOWERMENT FOOTER NOTE */}
      <section className="p-4 bg-warm-cardMuted/70 rounded-2xl border border-warm-border text-xs text-warm-textMuted space-y-2">
        <div className="flex items-center gap-2 text-warm-textDark font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Safety & Movement Guidelines</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Always listen attentively to your body. Discontinue any movement immediately if you experience dizziness, sharp joint pain, or unusual discomfort.
          HER MOVE provides personalized educational and wellness fitness suggestions, not clinical medical assessments or treatment for diagnosed conditions.
        </p>
      </section>

      {/* MODALS */}
      {/* 1. Setup / Profile Customization Modal */}
      <FitnessSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        currentProfile={profile}
        userAge={currentUser.age_years || 24}
        userName={currentUser.full_name || 'Friend'}
        onSaveProfile={handleSaveProfile}
      />

      {/* 2. Interactive Active Workout Player Modal */}
      <ActiveWorkoutModal
        isOpen={showActiveWorkout}
        onClose={() => setShowActiveWorkout(false)}
        exercises={currentPlan.exercises}
        planTitle={currentPlan.planTitle}
        onFinishWorkout={handleFinishWorkout}
      />

      {/* 3. Single Exercise Detail Modal */}
      {activeExerciseDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-warm-border shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-warm-border">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                  Exercise Guide
                </span>
                <h3 className="font-serif font-black text-xl text-warm-textDark">
                  {activeExerciseDetail.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveExerciseDetail(null)}
                className="p-1.5 rounded-full hover:bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark transition"
              >
                ✕
              </button>
            </div>

            <ExerciseIllustration type={activeExerciseDetail.animationType} className="h-44" isAnimated={true} />

            <div className="space-y-1">
              <span className="text-xs font-bold text-warm-textDark block">Benefits:</span>
              <p className="text-xs text-warm-textMuted leading-relaxed">
                {activeExerciseDetail.fitnessBenefit}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-warm-textDark uppercase tracking-wider block">
                Form & Steps:
              </span>
              <ol className="space-y-1.5 text-xs text-warm-textDark">
                {activeExerciseDetail.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-900 space-y-1">
              <span className="font-bold block">🌱 Beginner Modification:</span>
              <p>{activeExerciseDetail.beginnerAlternative}</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">⚠️ Safety & Form Tip:</span>
              <p>{activeExerciseDetail.safetyTips.join(' ')}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-warm-border">
              <button
                type="button"
                onClick={() => {
                  handleAddExerciseToPlan(activeExerciseDetail);
                  setActiveExerciseDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition text-center"
              >
                Add to Today's Plan
              </button>
              <button
                type="button"
                onClick={() => setActiveExerciseDetail(null)}
                className="px-4 py-2.5 rounded-xl border border-warm-border text-warm-textMuted hover:text-warm-textDark font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
