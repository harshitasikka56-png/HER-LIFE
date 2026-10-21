export type LifeStage = 'teen_menarche' | 'college_gen_z' | 'reproductive' | 'perimenopause' | 'menopause';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age_years: number;
  life_stage: LifeStage;
  cycle_regularity: string;
  usual_cycle_length: number;
  consent_status: boolean;
  is_demo: boolean;
  created_at: string;
}

export interface CycleRecord {
  id: string;
  user_id: string;
  period_start_date: string;
  period_end_date?: string | null;
  cycle_length_days?: number | null;
  bleeding_duration_days?: number | null;
  flow_level: 'light' | 'medium' | 'heavy' | 'spotting';
  record_source: string;
  created_at: string;
}

export interface DailyLogRecord {
  id: string;
  user_id: string;
  date: string;
  cycle_day?: number | null;
  cycle_phase?: string | null;
  period_day_flag: boolean;
  sleep_hours: number;
  stress_level_0_4: number;
  activity_level_0_4: number;
  mood_score_0_4: number;
  energy_score_0_4: number;
  workload_0_4: number;
  hydration_glasses: number;
  caffeine_cups: number;
  cramps_severity_0_3: number;
  bloating_severity_0_3: number;
  headache_severity_0_3: number;
  fatigue_severity_0_3: number;
  mood_changes_severity_0_3: number;
  hot_flashes_severity_0_3: number;
  sleep_disturbance_severity_0_3: number;
  pelvic_pain_severity_0_3: number;
  basal_temp_c?: number | null;
  cervical_mucus?: string | null;
  notes?: string | null;
  record_source: string;
}

export interface PeriodPrediction {
  applicable: boolean;
  reason?: string;
  current_cycle_day?: number;
  last_period_date?: string;
  predicted_period_date?: string | null;
  predicted_cycle_length?: number;
  confidence: string;
  confidence_level?: number;
  uncertainty_days?: number | null;
  uncertainty_range?: string;
  estimated_ovulation_date?: string | null;
  fertile_window?: {
    start: string;
    end: string;
    disclaimer: string;
  } | null;
  disclaimer: string;
}

export interface SymptomForecast {
  model_used: string;
  forecast_date: string;
  probabilities: Record<string, number>;
  disclaimer: string;
}

export interface DailyGuidance {
  life_stage: LifeStage;
  daily_focus: string;
  do: string[];
  dont: string[];
  when_to_seek_help: string[];
}

export interface PCOSRecord {
  id: string;
  user_id: string;
  date: string;
  acne_severity_0_3: number;
  hirsutism_severity_0_3: number;
  hair_thinning_severity_0_3: number;
  weight_change_notes?: string | null;
  skin_darkening_acanthosis: boolean;
  clinician_confirmed_pcos: boolean;
  clinician_notes?: string | null;
}

export interface CortisolRecord {
  id: string;
  user_id: string;
  test_date: string;
  collection_time: string;
  test_value: number;
  units: string;
  reference_range: string;
  lab_name: string;
  test_type: string;
  notes?: string | null;
  created_at: string;
}
