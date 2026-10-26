import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Flame, 
  Dumbbell, 
  Flower2, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Smile, 
  HelpCircle,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { 
  FitnessProfile, 
  FitnessGoal, 
  WorkoutPreference, 
  FitnessLevel, 
  EquipmentType 
} from '../../data/herMoveCatalog';
import { LotusBloomIcon } from '../common/LotusBloomIcon';

interface FitnessSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: FitnessProfile;
  userAge: number;
  userName: string;
  onSaveProfile: (profile: FitnessProfile) => void;
}

export const FitnessSetupModal: React.FC<FitnessSetupModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  userAge,
  userName,
  onSaveProfile
}) => {
  const [goal, setGoal] = useState<FitnessGoal>(currentProfile.goal || 'general');
  const [preference, setPreference] = useState<WorkoutPreference>(currentProfile.preference || 'home');
  const [level, setLevel] = useState<FitnessLevel>(currentProfile.level || 'beginner');
  const [availableMinutes, setAvailableMinutes] = useState<number>(currentProfile.availableMinutes || 15);
  const [equipment, setEquipment] = useState<EquipmentType[]>(currentProfile.equipment || ['none']);
  const [mobilityConsiderations, setMobilityConsiderations] = useState<string[]>(
    currentProfile.mobilityConsiderations || []
  );

  if (!isOpen) return null;

  function toggleEquipment(eq: EquipmentType) {
    if (eq === 'none') {
      setEquipment(['none']);
      return;
    }
    const filtered = equipment.filter((e) => e !== 'none');
    if (filtered.includes(eq)) {
      const next = filtered.filter((e) => e !== eq);
      setEquipment(next.length === 0 ? ['none'] : next);
    } else {
      setEquipment([...filtered, eq]);
    }
  }

  function toggleMobility(key: string) {
    if (mobilityConsiderations.includes(key)) {
      setMobilityConsiderations(mobilityConsiderations.filter((k) => k !== key));
    } else {
      setMobilityConsiderations([...mobilityConsiderations, key]);
    }
  }

  function handleSave() {
    onSaveProfile({
      goal,
      preference,
      level,
      availableMinutes,
      equipment,
      mobilityConsiderations,
      dailyStepTarget: currentProfile.dailyStepTarget || 6000,
      setupCompleted: true
    });
    onClose();
  }

  const GOALS_OPTIONS: { id: FitnessGoal; label: string; desc: string; icon: string }[] = [
    { id: 'general', label: 'General Fitness & Energy', desc: 'Balanced vitality, daily stamina & moving with ease', icon: '✨' },
    { id: 'flexibility', label: 'Flexibility & Joint Ease', desc: 'Lengthen tight muscles, hip opening & joint range', icon: '🌸' },
    { id: 'strength', label: 'Strength & Toning', desc: 'Bone density, muscle tone & functional everyday power', icon: '💪' },
    { id: 'stamina', label: 'Cardio Stamina & Heart Health', desc: 'Elevate natural energy curves and endurance', icon: '🔥' },
    { id: 'posture', label: 'Posture & Spine Alignment', desc: 'Counteract desk slouching, relieve neck & back tension', icon: '🧘‍♀️' },
    { id: 'stress_relief', label: 'Stress Relief & Relaxation', desc: 'Downregulate cortisol through mindful restorative flow', icon: '🌿' },
    { id: 'active_lifestyle', label: 'Maintain Active Lifestyle', desc: 'Gentle, joyful movement habits without burnout', icon: '🌷' }
  ];

  const PREFERENCE_OPTIONS: { id: WorkoutPreference; label: string; desc: string }[] = [
    { id: 'home', label: 'Home Workout', desc: 'Living room or bedroom with minimal space' },
    { id: 'gym', label: 'Gym Workout', desc: 'Equipment, machines & free weights' },
    { id: 'yoga', label: 'Yoga & Flow', desc: 'Breathwork, mats & meditative stretches' },
    { id: 'pilates', label: 'Pilates & Core', desc: 'Low-impact core control & stability' },
    { id: 'walking', label: 'Walking & Steps', desc: 'Low-impact outdoor or indoor steps' },
    { id: 'low_impact', label: 'Low-Impact Exercise', desc: 'Zero jumping, gentle on knees and pelvis' }
  ];

  const MOBILITY_OPTIONS = [
    { id: 'knee_sensitive', label: 'Knee Sensitivity / Avoid deep squats' },
    { id: 'lower_back', label: 'Lower Back Sensitivity / Avoid heavy hinging' },
    { id: 'wrist_pain', label: 'Wrist Sensitivity / Avoid floor planks' },
    { id: 'no_jumping', label: 'Zero Floor Jumping / Pelvic Floor Friendly' },
    { id: 'shoulder_pain', label: 'Shoulder Tightness / Avoid heavy overheads' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-warm-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-warm-border flex items-center justify-between bg-gradient-to-r from-rose-50/80 via-white to-purple-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 text-white flex items-center justify-center shadow-xs">
              <LotusBloomIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg text-warm-textDark">
                Personalized Fitness Setup
              </h3>
              <p className="text-[11px] text-warm-textMuted">
                HER MOVE • Tailored for {userName} ({userAge} yrs)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* 1. Primary Fitness Goal */}
          <div className="space-y-2.5">
            <label className="font-bold text-warm-textDark uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>1. Your Primary Fitness Goal</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GOALS_OPTIONS.map((opt) => {
                const isSelected = goal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition flex items-start gap-2.5 active:scale-98 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-2 ring-brand-100'
                        : 'border-warm-border bg-white hover:border-pink-200 hover:bg-rose-50/30'
                    }`}
                  >
                    <span className="text-base shrink-0">{opt.icon}</span>
                    <div className="flex-1">
                      <span className={`font-bold block ${isSelected ? 'text-brand-800' : 'text-warm-textDark'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-warm-textMuted leading-tight block mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Workout Style Preference */}
          <div className="space-y-2.5">
            <label className="font-bold text-warm-textDark uppercase tracking-wider text-[11px]">
              2. Workout Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PREFERENCE_OPTIONS.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreference(opt.id)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold shadow-xs'
                        : 'border-warm-border bg-white text-warm-textDark hover:bg-rose-50/30 font-medium'
                    }`}
                  >
                    <span className="block text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Fitness Experience Level */}
          <div className="space-y-2.5">
            <label className="font-bold text-warm-textDark uppercase tracking-wider text-[11px]">
              3. Current Fitness Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((lvl) => {
                const isSelected = level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2.5 px-3 rounded-xl border capitalize text-center transition ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold shadow-xs'
                        : 'border-warm-border bg-white text-warm-textDark hover:bg-rose-50/30'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Available Time */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-warm-textDark uppercase tracking-wider text-[11px]">
                4. Available Time Per Session
              </label>
              <span className="font-bold text-brand-700">{availableMinutes} Minutes</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[5, 10, 15, 20, 30, 45].map((mins) => {
                const isSelected = availableMinutes === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setAvailableMinutes(mins)}
                    className={`py-2 rounded-xl border text-center text-xs transition ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold shadow-xs'
                        : 'border-warm-border bg-white text-warm-textMuted hover:text-warm-textDark'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Available Equipment */}
          <div className="space-y-2.5">
            <label className="font-bold text-warm-textDark uppercase tracking-wider text-[11px]">
              5. Equipment You Have Available
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'None (Bodyweight)' },
                { id: 'bands', label: 'Resistance Bands' },
                { id: 'dumbbells', label: 'Dumbbells / Weights' },
                { id: 'gym_equipment', label: 'Full Gym Equipment' }
              ].map((eq) => {
                const isSelected = equipment.includes(eq.id as EquipmentType);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id as EquipmentType)}
                    className={`p-2.5 rounded-xl border text-center text-xs transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold'
                        : 'border-warm-border bg-white text-warm-textMuted'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    <span>{eq.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Optional Health & Mobility Considerations */}
          <div className="space-y-2.5 p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>Optional Health & Mobility Considerations (Voluntary)</span>
            </div>
            <p className="text-[11px] text-warm-textMuted leading-relaxed">
              Select any areas you want us to protect. We will automatically exclude high-stress exercises and suggest joint-friendly alternatives.
            </p>
            <div className="space-y-1.5 pt-1">
              {MOBILITY_OPTIONS.map((item) => {
                const isChecked = mobilityConsiderations.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleMobility(item.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition select-none text-xs ${
                      isChecked ? 'bg-white border border-rose-300 font-semibold text-rose-950 shadow-2xs' : 'text-warm-textDark hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-rose-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Save */}
        <div className="p-4 border-t border-warm-border bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-warm-border text-warm-textMuted hover:text-warm-textDark text-xs font-bold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 text-center"
          >
            Save & Update Recommendations
          </button>
        </div>

      </div>
    </div>
  );
};
