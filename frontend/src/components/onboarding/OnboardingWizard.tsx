import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Heart, 
  ShieldCheck, 
  Calendar, 
  Scale, 
  HelpCircle, 
  AlertCircle, 
  Droplet, 
  Moon, 
  Flame, 
  Smile, 
  Info,
  CheckCircle2,
  Edit3,
  CheckSquare,
} from 'lucide-react';
import { LotusBloomIcon } from '../common/LotusBloomIcon';
import { LifeStage, UserProfile } from '../../types';
import { INDIAN_LANGUAGES } from '../../services/i18n';
import { GenerationRevealScreen, calculateGenerationFromBirthYear, GENERATIONS_DATA } from './GenerationRevealScreen';
import { useBackHandler } from '../../services/backNavigation';

export interface OnboardingData {
  preferredName: string;
  preferredLanguage: string;
  age: number;
  birthYear?: number;
  dateOfBirth?: string;
  weight?: number | null;
  weightUnit: 'kg' | 'lb';
  generation: string;
  menstrualJourney: 
    | 'not_started' 
    | 'started' 
    | 'currently_on_period' 
    | 'menopausal_transition' 
    | 'menopause' 
    | 'not_sure';
  
  // Follow-up: Not started
  pubertyEducationInterest: boolean;
  
  // Follow-up: Started / Currently bleeding
  lastPeriodDate?: string;
  usualCycleLength?: number;
  cycleRegularity?: string;
  usualBleedingDurationDays?: string; // 1-2, 3, 4, 5, 6, 7, >7, irregular, not_sure
  
  // Follow-up: Currently on period
  periodStartDate?: string;
  flowIntensity?: 'spotting' | 'light' | 'medium' | 'heavy';
  crampsSeverity?: number;
  selectedSymptoms: string[];
  
  // Follow-up: Menopause
  menopauseTiming?: string;
  menopauseSymptoms: string[];
  
  // Goals / Preferences
  goals: string[];
  
  // Consents
  consentStorage: boolean;
  consentAI: boolean;
  consentNotifications: boolean;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Form State
  const [formData, setFormData] = useState<OnboardingData>({
    preferredName: '',
    preferredLanguage: 'en',
    age: 24,
    weight: null,
    weightUnit: 'kg',
    generation: '',
    menstrualJourney: 'started',
    pubertyEducationInterest: true,
    lastPeriodDate: '',
    usualCycleLength: 28,
    usualBleedingDurationDays: '5',
    cycleRegularity: 'regular',
    periodStartDate: new Date().toISOString().split('T')[0],
    flowIntensity: 'medium',
    crampsSeverity: 1,
    selectedSymptoms: ['Cramps', 'Bloating'],
    menopauseTiming: '1-3 years',
    menopauseSymptoms: ['Hot flashes', 'Sleep disruption'],
    goals: ['Tracking my menstrual cycle', 'Understanding cramps and other symptoms'],
    consentStorage: true,
    consentAI: true,
    consentNotifications: true
  });

  // State for optional exact birth year / date of birth
  const [showCustomBirthYear, setShowCustomBirthYear] = useState<boolean>(false);
  const [exactBirthYear, setExactBirthYear] = useState<number | null>(null);
  const [exactDOB, setExactDOB] = useState<string>('');

  // Validation Error state
  const [error, setError] = useState<string>('');

  // Step 1 validation
  function validateStep1(): boolean {
    if (!formData.preferredName.trim()) {
      setError('Please enter the name you would like us to call you.');
      return false;
    }
    setError('');
    return true;
  }

  // Step 2 validation
  function validateStep2(): boolean {
    if (!formData.age || formData.age < 9 || formData.age > 105) {
      setError('Please enter a valid age between 9 and 105.');
      return false;
    }
    setError('');
    return true;
  }

  // Step 5 validation
  function validateStep5(): boolean {
    if (!formData.menstrualJourney) {
      setError('Please choose the option that best reflects where you are right now.');
      return false;
    }
    setError('');
    return true;
  }

  // Step 7 validation
  function validateStep7(): boolean {
    if (formData.goals.length === 0) {
      setError('Please select at least one topic you would like HerLife to support you with.');
      return false;
    }
    setError('');
    return true;
  }

  // Step 8 validation
  function validateStep8(): boolean {
    if (!formData.consentStorage) {
      setError('Essential local storage consent is required to save your health logs on your device.');
      return false;
    }
    setError('');
    return true;
  }

  function handleAgeChange(val: string) {
    if (val === '') {
      setFormData((prev) => ({ ...prev, age: 0, generation: '' }));
      return;
    }
    const parsedAge = parseInt(val, 10);
    if (isNaN(parsedAge)) return;

    const currentYear = new Date().getFullYear();
    const calculatedBirthYear = currentYear - parsedAge;
    const detectedCohort = calculateGenerationFromBirthYear(calculatedBirthYear);

    // Update exactBirthYear and formData immediately so both remain in sync
    setExactBirthYear(calculatedBirthYear);
    setFormData((prev) => ({
      ...prev,
      age: parsedAge,
      birthYear: calculatedBirthYear,
      generation: detectedCohort
    }));
    if (parsedAge >= 9 && parsedAge <= 105) {
      setError('');
    }
  }

  function handleDOBChange(dob: string) {
    setExactDOB(dob);
    if (dob) {
      const birthDate = new Date(dob);
      if (!isNaN(birthDate.getTime())) {
        const y = birthDate.getFullYear();
        setExactBirthYear(y);
        const today = new Date();
        let calculatedAge = today.getFullYear() - y;
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        const detectedCohort = calculateGenerationFromBirthYear(y);
        if (calculatedAge >= 9 && calculatedAge <= 105) {
          setFormData((prev) => ({
            ...prev,
            age: calculatedAge,
            birthYear: y,
            generation: detectedCohort
          }));
          setError('');
        } else {
          setFormData((prev) => ({ ...prev, birthYear: y, generation: detectedCohort }));
        }
      }
    }
  }

  function handleExactBirthYearChange(year: number | null) {
    setExactBirthYear(year);
    if (year && year >= 1920 && year <= new Date().getFullYear()) {
      const calculatedAge = new Date().getFullYear() - year;
      const detectedCohort = calculateGenerationFromBirthYear(year);
      if (calculatedAge >= 9 && calculatedAge <= 105) {
        setFormData((prev) => ({
          ...prev,
          age: calculatedAge,
          birthYear: year,
          generation: detectedCohort
        }));
        setError('');
      } else {
        setFormData((prev) => ({ ...prev, birthYear: year, generation: detectedCohort }));
      }
    }
  }

  function handleNext() {
    setError('');
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2) {
      if (!validateStep2()) return;
      const currentYear = new Date().getFullYear();
      const effectiveBirthYear = (formData.age && formData.age > 0)
        ? (currentYear - formData.age)
        : (exactBirthYear || (currentYear - 24));
      const detectedGen = calculateGenerationFromBirthYear(effectiveBirthYear);
      setFormData((prev) => ({
        ...prev,
        generation: detectedGen,
        birthYear: effectiveBirthYear,
        dateOfBirth: exactDOB || undefined
      }));
      setCurrentStep(3);
      return;
    }
    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }
    if (currentStep === 5 && !validateStep5()) return;
    if (currentStep === 7 && !validateStep7()) return;
    if (currentStep === 8) {
      if (!validateStep8()) return;
      onComplete(formData);
      return;
    }

    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  }

  function handleBack() {
    setError('');
    if (currentStep === 1) {
      onCancel();
      return;
    }
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }

  // Intercept system and gesture back during onboarding
  useBackHandler(
    'onboarding_step_back',
    60,
    () => {
      handleBack();
      return true;
    },
    currentStep !== 3
  );

  // Full-screen animated Generation Detection on Step 3
  if (currentStep === 3) {
    const currentYear = new Date().getFullYear();
    const effectiveBirthYear = (formData.age && formData.age > 0)
      ? (currentYear - formData.age)
      : (exactBirthYear || (currentYear - 24));
    const activeGen = formData.generation || calculateGenerationFromBirthYear(effectiveBirthYear);

    return (
      <GenerationRevealScreen
        preferredName={formData.preferredName || 'Friend'}
        age={formData.age || 24}
        birthYear={effectiveBirthYear}
        generation={activeGen}
        onContinue={() => {
          setCurrentStep(4);
        }}
        onChangeGeneration={(newGen) => {
          setFormData((prev) => ({ ...prev, generation: newGen }));
        }}
        onBack={() => {
          setCurrentStep(2);
        }}
      />
    );
  }

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-warm-textDark flex flex-col font-sans select-none">
      {/* Top Header & Progress Indicator */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark transition flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Step Pill */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F8EBDC] border border-[#E8D5C4] flex items-center justify-center p-0.5 shadow-2xs">
              <img src="/logo_transparent.png" alt="HerLife Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-bold font-serif text-brand-700">HerLife</span>
            <span className="text-[11px] font-bold text-warm-textMuted bg-warm-cardMuted px-2.5 py-0.5 rounded-full border border-warm-border">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-medium text-warm-textMuted hover:text-brand-600 transition"
          >
            Exit
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1 bg-rose-100/70">
          <div 
            className="h-full bg-gradient-to-r from-brand-600 via-rose-500 to-plum-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Form Step Container */}
      <main className="flex-1 flex flex-col justify-between max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6 pb-6">
          {/* STEP 1: Name & Language */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  Step 1 • Identity & Language
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                  Welcome to HerLife
                </h2>
                <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                  Tell us your preferred name and choose the language you feel most comfortable using with Saheli.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-warm-textDark">Preferred Name</label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Priya, Maya, Ananya..."
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-warm-border focus:border-brand-400 focus:ring-2 focus:ring-brand-200 text-sm font-medium transition shadow-2xs"
                />
              </div>

              {/* Language Selection Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-warm-textDark flex items-center justify-between">
                  <span>Preferred Language & Voice (14 Indian Languages)</span>
                  <span className="text-[11px] text-brand-600 font-bold">
                    {INDIAN_LANGUAGES.find(l => l.code === formData.preferredLanguage)?.nativeName}
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1 border border-warm-border/60 rounded-2xl bg-white/70">
                  {INDIAN_LANGUAGES.map((lang) => {
                    const isSelected = formData.preferredLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredLanguage: lang.code })}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-500 shadow-2xs'
                            : 'bg-white hover:bg-rose-50 text-warm-textDark border-warm-border/80'
                        }`}
                      >
                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-warm-textDark'}`}>
                          {lang.nativeName}
                        </span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-100' : 'text-warm-textMuted'}`}>
                          {lang.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-center gap-2.5 text-xs text-rose-800">
                <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                <span>You can always update your name, language, or voice dialect anytime from Settings.</span>
              </div>
            </div>
          )}

          {/* STEP 2: Age & Automatic Generation Estimation */}
          {currentStep === 2 && (() => {
            const currentYear = new Date().getFullYear();
            const hasAge = typeof formData.age === 'number' && formData.age > 0;
            const approxBirthYear = hasAge
              ? (currentYear - formData.age)
              : (exactBirthYear || (currentYear - 24));
            const previewCohort = calculateGenerationFromBirthYear(approxBirthYear);
            const cohortInfo = GENERATIONS_DATA[previewCohort] || GENERATIONS_DATA['gen_z'];

            return (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    Step 2 • Age & Generation
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                    How old are you, {formData.preferredName || 'friend'}?
                  </h2>
                  <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                    Your age allows HerLife to personalize clinical guidelines across your lifespan. We will automatically detect your generation cohort.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-warm-textDark">Age in completed years</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="number"
                        min={9}
                        max={105}
                        value={formData.age || ''}
                        placeholder="24"
                        onChange={(e) => handleAgeChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                        className="w-28 sm:w-32 px-4 py-3.5 rounded-2xl bg-white border-2 border-brand-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 text-xl font-black text-center text-warm-textDark transition shadow-2xs"
                        autoFocus
                      />
                      <span className="text-sm font-semibold text-warm-textMuted">years old</span>
                    </div>

                    {/* Instant live detection badge right next to the age input */}
                    {hasAge && formData.age >= 9 && formData.age <= 105 && (
                      <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-purple-200 shadow-2xs flex items-center gap-2 animate-fade-in">
                        <LotusBloomIcon className="w-4 h-4 text-brand-600 animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-purple-900">
                          Detected: <strong className="text-brand-700">{cohortInfo.name}</strong> (~{approxBirthYear})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto-detected cohort card */}
                <div className="p-4.5 bg-gradient-to-r from-rose-50/70 via-white to-purple-50/70 rounded-2xl border border-pink-200 shadow-2xs space-y-3 transition-all duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-warm-textMuted font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pink-500" />
                      Estimated Birth Year:
                    </span>
                    <span className="font-extrabold text-brand-700 font-mono text-sm px-2.5 py-0.5 rounded-lg bg-brand-50 border border-brand-200">
                      ~{approxBirthYear}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-warm-textMuted font-medium flex items-center gap-1.5">
                      <LotusBloomIcon className="w-3.5 h-3.5 text-purple-500" />
                      Automatic Generation Detection:
                    </span>
                    <span className="font-bold text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200 shadow-2xs">
                      {cohortInfo.name} ({cohortInfo.years})
                    </span>
                  </div>
                  <div className="p-2.5 bg-white/80 rounded-xl border border-pink-100 text-xs text-warm-textMuted leading-relaxed">
                    <p className="font-semibold text-warm-textDark mb-0.5">{cohortInfo.headline}</p>
                    <p className="text-[11px]">{cohortInfo.description}</p>
                  </div>
                  <p className="text-[11px] text-warm-textMuted leading-relaxed flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>HerLife will automatically celebrate your generation with a full animated reveal upon clicking Continue.</span>
                  </p>

                  {/* Optional exact DOB / Birth Year refinement for accurate boundary classification */}
                  <div className="pt-2 border-t border-pink-100/80">
                    <button
                      type="button"
                      onClick={() => setShowCustomBirthYear(!showCustomBirthYear)}
                      className="text-xs text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1.5 transition"
                    >
                      <Calendar className="w-3.5 h-3.5 text-pink-500" />
                      <span>{showCustomBirthYear ? 'Hide exact birth details' : 'Know your exact birth date or year? (Optional)'}</span>
                    </button>

                    {showCustomBirthYear && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 animate-fade-in">
                        <div>
                          <label className="text-[10px] font-bold text-warm-textMuted block mb-1">Exact Birth Year</label>
                          <input
                            type="number"
                            min={1920}
                            max={currentYear}
                            placeholder="e.g. 2002"
                            value={exactBirthYear || ''}
                            onChange={(e) => handleExactBirthYearChange(parseInt(e.target.value) || null)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-warm-border text-xs font-bold focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-warm-textMuted block mb-1">Date of Birth (Calendar)</label>
                          <input
                            type="date"
                            value={exactDOB}
                            onChange={(e) => handleDOBChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-warm-border text-xs font-medium focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {formData.age && formData.age < 18 ? (
                  <div className="p-4 bg-lavender-50 rounded-2xl border border-lavender-200 text-xs text-lavender-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-plum-700">
                      <ShieldCheck className="w-4 h-4 text-plum-600" /> Youth & Teen Privacy Safeguards
                    </span>
                    <p>
                      Because you are under 18, special teen-protective settings are activated. Your cycle entries stay encrypted on your device and are never shared.
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })()}

          {/* STEP 4: Body Metrics (Optional) — Replaced manual generation selection */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    Step 4 • Body Metrics (Optional)
                  </span>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, weight: null });
                      setCurrentStep(5);
                    }}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 transition"
                  >
                    Skip this step →
                  </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                  Would you like to share your weight?
                </h2>
                <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                  Weight is strictly optional. It is not required to track your period, and HerLife never calculates diagnoses or clinical conditions from weight alone.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 58"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || null })}
                    className="w-36 px-4 py-3 rounded-2xl bg-white border border-warm-border text-base font-bold text-center"
                  />
                  <div className="flex items-center bg-white p-1 rounded-2xl border border-warm-border">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, weightUnit: 'kg' })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        formData.weightUnit === 'kg' ? 'bg-brand-500 text-white shadow-2xs' : 'text-warm-textMuted'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, weightUnit: 'lb' })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        formData.weightUnit === 'lb' ? 'bg-brand-500 text-white shadow-2xs' : 'text-warm-textMuted'
                      }`}
                    >
                      lb
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-warm-textMuted italic">
                  Tip: Hormonal fluctuations often cause 1-2 kg of natural water retention right before your period.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Menstrual Journey */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  Step 5 • Menstrual Journey
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                  Where are you in your menstrual journey?
                </h2>
                <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                  Choose the option that matches your current body state so we can configure your personalized dashboard.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'not_started',
                    badge: 'Pre-Menarche',
                    title: "My periods haven't started yet",
                    desc: "For those preparing for puberty and their very first period."
                  },
                  {
                    id: 'started',
                    badge: 'Menstruating',
                    title: "My periods have started",
                    desc: "You have experienced your first period, whether cycles are regular, irregular, or currently absent."
                  },
                  {
                    id: 'currently_on_period',
                    badge: 'Active Bleeding',
                    title: "I'm currently on my period",
                    desc: "You are bleeding today and want to log cramps, flow, or symptoms."
                  },
                  {
                    id: 'menopausal_transition',
                    badge: 'Perimenopause',
                    title: "My periods have stopped or become irregular during possible transition",
                    desc: "Experiencing cycle length changes, hot flashes, or vasomotor shifts."
                  },
                  {
                    id: 'menopause',
                    badge: 'Post-Menopause',
                    title: "I have reached menopause",
                    desc: "12+ consecutive months without a menstrual period. Focus on longevity."
                  },
                  {
                    id: 'not_sure',
                    badge: 'Flexible',
                    title: "I'm not sure / Prefer not to answer",
                    desc: "Explore all educational and symptom features at your own pace."
                  }
                ].map((j) => {
                  const isSelected = formData.menstrualJourney === j.id;
                  return (
                    <div
                      key={j.id}
                      onClick={() => setFormData({ ...formData, menstrualJourney: j.id as any })}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/70 shadow-soft'
                          : 'border-warm-border hover:border-brand-200 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warm-cardMuted border border-warm-border text-brand-700">
                            {j.badge}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-warm-textDark">{j.title}</h4>
                        </div>
                        <p className="text-[11px] text-warm-textMuted mt-1">{j.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Conditional Follow-Up Questions */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  Step 6 • Tailored Follow-Up
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                  A few quick details for your journey
                </h2>
                <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                  These help us calibrate your initial view. You can skip any question if you don't know the exact answer.
                </p>
              </div>

              {/* BRANCH 1: Periods haven't started yet */}
              {formData.menstrualJourney === 'not_started' && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                    <span className="text-xs font-bold text-rose-800">What to expect before your first period:</span>
                    <ul className="text-xs text-rose-900 space-y-1 list-disc list-inside">
                      <li>Mild breast tenderness and growth spurts are completely natural.</li>
                      <li>Clear or white vaginal discharge often begins 6–12 months before menarche.</li>
                      <li>Having period pads ready in your backpack brings calm confidence.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-warm-border space-y-2">
                    <span className="text-xs font-bold text-warm-textDark">
                      Would you like to unlock the interactive First Period Prep Slide?
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, pubertyEducationInterest: true })}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                          formData.pubertyEducationInterest ? 'bg-brand-500 text-white border-brand-500 shadow-2xs' : 'border-warm-border text-warm-textMuted'
                        }`}
                      >
                        Yes, please! 🌸
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, pubertyEducationInterest: false })}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                          !formData.pubertyEducationInterest ? 'bg-brand-500 text-white border-brand-500 shadow-2xs' : 'border-warm-border text-warm-textMuted'
                        }`}
                      >
                        Not right now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* BRANCH 2: Periods have started */}
              {formData.menstrualJourney === 'started' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-textDark">
                      When was the first day of your last period? (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.lastPeriodDate}
                      onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-warm-border text-xs font-medium"
                    />
                    <span className="text-[11px] text-warm-textMuted">If you don't recall, you can leave this blank.</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-warm-textDark">
                        Typical Cycle Length (Days)
                      </label>
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        ~{formData.usualCycleLength || 28} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={21}
                      max={45}
                      value={formData.usualCycleLength || 28}
                      onChange={(e) => setFormData({ ...formData, usualCycleLength: parseInt(e.target.value) })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-warm-textMuted">
                      <span>21 days</span>
                      <span>28 days (avg)</span>
                      <span>45 days</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-textDark">Are your cycles generally regular?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['regular', 'irregular', 'variable', 'not_sure'].map((reg) => (
                        <button
                          type="button"
                          key={reg}
                          onClick={() => setFormData({ ...formData, cycleRegularity: reg })}
                          className={`p-2.5 rounded-xl border text-xs capitalize font-medium transition ${
                            formData.cycleRegularity === reg
                              ? 'bg-brand-50 border-brand-400 text-brand-800 font-bold'
                              : 'bg-white border-warm-border text-warm-textMuted'
                          }`}
                        >
                          {reg.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bleeding Duration Question */}
                  <div className="space-y-2 pt-2 border-t border-warm-border/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-warm-textDark">
                        How many days does your period usually last?
                      </label>
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {formData.usualBleedingDurationDays || '5'} days
                      </span>
                    </div>
                    <p className="text-[11px] text-warm-textMuted">
                      Aapke periods aam taur par kitne din chalte hain? (Count bleeding/spotting days only).
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1-2', label: '1–2 days', sub: 'Halka / Short' },
                        { id: '3', label: '3 days', sub: 'Moderate short' },
                        { id: '4', label: '4 days', sub: 'Normal' },
                        { id: '5', label: '5 days', sub: 'Most common' },
                        { id: '6', label: '6 days', sub: 'Moderate long' },
                        { id: '7', label: '7 days', sub: 'Full week' },
                        { id: '>7', label: '> 7 days', sub: 'Prolonged' },
                        { id: 'irregular', label: 'Irregular', sub: 'Varies monthly' },
                        { id: 'not_sure', label: 'Not sure', sub: 'Need to track' }
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, usualBleedingDurationDays: opt.id })}
                          className={`p-2 rounded-xl border text-center transition ${
                            formData.usualBleedingDurationDays === opt.id
                              ? 'bg-rose-500 text-white border-rose-500 shadow-2xs font-bold'
                              : 'bg-white hover:bg-rose-50/60 border-warm-border text-warm-textDark'
                          }`}
                        >
                          <div className="text-xs">{opt.label}</div>
                          <div className={`text-[9px] ${formData.usualBleedingDurationDays === opt.id ? 'text-rose-100' : 'text-warm-textMuted'}`}>
                            {opt.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BRANCH 3: Currently on period */}
              {formData.menstrualJourney === 'currently_on_period' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-textDark">Period Start Date</label>
                    <input
                      type="date"
                      value={formData.periodStartDate}
                      onChange={(e) => setFormData({ ...formData, periodStartDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-warm-border text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-textDark">Bleeding Flow Today</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['spotting', 'light', 'medium', 'heavy'].map((flow) => (
                        <button
                          type="button"
                          key={flow}
                          onClick={() => setFormData({ ...formData, flowIntensity: flow as any })}
                          className={`p-2.5 rounded-xl border text-xs capitalize font-medium transition ${
                            formData.flowIntensity === flow
                              ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold'
                              : 'bg-white border-warm-border text-warm-textMuted'
                          }`}
                        >
                          {flow}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-warm-textDark">Cramps / Pelvic Pain Level</label>
                      <span className="text-xs font-bold text-rose-600">
                        {formData.crampsSeverity === 0 ? 'None (0)' :
                         formData.crampsSeverity === 1 ? 'Mild (1)' :
                         formData.crampsSeverity === 2 ? 'Moderate (2)' :
                         formData.crampsSeverity === 3 ? 'Intense (3)' : 'Severe (4)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={4}
                      value={formData.crampsSeverity || 0}
                      onChange={(e) => setFormData({ ...formData, crampsSeverity: parseInt(e.target.value) })}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {/* Bleeding Duration Question for currently bleeding */}
                  <div className="space-y-2 pt-2 border-t border-warm-border/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-warm-textDark">
                        How many days does your period usually last?
                      </label>
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {formData.usualBleedingDurationDays || '5'} days
                      </span>
                    </div>
                    <p className="text-[11px] text-warm-textMuted">
                      Aapke periods aam taur par kitne din chalte hain?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1-2', label: '1–2 days', sub: 'Halka / Short' },
                        { id: '3', label: '3 days', sub: 'Moderate short' },
                        { id: '4', label: '4 days', sub: 'Normal' },
                        { id: '5', label: '5 days', sub: 'Most common' },
                        { id: '6', label: '6 days', sub: 'Moderate long' },
                        { id: '7', label: '7 days', sub: 'Full week' },
                        { id: '>7', label: '> 7 days', sub: 'Prolonged' },
                        { id: 'irregular', label: 'Irregular', sub: 'Varies monthly' },
                        { id: 'not_sure', label: 'Not sure', sub: 'Need to track' }
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, usualBleedingDurationDays: opt.id })}
                          className={`p-2 rounded-xl border text-center transition ${
                            formData.usualBleedingDurationDays === opt.id
                              ? 'bg-rose-500 text-white border-rose-500 shadow-2xs font-bold'
                              : 'bg-white hover:bg-rose-50/60 border-warm-border text-warm-textDark'
                          }`}
                        >
                          <div className="text-xs">{opt.label}</div>
                          <div className={`text-[9px] ${formData.usualBleedingDurationDays === opt.id ? 'text-rose-100' : 'text-warm-textMuted'}`}>
                            {opt.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BRANCH 4 & 5: Menopause & Flexible */}
              {(formData.menstrualJourney === 'menopausal_transition' || 
                formData.menstrualJourney === 'menopause' || 
                formData.menstrualJourney === 'not_sure') && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-textDark">
                      Approximate timing of cycle changes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['< 6 months', '1-2 years', '3+ years', 'Not sure'].map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setFormData({ ...formData, menopauseTiming: time })}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                            formData.menopauseTiming === time
                              ? 'bg-plum-50 border-plum-400 text-plum-900 font-bold'
                              : 'bg-white border-warm-border text-warm-textMuted'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-textDark">
                      Select symptoms you'd like to monitor
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Hot flashes', 'Night sweats', 'Sleep disruption', 'Mood shifts', 'Joint stiffness', 'Fatigue'].map((sym) => {
                        const isChecked = formData.menopauseSymptoms.includes(sym);
                        return (
                          <button
                            type="button"
                            key={sym}
                            onClick={() => {
                              const updated = isChecked
                                ? formData.menopauseSymptoms.filter(s => s !== sym)
                                : [...formData.menopauseSymptoms, sym];
                              setFormData({ ...formData, menopauseSymptoms: updated });
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                              isChecked
                                ? 'bg-plum-600 text-white border-plum-600 shadow-2xs'
                                : 'bg-white text-warm-textMuted border-warm-border'
                            }`}
                          >
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                    <strong>Supportive Note:</strong> Menopause is a natural biological progression. HerLife provides lifestyle tracking and educational resources without clinical labeling.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Personalization Preferences */}
          {currentStep === 7 && (() => {
            const ALL_GOALS = [
              "Understanding my first period",
              "Tracking my menstrual cycle",
              "Understanding cramps and other symptoms",
              "Exploring sleep, stress, and lifestyle patterns",
              "Learning about PCOS-related symptoms",
              "Understanding perimenopause and menopause",
              "Keeping a personal health history",
              "Preparing a health summary for a doctor"
            ];
            const allSelected = ALL_GOALS.every(g => formData.goals.includes(g));

            function toggleSelectAll() {
              if (allSelected) {
                setFormData({ ...formData, goals: [] });
              } else {
                setFormData({ ...formData, goals: [...ALL_GOALS] });
              }
            }

            return (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    Step 7 • Personalization
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                    What would you like HerLife to help you with?
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                    <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                      Select all topics that resonate with your current wellness goals. (Selecting a topic does not imply a medical condition).
                    </p>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="self-start sm:self-auto text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 active:scale-95 shadow-2xs"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{allSelected ? 'Deselect All' : 'Select All Topics'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option Card: Select All */}
                  <div
                    onClick={toggleSelectAll}
                    className={`col-span-1 sm:col-span-2 p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-2.5 active:scale-98 ${
                      allSelected
                        ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                        : 'border-brand-300 hover:border-brand-400 bg-brand-50/60 text-brand-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className={`w-4 h-4 ${allSelected ? 'text-amber-200 fill-white' : 'text-brand-600'}`} />
                      <span className="text-xs font-bold">
                        {allSelected ? '✓ All 8 Topics Selected' : 'Select All Topics (All 8 Wellness Goals)'}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      allSelected ? 'bg-white border-white text-brand-600' : 'border-brand-400 bg-white'
                    }`}>
                      {allSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  {ALL_GOALS.map((goal) => {
                    const isChecked = formData.goals.includes(goal);
                    return (
                      <div
                        key={goal}
                        onClick={() => {
                          const updated = isChecked
                            ? formData.goals.filter(g => g !== goal)
                            : [...formData.goals, goal];
                          setFormData({ ...formData, goals: updated });
                        }}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-2.5 active:scale-98 ${
                          isChecked
                            ? 'border-brand-500 bg-brand-50/70 shadow-2xs'
                            : 'border-warm-border hover:border-brand-200 bg-white'
                        }`}
                      >
                        <span className="text-xs font-semibold text-warm-textDark">{goal}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-300'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* STEP 8: Review and Consent */}
          {currentStep === 8 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Step 8 • Review & Consent
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-textDark">
                  Confirm your profile & privacy choices
                </h2>
                <p className="text-xs sm:text-sm text-warm-textMuted leading-relaxed">
                  Review your answers and select your granular permissions. You can adjust these anytime.
                </p>
              </div>

              {/* Answers Summary Card */}
              <div className="p-4 bg-white rounded-2xl border border-warm-border shadow-soft space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-warm-border/60">
                  <span className="font-bold text-warm-textDark uppercase tracking-wider text-[11px]">Your Summary</span>
                  <button onClick={() => setCurrentStep(1)} className="text-brand-600 hover:underline flex items-center gap-1 font-semibold">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-warm-textDark">
                  <div>
                    <span className="text-warm-textMuted block text-[10px]">Name</span>
                    <span className="font-semibold">{formData.preferredName}</span>
                  </div>
                  <div>
                    <span className="text-warm-textMuted block text-[10px]">Age & Cohort</span>
                    <span className="font-semibold">{formData.age} yrs • {formData.generation.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-warm-textMuted block text-[10px]">Menstrual State</span>
                    <span className="font-semibold capitalize">{formData.menstrualJourney.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-warm-textMuted block text-[10px]">Primary Goals</span>
                    <span className="font-semibold">{formData.goals.length} selected</span>
                  </div>
                </div>
              </div>

              {/* Granular Consent Checkboxes */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-warm-textDark block">Informed Consent & Privacy Preferences</span>

                {/* Consent 1: Local Storage */}
                <label className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-warm-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentStorage}
                    onChange={(e) => setFormData({ ...formData, consentStorage: e.target.checked })}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-400 w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-warm-textDark block">Essential Health Data Processing (Required)</span>
                    <p className="text-warm-textMuted mt-0.5 leading-snug">
                      Allow HerLife to process your entered cycle dates, cramps, and symptoms securely on this device to provide tracking functions.
                    </p>
                  </div>
                </label>

                {/* Consent 2: AI Pattern Intelligence */}
                <label className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-warm-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentAI}
                    onChange={(e) => setFormData({ ...formData, consentAI: e.target.checked })}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-400 w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-warm-textDark block">AI-Assisted Pattern Insights (Optional)</span>
                    <p className="text-warm-textMuted mt-0.5 leading-snug">
                      Enable non-diagnostic pattern analysis that calculates cycle length trends and lifestyle correlations.
                    </p>
                  </div>
                </label>

                {/* Consent 3: Pre-Notifications */}
                <label className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-warm-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentNotifications}
                    onChange={(e) => setFormData({ ...formData, consentNotifications: e.target.checked })}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-400 w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-warm-textDark block">Advance Period Pre-Notifications (Optional)</span>
                    <p className="text-warm-textMuted mt-0.5 leading-snug">
                      Receive gentle, discrete alerts 2 days before your expected period so you can prepare comfortably.
                    </p>
                  </div>
                </label>
              </div>

              {/* Data Minimization Pledge */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Zero advertising brokers. You can export or delete your profile anytime from Settings.</span>
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-warm-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-warm-cardMuted text-warm-textDark font-bold text-xs border border-warm-border shadow-2xs transition"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs shadow-soft transition transform hover:scale-105 flex items-center gap-2"
          >
            <span>{currentStep === totalSteps ? 'Complete & Enter HerLife' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
