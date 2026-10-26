import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Flame, 
  Clock, 
  Heart, 
  AlertCircle, 
  CheckCircle2, 
  Plus,
  SkipForward
} from 'lucide-react';
import { Exercise, WorkoutHistoryRecord } from '../../data/herMoveCatalog';
import { ExerciseIllustration } from './ExerciseIllustration';
import { LotusBloomIcon } from '../common/LotusBloomIcon';
import { useBackHandler } from '../../services/backNavigation';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  planTitle: string;
  onFinishWorkout: (summary: WorkoutHistoryRecord) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  exercises,
  planTitle,
  onFinishWorkout
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(30);

  // Timed movement timer
  const [timedSecondsRemaining, setTimedSecondsRemaining] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Overall workout timer
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  // Intercept back button while active workout dialog is open
  useBackHandler(
    'workout_abandon_confirm_dialog',
    95,
    () => {
      if (showAbandonConfirm) {
        setShowAbandonConfirm(false);
        return true;
      }
      return false;
    },
    isOpen && showAbandonConfirm
  );

  useBackHandler(
    'active_workout_timer_protection',
    90,
    () => {
      if (!isOpen) return false;
      if (showCelebration) {
        handleFinalize();
        return true;
      }
      setShowAbandonConfirm(true);
      return true;
    },
    isOpen && !showAbandonConfirm
  );

  const currentExercise = exercises[currentIndex] || exercises[0];
  const nextExercise = exercises[currentIndex + 1];

  // Initialize exercise timers whenever current exercise changes
  useEffect(() => {
    if (!currentExercise) return;
    setCurrentSet(1);
    setIsResting(false);
    if (currentExercise.isTimed) {
      setTimedSecondsRemaining(currentExercise.durationSeconds || 30);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [currentIndex, currentExercise]);

  // Overall workout time counter
  useEffect(() => {
    if (!isOpen || showCelebration) return;
    const interval = setInterval(() => {
      setTotalElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, showCelebration]);

  // Exercise countdown timer
  useEffect(() => {
    if (!isTimerRunning || isResting || !currentExercise?.isTimed) return;
    if (timedSecondsRemaining <= 0) {
      handleCompleteSet();
      return;
    }
    const interval = setInterval(() => {
      setTimedSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isResting, timedSecondsRemaining, currentExercise]);

  // Rest countdown timer
  useEffect(() => {
    if (!isResting) return;
    if (restTimeRemaining <= 0) {
      setIsResting(false);
      return;
    }
    const interval = setInterval(() => {
      setRestTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTimeRemaining]);

  if (!isOpen || !currentExercise) return null;

  function handleCompleteSet() {
    const totalSets = currentExercise.defaultSets || 2;
    if (currentSet < totalSets) {
      // Trigger rest period before next set
      setIsResting(true);
      setRestTimeRemaining(currentExercise.restSeconds || 30);
      setCurrentSet((prev) => prev + 1);
      if (currentExercise.isTimed) {
        setTimedSecondsRemaining(currentExercise.durationSeconds || 30);
      }
    } else {
      // Exercise completed
      if (!completedExerciseIds.includes(currentExercise.id)) {
        setCompletedExerciseIds((prev) => [...prev, currentExercise.id]);
      }
      if (currentIndex < exercises.length - 1) {
        // Next exercise
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Complete workout!
        handleTriggerCelebration();
      }
    }
  }

  function handleSkipRest() {
    setIsResting(false);
  }

  function handleTriggerCelebration() {
    setShowCelebration(true);
  }

  function handleFinalize() {
    const record: WorkoutHistoryRecord = {
      id: `workout_${Date.now()}`,
      date: new Date().toISOString(),
      routineName: planTitle,
      totalDurationSeconds: totalElapsedSeconds,
      exercisesCompleted: completedExerciseIds.length > 0 ? completedExerciseIds : [currentExercise.id],
      caloriesBurnedEst: Math.round((totalElapsedSeconds / 60) * 5),
      feelingScore: 'energized'
    };
    onFinishWorkout(record);
    setShowCelebration(false);
    onClose();
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-warm-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-warm-border flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-white to-purple-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
              <LotusBloomIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm sm:text-base text-warm-textDark leading-tight">
                {planTitle}
              </h3>
              <p className="text-[11px] text-warm-textMuted font-medium flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-brand-600" />
                <span>Elapsed: <strong>{formatTime(totalElapsedSeconds)}</strong></span>
                <span>•</span>
                <span>Exercise {currentIndex + 1} of {exercises.length}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => showCelebration ? onClose() : setShowAbandonConfirm(true)}
              className="p-2 rounded-full hover:bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark transition flex items-center gap-1"
              aria-label="Back or Exit Workout"
              title="Leave Workout"
            >
              <ArrowLeft className="w-5 h-5 sm:hidden" />
              <X className="w-5 h-5 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="w-full bg-rose-100 h-1.5">
          <div 
            className="bg-gradient-to-r from-rose-500 via-brand-500 to-purple-500 h-1.5 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        {!showCelebration ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            
            {/* Rest Overlay Banner (when resting between sets) */}
            {isResting ? (
              <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl border-2 border-purple-200 text-center space-y-3 animate-fade-in shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Rest & Deep Breathing
                </span>
                <h4 className="text-xl font-serif font-bold text-warm-textDark">
                  Catch Your Breath 🌸
                </h4>
                <div className="text-4xl font-black font-mono text-purple-700">
                  00:{restTimeRemaining < 10 ? '0' : ''}{restTimeRemaining}
                </div>
                <p className="text-xs text-warm-textMuted max-w-xs mx-auto">
                  Take slow, diaphragmatic breaths. Relax your shoulders and jaw before starting Set {currentSet}.
                </p>
                <button
                  type="button"
                  onClick={handleSkipRest}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition flex items-center gap-1.5 mx-auto shadow-xs active:scale-95"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip Rest & Begin Set {currentSet}</span>
                </button>
              </div>
            ) : (
              <>
                {/* Exercise Visual Illustration */}
                <ExerciseIllustration type={currentExercise.animationType} isAnimated={true} />

                {/* Exercise Title & Set Info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      Set {currentSet} of {currentExercise.defaultSets || 2}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-black text-warm-textDark mt-1">
                      {currentExercise.name}
                    </h2>
                    <p className="text-xs text-warm-textMuted mt-0.5">
                      {currentExercise.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-xl block">
                      {currentExercise.isTimed 
                        ? `${currentExercise.durationSeconds}s Work` 
                        : (currentExercise.defaultReps || '10 reps')}
                    </span>
                    <span className="text-[10px] text-warm-textMuted font-medium block mt-1">
                      Rest: {currentExercise.restSeconds}s
                    </span>
                  </div>
                </div>

                {/* Countdown Timer (for timed exercises) */}
                {currentExercise.isTimed && (
                  <div className="p-4 bg-gradient-to-r from-rose-50/80 to-purple-50/80 rounded-2xl border border-pink-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-warm-textMuted uppercase block">Hold / Movement Timer</span>
                      <span className="text-3xl font-black font-mono text-brand-700">
                        00:{timedSecondsRemaining < 10 ? '0' : ''}{timedSecondsRemaining}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`p-3 rounded-full text-white font-bold transition shadow-xs active:scale-95 ${
                          isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-600 hover:bg-brand-700'
                        }`}
                      >
                        {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimedSecondsRemaining((prev) => prev + 10)}
                        className="px-2.5 py-2 rounded-xl bg-white border border-warm-border text-xs font-bold text-warm-textDark hover:bg-rose-50 transition"
                      >
                        +10s
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimedSecondsRemaining(currentExercise.durationSeconds || 30)}
                        className="p-2.5 rounded-xl bg-white border border-warm-border text-warm-textMuted hover:text-warm-textDark transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Target Muscles & Benefits */}
                <div className="p-3 bg-warm-cardMuted/70 rounded-xl border border-warm-border text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-warm-textDark">
                    <LotusBloomIcon className="w-3.5 h-3.5 text-brand-600" />
                    <span>Target Muscles & Benefit:</span>
                  </div>
                  <p className="text-[11px] text-warm-textMuted leading-relaxed">
                    {currentExercise.fitnessBenefit}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentExercise.targetMuscles.map((muscle) => (
                      <span key={muscle} className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-md border border-warm-border text-warm-textDark">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-warm-textDark uppercase tracking-wider">
                    Instructions
                  </h4>
                  <ol className="space-y-1.5 text-xs text-warm-textDark">
                    {currentExercise.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Beginner Alternative & Safety Form Tip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-100 text-[11px] text-rose-900">
                    <span className="font-bold block mb-0.5 text-rose-800">🌱 Beginner Friendly Alternative:</span>
                    <span>{currentExercise.beginnerAlternative}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 text-[11px] text-amber-900">
                    <span className="font-bold block mb-0.5 text-amber-800">⚠️ Form & Safety Cue:</span>
                    <span>{currentExercise.safetyTips[0] || 'Listen to your body and stop if sharp pain occurs.'}</span>
                  </div>
                </div>

                {/* Next Exercise Preview */}
                {nextExercise && (
                  <div className="p-3 bg-white rounded-xl border border-warm-border flex items-center justify-between text-xs text-warm-textMuted">
                    <span className="font-medium">Up Next: <strong>{nextExercise.name}</strong></span>
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {nextExercise.isTimed ? `${nextExercise.durationSeconds}s` : nextExercise.defaultReps}
                    </span>
                  </div>
                )}
              </>
            )}

          </div>
        ) : (
          /* Workout Celebration & Summary View */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fade-in my-auto">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-200">
              <LotusBloomIcon className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Movement Complete! 🎉
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                You Moved Your Way! 🌸
              </h3>
              <p className="text-xs sm:text-sm text-warm-textMuted max-w-md mx-auto leading-relaxed">
                Celebrating your dedication to your health, vitality, and well-being. Every small movement counts toward feeling your absolute best.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[10px] text-rose-600 font-bold uppercase block">Time Moved</span>
                <span className="text-lg font-black text-rose-900 font-mono">{formatTime(totalElapsedSeconds)}</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <span className="text-[10px] text-purple-600 font-bold uppercase block">Exercises</span>
                <span className="text-lg font-black text-purple-900 font-mono">{exercises.length}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[10px] text-amber-600 font-bold uppercase block">Est. Energy</span>
                <span className="text-lg font-black text-amber-900 font-mono">~{Math.round((totalElapsedSeconds / 60) * 5)} kcal</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF7F4] rounded-2xl border border-warm-border text-xs text-warm-textMuted max-w-md mx-auto">
              <p className="italic font-serif">
                "Movement is a celebration of what your body can do, not a punishment for what you ate."
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinalize}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-bold text-sm shadow-md transition transform active:scale-95"
            >
              Save to Movement History & Finish
            </button>
          </div>
        )}

        {/* Modal Bottom Footer Controls */}
        {!showCelebration && (
          <div className="p-4 border-t border-warm-border bg-white flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-3.5 py-2.5 rounded-xl border border-warm-border text-warm-textMuted hover:text-warm-textDark text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteSet}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {currentSet < (currentExercise.defaultSets || 2) 
                  ? `Completed Set ${currentSet}` 
                  : (currentIndex < exercises.length - 1 ? 'Next Exercise' : 'Finish Workout 🎉')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentIndex < exercises.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                } else {
                  handleTriggerCelebration();
                }
              }}
              className="px-3.5 py-2.5 rounded-xl border border-warm-border text-warm-textMuted hover:text-warm-textDark text-xs font-bold transition flex items-center gap-1"
            >
              <span className="hidden sm:inline">Skip</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Abandon Workout Confirmation Warning Modal */}
        {showAbandonConfirm && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-warm-border text-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                <AlertCircle className="w-7 h-7 text-amber-600" />
              </div>
              <h4 className="font-serif font-black text-lg text-warm-textDark mb-1.5">
                Abandon Active Workout?
              </h4>
              <p className="text-xs text-warm-textMuted mb-6 leading-relaxed font-medium">
                You have a live session in progress ({formatTime(totalElapsedSeconds)} elapsed). Leaving now will abandon your logged sets.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowAbandonConfirm(false)}
                  className="py-3 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white transition active:scale-95 shadow-sm"
                >
                  Continue Workout
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAbandonConfirm(false);
                    onClose();
                  }}
                  className="py-3 px-3 rounded-xl font-bold text-xs bg-warm-cardMuted hover:bg-rose-100 text-rose-700 transition active:scale-95 border border-warm-border"
                >
                  Leave Workout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
