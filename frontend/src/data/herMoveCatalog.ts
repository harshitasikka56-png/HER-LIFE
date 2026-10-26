// HER MOVE: Comprehensive Exercise Catalog & Movement Data
// Medically vetted, generation-aware, and tailored for women's lifespan health.

export type WorkoutCategory = 
  | 'all'
  | 'home'
  | 'gym'
  | 'low_impact'
  | 'yoga_flexibility'
  | 'cardio_stamina'
  | 'strength'
  | 'beginner'
  | 'quick_5_10'
  | 'period_comfort'
  | 'mobility_posture';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal = 
  | 'general' 
  | 'flexibility' 
  | 'strength' 
  | 'stamina' 
  | 'posture' 
  | 'stress_relief' 
  | 'active_lifestyle';

export type WorkoutPreference = 
  | 'home' 
  | 'gym' 
  | 'yoga' 
  | 'pilates' 
  | 'walking' 
  | 'low_impact';

export type EquipmentType = 'none' | 'bands' | 'dumbbells' | 'gym_equipment';

export type GenerationCohort = 'gen_alpha' | 'gen_z' | 'millennial' | 'gen_x' | 'boomer' | 'golden';

export interface Exercise {
  id: string;
  name: string;
  tagline: string;
  categories: WorkoutCategory[];
  targetMuscles: string[];
  fitnessBenefit: string;
  isTimed: boolean;
  durationSeconds?: number;
  defaultSets: number;
  defaultReps?: string;
  restSeconds: number;
  levels: FitnessLevel[];
  equipment: EquipmentType[];
  generations: GenerationCohort[];
  instructions: string[];
  beginnerAlternative: string;
  safetyTips: string[];
  avoidIfLimitation?: string[]; // e.g. ['knee_sensitive', 'wrist_pain']
  caloriesEst: number;
  isPeriodComfortSafe: boolean;
  animationType: 'squat' | 'pushup' | 'catcow' | 'glutebridge' | 'stretching' | 'cardio' | 'lunge' | 'core' | 'arms';
}

export interface FitnessProfile {
  goal: FitnessGoal;
  preference: WorkoutPreference;
  level: FitnessLevel;
  availableMinutes: number;
  equipment: EquipmentType[];
  mobilityConsiderations: string[];
  dailyStepTarget: number;
  setupCompleted: boolean;
}

export interface WorkoutHistoryRecord {
  id: string;
  date: string;
  routineName: string;
  totalDurationSeconds: number;
  exercisesCompleted: string[];
  caloriesBurnedEst: number;
  feelingScore: 'energized' | 'rested' | 'good' | 'gentle';
}

export const WORKOUT_CATEGORIES_DATA: { id: WorkoutCategory; label: string; iconName: string; description: string }[] = [
  { id: 'all', label: 'All Exercises', iconName: 'Activity', description: 'Browse complete exercise directory' },
  { id: 'home', label: 'Home Workout', iconName: 'Home', description: 'Zero or minimal equipment routines' },
  { id: 'gym', label: 'Gym Workout', iconName: 'Dumbbell', description: 'Weight stacks, machines & free weights' },
  { id: 'low_impact', label: 'Low-Impact', iconName: 'Feather', description: 'Gentle on joints with zero jumping' },
  { id: 'yoga_flexibility', label: 'Yoga & Flexibility', iconName: 'Flower2', description: 'Stretches, breathwork & joint opening' },
  { id: 'cardio_stamina', label: 'Cardio & Stamina', iconName: 'Flame', description: 'Heart health, endurance & natural energy' },
  { id: 'strength', label: 'Strength Training', iconName: 'Zap', description: 'Muscle tone, bone density & vitality' },
  { id: 'beginner', label: 'Beginner Fitness', iconName: 'Smile', description: 'Approachable, confidence-building movements' },
  { id: 'quick_5_10', label: 'Quick 5–10 Min', iconName: 'Clock', description: 'Bite-sized energizers for busy schedules' },
  { id: 'period_comfort', label: 'Period Comfort', iconName: 'Heart', description: 'Gentle pelvic decompression & relief' },
  { id: 'mobility_posture', label: 'Mobility & Posture', iconName: 'Compass', description: 'Spine alignment, neck & desk fatigue' }
];

export const HER_MOVE_EXERCISES: Exercise[] = [
  // 1. Bodyweight Squats
  {
    id: 'bodyweight_squats',
    name: 'Bodyweight Squats',
    tagline: 'Foundational lower body strength & stability',
    categories: ['home', 'strength', 'beginner', 'low_impact'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Hamstrings'],
    fitnessBenefit: 'Builds functional lower-body strength and strengthens knee support.',
    isTimed: false,
    defaultSets: 2,
    defaultReps: '8–12 reps',
    restSeconds: 45,
    levels: ['beginner', 'intermediate'],
    equipment: ['none'],
    generations: ['gen_z', 'millennial', 'gen_x', 'boomer'],
    instructions: [
      'Stand tall with feet shoulder-width apart, toes pointing slightly outward.',
      'Inhale as you sit back and down into your hips, as if reaching for an invisible chair.',
      'Lower until thighs are parallel to the floor, keeping chest proud and knees tracking in line with toes.',
      'Exhale and press firmly through your mid-foot and heels to return to standing.'
    ],
    beginnerAlternative: 'Chair-Assisted Squats (Sit down to a sturdy chair and stand back up with control).',
    safetyTips: [
      'Avoid letting your knees collapse inward (valgus).',
      'Keep your heels firmly on the ground at all times.',
      'If knee sensitivity occurs, reduce depth to a comfortable 45-degree angle.'
    ],
    avoidIfLimitation: ['knee_sensitive'],
    caloriesEst: 35,
    isPeriodComfortSafe: true,
    animationType: 'squat'
  },

  // 2. Gentle Cat-Cow Spinal Flow
  {
    id: 'cat_cow_flow',
    name: 'Gentle Cat-Cow Flow',
    tagline: 'Decompress spine, pelvis, and relieve menstrual tension',
    categories: ['home', 'yoga_flexibility', 'period_comfort', 'mobility_posture', 'low_impact', 'quick_5_10'],
    targetMuscles: ['Spine', 'Pelvic Floor', 'Abdominals', 'Neck'],
    fitnessBenefit: 'Improves spinal articulation, releases lower back stiffness, and promotes deep diaphragmatic breathing.',
    isTimed: true,
    durationSeconds: 45,
    defaultSets: 2,
    restSeconds: 30,
    levels: ['beginner', 'intermediate', 'advanced'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Begin on all fours on a comfortable mat, wrists under shoulders and knees under hips.',
      'Inhale into Cow: Gently lower your belly toward the floor, soften shoulders away from ears, and gaze softly forward.',
      'Exhale into Cat: Press into palms, round your spine toward the ceiling, tuck your tailbone, and gently let your head drop.',
      'Continue flowing between both shapes in rhythm with your breath.'
    ],
    beginnerAlternative: 'Seated Cat-Cow on a chair with hands resting gently on thighs.',
    safetyTips: [
      'Move slowly and smoothly; do not force end-range spinal arching.',
      'If wrists feel sensitive, make soft fists or rest on forearms.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 15,
    isPeriodComfortSafe: true,
    animationType: 'catcow'
  },

  // 3. Wall Incline Push-Ups
  {
    id: 'wall_incline_pushup',
    name: 'Wall Incline Push-Ups',
    tagline: 'Safe, low-stress upper body tone & chest openness',
    categories: ['home', 'strength', 'beginner', 'low_impact', 'quick_5_10'],
    targetMuscles: ['Pectorals (Chest)', 'Triceps', 'Anterior Shoulders', 'Core'],
    fitnessBenefit: 'Strengthens upper body pushing power with minimal wrist and shoulder strain.',
    isTimed: false,
    defaultSets: 2,
    defaultReps: '10–12 reps',
    restSeconds: 30,
    levels: ['beginner'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Stand facing a sturdy wall about an arm-length away.',
      'Place palms flat on the wall at shoulder height and slightly wider than shoulders.',
      'Keeping body in one straight line from head to heels, slowly bend elbows to bring chest toward the wall.',
      'Push firmly away through your palms to return to starting position.'
    ],
    beginnerAlternative: 'Step closer to the wall to decrease the angle and reduce resistance.',
    safetyTips: [
      'Keep your core engaged so your lower back does not sag.',
      'Elbows should track at roughly 45 degrees, not flared straight out.'
    ],
    avoidIfLimitation: ['wrist_pain'],
    caloriesEst: 25,
    isPeriodComfortSafe: true,
    animationType: 'pushup'
  },

  // 4. Glute Bridge Elevation
  {
    id: 'glute_bridge',
    name: 'Glute Bridge Elevation',
    tagline: 'Pelvic stability, glute activation & lower back support',
    categories: ['home', 'strength', 'low_impact', 'mobility_posture', 'period_comfort'],
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Core', 'Pelvic Floor'],
    fitnessBenefit: 'Reactivates glutes after sitting, supports pelvic alignment, and protects the lower spine.',
    isTimed: false,
    defaultSets: 3,
    defaultReps: '10–15 reps',
    restSeconds: 40,
    levels: ['beginner', 'intermediate'],
    equipment: ['none'],
    generations: ['gen_z', 'millennial', 'gen_x', 'boomer'],
    instructions: [
      'Lie comfortably on your back with knees bent and feet flat on the floor, hip-width apart.',
      'Arms rest by your sides, palms facing down.',
      'Press through your heels and squeeze your glutes to lift your hips until body forms a straight diagonal line from knees to shoulders.',
      'Pause for 1–2 seconds at the top without hyper-extending the lower back, then lower down with control.'
    ],
    beginnerAlternative: 'Keep range of motion smaller (lift hips only halfway).',
    safetyTips: [
      'Do not push into your neck or cervical spine; weight rests across the upper back.',
      'Engage glutes rather than arching your lower back.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 30,
    isPeriodComfortSafe: true,
    animationType: 'glutebridge'
  },

  // 5. Playful Animal Walk & Dance Fun (Gen Alpha & Family)
  {
    id: 'playful_movement_dance',
    name: 'Playful Dance & Animal Walks',
    tagline: 'Joyful, creative movement for energy and flexibility',
    categories: ['home', 'cardio_stamina', 'beginner', 'quick_5_10'],
    targetMuscles: ['Full Body', 'Cardiovascular', 'Coordination', 'Agility'],
    fitnessBenefit: 'Builds balance, body awareness, and cardiovascular health through pure play without adult gym pressure.',
    isTimed: true,
    durationSeconds: 60,
    defaultSets: 2,
    restSeconds: 30,
    levels: ['beginner'],
    equipment: ['none'],
    generations: ['gen_alpha'],
    instructions: [
      'Put on a cheerful upbeat song or rhythm.',
      'Start with 20 seconds of high-stepping flamingo marches or playful bear crawls.',
      'Transition to 20 seconds of light, energetic dance turns and arm reaches.',
      'Finish with 20 seconds of hopping like a joyful frog or dancing freely!'
    ],
    beginnerAlternative: 'Standing joyful arm movements and gentle side-to-side steps.',
    safetyTips: [
      'Ensure a clear room floor with no slippery rugs or tripping hazards.',
      'Always have adult awareness nearby for safe surroundings.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 40,
    isPeriodComfortSafe: true,
    animationType: 'cardio'
  },

  // 6. Child’s Pose with Diaphragmatic Breath
  {
    id: 'childs_pose_relaxation',
    name: "Balasana (Child's Pose)",
    tagline: 'Restorative pelvic floor opening & nervous system calm',
    categories: ['home', 'yoga_flexibility', 'period_comfort', 'low_impact', 'quick_5_10'],
    targetMuscles: ['Hips', 'Lower Back', 'Ankles', 'Lats'],
    fitnessBenefit: 'Downregulates stress hormones, gently stretches lower back and hips, and eases menstrual cramping.',
    isTimed: true,
    durationSeconds: 60,
    defaultSets: 2,
    restSeconds: 20,
    levels: ['beginner', 'intermediate', 'advanced'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Kneel on your mat, bringing big toes to touch and spreading knees wide toward mat edges.',
      'Sit your hips back onto your heels and slowly walk your hands forward on the floor.',
      'Rest your forehead gently onto the mat (or a soft pillow).',
      'Inhale deeply into your lower belly and ribs, feeling back ribs expand. Exhale slowly and soften.'
    ],
    beginnerAlternative: 'Place a folded blanket under knees or a cushion between thighs and calves for extra comfort.',
    safetyTips: [
      'If knees or hips feel tight, keep knees closer together or elevate hips with a pillow.',
      'Breathe slowly and effortlessly; never hold your breath.'
    ],
    avoidIfLimitation: ['knee_sensitive'],
    caloriesEst: 10,
    isPeriodComfortSafe: true,
    animationType: 'stretching'
  },

  // 7. Dumbbell / Water Bottle Goblet Squats
  {
    id: 'dumbbell_goblet_squats',
    name: 'Goblet Squats',
    tagline: 'Loaded lower-body strength & core stability',
    categories: ['home', 'gym', 'strength'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Upper Back'],
    fitnessBenefit: 'Increases leg power, strengthens bone density, and reinforces upright torso mechanics.',
    isTimed: false,
    defaultSets: 3,
    defaultReps: '8–10 reps',
    restSeconds: 60,
    levels: ['intermediate', 'advanced'],
    equipment: ['dumbbells', 'gym_equipment'],
    generations: ['gen_z', 'millennial', 'gen_x'],
    instructions: [
      'Hold a single dumbbell vertically against your chest with both hands under the top bell.',
      'Set feet slightly wider than shoulder-width with toes turned out 15–30 degrees.',
      'Descend by breaking at hips and knees simultaneously, keeping elbows pointing down inside knees.',
      'Drive into the ground to rise back to full standing height, keeping chest elevated.'
    ],
    beginnerAlternative: 'Switch to bodyweight squats or use a light 1–2 kg water bottle.',
    safetyTips: [
      'Do not round your shoulders or let the weight pull your chest forward.',
      'Maintain continuous contact with all four corners of each foot.'
    ],
    avoidIfLimitation: ['knee_sensitive', 'lower_back'],
    caloriesEst: 45,
    isPeriodComfortSafe: false,
    animationType: 'squat'
  },

  // 8. Dumbbell Romanian Deadlifts (RDL)
  {
    id: 'dumbbell_rdl',
    name: 'Dumbbell Romanian Deadlift',
    tagline: 'Hamstring & glute strength with spine protection',
    categories: ['home', 'gym', 'strength'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Lats'],
    fitnessBenefit: 'Strengthens posterior chain, improves hip-hinge mechanics, and enhances posture.',
    isTimed: false,
    defaultSets: 3,
    defaultReps: '8–12 reps',
    restSeconds: 60,
    levels: ['intermediate', 'advanced'],
    equipment: ['dumbbells', 'gym_equipment'],
    generations: ['gen_z', 'millennial', 'gen_x'],
    instructions: [
      'Hold a pair of dumbbells in front of your thighs with an overhand grip, feet hip-width apart.',
      'Slightly soften your knees, pull shoulder blades gently back, and maintain a neutral spine.',
      'Push your hips backward as if touching a wall behind you, sliding dumbbells down along your shins.',
      'Lower until you feel a deep stretch in hamstrings (usually mid-shin), then drive hips forward to stand.'
    ],
    beginnerAlternative: 'Practice hip hinge with hands on hips and no weights against a wall.',
    safetyTips: [
      'Keep weights close to legs throughout the entire movement.',
      'Do not round the lower back; stop before spine loses neutral position.'
    ],
    avoidIfLimitation: ['lower_back'],
    caloriesEst: 40,
    isPeriodComfortSafe: false,
    animationType: 'squat'
  },

  // 9. Lat Pulldown Machine
  {
    id: 'lat_pulldown_machine',
    name: 'Gym Lat Pulldown',
    tagline: 'Back strength, shoulder poise & posture alignment',
    categories: ['gym', 'strength', 'mobility_posture'],
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps', 'Mid Back'],
    fitnessBenefit: 'Balances forward-slumped shoulders from desk sitting and builds balanced upper-body strength.',
    isTimed: false,
    defaultSets: 3,
    defaultReps: '10–12 reps',
    restSeconds: 60,
    levels: ['beginner', 'intermediate', 'advanced'],
    equipment: ['gym_equipment'],
    generations: ['gen_z', 'millennial', 'gen_x', 'boomer'],
    instructions: [
      'Adjust thigh pads so your legs fit snugly underneath with feet flat on the floor.',
      'Grasp the wide bar with an overhand grip slightly wider than your shoulders.',
      'Lean back very slightly (10–15 degrees), engage your core, and pull the bar smoothly toward your upper chest.',
      'Squeeze shoulder blades down and back, then return the bar up with smooth control.'
    ],
    beginnerAlternative: 'Resistance Band Lat Pull-Down or Door Anchor Pulldown at home.',
    safetyTips: [
      'Never pull the bar behind your neck, as this strains the cervical spine.',
      'Avoid swinging your whole body to generate momentum.'
    ],
    avoidIfLimitation: ['shoulder_pain'],
    caloriesEst: 35,
    isPeriodComfortSafe: true,
    animationType: 'arms'
  },

  // 10. Resistance Band Lateral Walks
  {
    id: 'band_lateral_walks',
    name: 'Resistance Band Lateral Walks',
    tagline: 'Glute medius activation & knee alignment support',
    categories: ['home', 'gym', 'strength', 'low_impact', 'mobility_posture'],
    targetMuscles: ['Gluteus Medius', 'Hip Abductors', 'Core'],
    fitnessBenefit: 'Strengthens lateral hip stabilizers, preventing runner knee and improving pelvic balance.',
    isTimed: true,
    durationSeconds: 45,
    defaultSets: 2,
    restSeconds: 30,
    levels: ['beginner', 'intermediate'],
    equipment: ['bands'],
    generations: ['gen_z', 'millennial', 'gen_x', 'boomer'],
    instructions: [
      'Place a loop resistance band just above your knees (or around ankles for more challenge).',
      'Lower into a quarter-squat athletic stance, feet hip-width apart.',
      'Take controlled steps sideways, keeping tension on the band at all times.',
      'Take 10 steps to the right, then 10 steps back to the left.'
    ],
    beginnerAlternative: 'Perform lateral side-steps without any resistance band.',
    safetyTips: [
      'Keep feet parallel; do not turn toes outwards.',
      'Maintain an upright torso and do not let knees cave inward.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 30,
    isPeriodComfortSafe: true,
    animationType: 'lunge'
  },

  // 11. Low-Impact March & Step Jacks
  {
    id: 'low_impact_step_jacks',
    name: 'Low-Impact Step Jacks',
    tagline: 'Cardiovascular heart rate boost without floor jumping',
    categories: ['home', 'cardio_stamina', 'low_impact', 'quick_5_10', 'beginner'],
    targetMuscles: ['Cardiovascular System', 'Shoulders', 'Calves', 'Core'],
    fitnessBenefit: 'Elevates heart rate, stimulates circulation, and preserves pelvic floor health without jarring impacts.',
    isTimed: true,
    durationSeconds: 45,
    defaultSets: 3,
    restSeconds: 30,
    levels: ['beginner', 'intermediate'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer'],
    instructions: [
      'Start standing with feet together and arms resting by your sides.',
      'Step your right foot out to the side while sweeping both arms overhead in a wide arc.',
      'Step your right foot back to center while lowering arms.',
      'Immediately repeat by stepping your left foot out and raising arms overhead, moving in a continuous rhythm.'
    ],
    beginnerAlternative: 'Slow the tempo down and raise arms only to shoulder height.',
    safetyTips: [
      'Keep knees soft and springy; avoid locking knee joints.',
      'Breathe continuously in rhythm with your steps.'
    ],
    avoidIfLimitation: ['no_jumping'],
    caloriesEst: 35,
    isPeriodComfortSafe: true,
    animationType: 'cardio'
  },

  // 12. Dead Bug Core Control
  {
    id: 'dead_bug_core',
    name: 'Dead Bug Core Stabilization',
    tagline: 'Safe, spine-friendly deep transverse abdominal control',
    categories: ['home', 'strength', 'low_impact', 'mobility_posture'],
    targetMuscles: ['Transverse Abdominis', 'Pelvic Floor', 'Hip Flexors'],
    fitnessBenefit: 'Builds true core stability, reduces anterior pelvic tilt, and protects lumbar discs without crunches.',
    isTimed: false,
    defaultSets: 2,
    defaultReps: '8 reps per side',
    restSeconds: 40,
    levels: ['beginner', 'intermediate', 'advanced'],
    equipment: ['none'],
    generations: ['gen_z', 'millennial', 'gen_x'],
    instructions: [
      'Lie flat on your back on a mat, arms reaching straight up toward ceiling.',
      'Lift legs into a tabletop position with hips and knees bent at 90 degrees.',
      'Press your lower back gently flush into the floor (no arching).',
      'Slowly extend right arm overhead and left leg straight toward floor simultaneously.',
      'Return to center and switch to opposite arm and leg.'
    ],
    beginnerAlternative: 'Tap only heel to floor without extending the full leg.',
    safetyTips: [
      'If lower back arches off the mat, do not lower your leg as far.',
      'Exhale as you extend, inhale as you return to center.'
    ],
    avoidIfLimitation: ['lower_back'],
    caloriesEst: 20,
    isPeriodComfortSafe: true,
    animationType: 'core'
  },

  // 13. Standing Side Leg Lifts with Balance Support
  {
    id: 'standing_side_leg_lifts',
    name: 'Standing Side Leg Lifts',
    tagline: 'Balance, hip tone & fall prevention for all ages',
    categories: ['home', 'low_impact', 'beginner', 'mobility_posture'],
    targetMuscles: ['Gluteus Medius', 'Abductors', 'Core Stabilizers'],
    fitnessBenefit: 'Enhances single-leg balance, supports hip joint bone density, and tones outer thighs.',
    isTimed: false,
    defaultSets: 2,
    defaultReps: '10–12 reps per leg',
    restSeconds: 30,
    levels: ['beginner'],
    equipment: ['none'],
    generations: ['gen_x', 'boomer', 'golden', 'millennial'],
    instructions: [
      'Stand tall beside a sturdy chair or wall, placing one hand on it for balance.',
      'Shift your weight onto your inside leg with a soft knee.',
      'Flex outside foot and raise the leg out to the side smoothly without tilting your torso.',
      'Hold for 1 second, then lower with control. Complete all reps, then turn and switch sides.'
    ],
    beginnerAlternative: 'Hold onto the chair with both hands for complete balance reassurance.',
    safetyTips: [
      'Keep your standing knee softly bent, never locked out.',
      'Torso remains upright; avoid leaning to the side to lift the leg higher.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 20,
    isPeriodComfortSafe: true,
    animationType: 'lunge'
  },

  // 14. Supta Baddha Konasana (Reclined Butterfly)
  {
    id: 'reclined_butterfly',
    name: 'Reclined Butterfly (Supta Baddha Konasana)',
    tagline: 'Deep pelvic floor relaxation & menstrual cramp relief',
    categories: ['home', 'yoga_flexibility', 'period_comfort', 'low_impact'],
    targetMuscles: ['Inner Thighs (Adductors)', 'Pelvic Floor', 'Chest', 'Hips'],
    fitnessBenefit: 'Releases chronic pelvic muscle guarding, eases uterine cramp tension, and induces deep parasympathetic relaxation.',
    isTimed: true,
    durationSeconds: 90,
    defaultSets: 1,
    restSeconds: 0,
    levels: ['beginner', 'intermediate', 'advanced'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Lie flat on your back on a cushioned mat or bed.',
      'Bring the soles of your feet together and let your knees gently fall open toward the sides in a diamond shape.',
      'Place one hand on your lower belly and one hand on your heart.',
      'Close your eyes and breathe deep, warm breaths into your pelvic floor, allowing tension to melt away.'
    ],
    beginnerAlternative: 'Place pillows or yoga blocks under outside of both knees for zero-effort support.',
    safetyTips: [
      'Do not force knees to touch the floor; let gravity work effortlessly.',
      'If lower back feels strained, place a pillow under your head and upper spine.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 10,
    isPeriodComfortSafe: true,
    animationType: 'stretching'
  },

  // 15. Seated Spinal Twist & Chest Opener (Desk Break)
  {
    id: 'seated_desk_twist',
    name: 'Seated Spinal Twist & Chest Opener',
    tagline: 'Quick 2-minute posture revival for working & studying',
    categories: ['home', 'mobility_posture', 'quick_5_10', 'low_impact', 'beginner'],
    targetMuscles: ['Thoracic Spine', 'Pectorals', 'Neck', 'Shoulders'],
    fitnessBenefit: 'Counteracts desk slouching, relieves upper back knots, and refreshes blood circulation.',
    isTimed: true,
    durationSeconds: 45,
    defaultSets: 2,
    restSeconds: 15,
    levels: ['beginner'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Sit tall at the edge of your chair with both feet flat on the floor.',
      'Lengthen your spine as if being gently lifted by a string from crown of your head.',
      'Gently place your right hand on the back of your chair and left hand on your right thigh.',
      'Inhale to lengthen, exhale to gently rotate through your ribcage to the right. Hold for 3 breaths, then repeat on opposite side.'
    ],
    beginnerAlternative: 'Rotate gently without using hands to lever or force the twist.',
    safetyTips: [
      'Twist only through the mid and upper back, never yank with lower back.',
      'Keep chin aligned with breastbone to protect neck.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 10,
    isPeriodComfortSafe: true,
    animationType: 'stretching'
  },

  // 16. Leg Press Gym Machine
  {
    id: 'leg_press_machine',
    name: 'Controlled Gym Leg Press',
    tagline: 'Substantial lower-body strength with built-in back support',
    categories: ['gym', 'strength'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    fitnessBenefit: 'Safely builds lower body strength without spinal axial loading.',
    isTimed: false,
    defaultSets: 3,
    defaultReps: '10–12 reps',
    restSeconds: 60,
    levels: ['intermediate', 'advanced'],
    equipment: ['gym_equipment'],
    generations: ['gen_z', 'millennial', 'gen_x'],
    instructions: [
      'Sit comfortably on the machine with back and head firmly against the padded support.',
      'Place feet flat on the sled platform hip-width apart in line with knees.',
      'Disengage the safety levers and slowly lower the weight platform until knees bend at roughly 90 degrees.',
      'Push through your entire foot to return the sled, stopping just before knees lock out completely.'
    ],
    beginnerAlternative: 'Start with very light plate weight or perform bodyweight box squats.',
    safetyTips: [
      'NEVER lock out your knees at the top of the movement.',
      'Keep your lower back and tailbone pressed flush into the seat pad at all times.'
    ],
    avoidIfLimitation: ['knee_sensitive'],
    caloriesEst: 45,
    isPeriodComfortSafe: false,
    animationType: 'squat'
  },

  // 17. Dumbbell Standing Bicep & Hammer Curls
  {
    id: 'bicep_hammer_curls',
    name: 'Standing Dumbbell Curls',
    tagline: 'Functional arm strength for everyday lifting & carrying',
    categories: ['home', 'gym', 'strength'],
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    fitnessBenefit: 'Tones arms and strengthens tendons for carrying groceries, bags, or children comfortably.',
    isTimed: false,
    defaultSets: 3,
    defaultReps: '10–12 reps',
    restSeconds: 45,
    levels: ['beginner', 'intermediate'],
    equipment: ['dumbbells', 'bands'],
    generations: ['gen_z', 'millennial', 'gen_x', 'boomer'],
    instructions: [
      'Stand with feet hip-width apart holding a dumbbell in each hand by your sides.',
      'Keep elbows pinned close to your ribcage with palms facing forward.',
      'Exhale and curl the weights up toward your shoulders, squeezing biceps at the top.',
      'Inhale and lower the weights back down slowly with complete 3-second control.'
    ],
    beginnerAlternative: 'Use lightweight 1 kg dumbbells or resistance loop bands.',
    safetyTips: [
      'Do not swing your hips or arch your lower back to hoist the dumbbells.',
      'Keep wrists straight and strong.'
    ],
    avoidIfLimitation: ['wrist_pain'],
    caloriesEst: 25,
    isPeriodComfortSafe: true,
    animationType: 'arms'
  },

  // 18. Forearm Plank / Knee Plank
  {
    id: 'forearm_plank',
    name: 'Forearm Core Plank',
    tagline: 'Total core endurance & shoulder girdle stability',
    categories: ['home', 'strength', 'low_impact', 'quick_5_10'],
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Serratus Anterior', 'Glutes'],
    fitnessBenefit: 'Strengthens full abdominal wall and stabilizes pelvis for pain-free posture.',
    isTimed: true,
    durationSeconds: 30,
    defaultSets: 2,
    restSeconds: 45,
    levels: ['beginner', 'intermediate', 'advanced'],
    equipment: ['none'],
    generations: ['gen_z', 'millennial', 'gen_x'],
    instructions: [
      'Place forearms on the floor with elbows directly under shoulders, hands parallel.',
      'Extend legs back onto toes, creating a straight line from head to heels.',
      'Tighten glutes, pull belly button inward toward spine, and press floor away with forearms.',
      'Hold position with steady, continuous breathing.'
    ],
    beginnerAlternative: 'Knee Plank (Rest knees on the mat while maintaining a straight line from knees to shoulders).',
    safetyTips: [
      'Do not let hips sag downward or pike high into the air.',
      'Keep neck neutral by gazing at the floor between your hands.'
    ],
    avoidIfLimitation: ['wrist_pain', 'lower_back'],
    caloriesEst: 25,
    isPeriodComfortSafe: false,
    animationType: 'core'
  },

  // 19. Upward Salute & Gentle Standing Forward Fold
  {
    id: 'standing_forward_fold',
    name: 'Upward Salute to Forward Fold',
    tagline: 'Harmonious full-body stretch, circulation & calm',
    categories: ['home', 'yoga_flexibility', 'mobility_posture', 'low_impact', 'quick_5_10'],
    targetMuscles: ['Hamstrings', 'Calves', 'Spine', 'Shoulders'],
    fitnessBenefit: 'Lengthens entire back body, stimulates lymphatic drainage, and refreshes mental focus.',
    isTimed: true,
    durationSeconds: 45,
    defaultSets: 2,
    restSeconds: 20,
    levels: ['beginner', 'intermediate'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Stand tall with feet hip-distance apart and arms by sides.',
      'Inhale deeply as you sweep arms out and up overhead, looking gently up toward thumbs.',
      'Exhale and hinge at hips with soft knees, sweeping arms wide and folding forward over legs.',
      'Let your head and neck hang completely relaxed for 2–3 breaths, then slowly roll back up to standing.'
    ],
    beginnerAlternative: 'Bend knees deeply and rest hands on thighs or shins instead of floor.',
    safetyTips: [
      'Never lock knees; keep a generous bend to protect lower back.',
      'Rise back up slowly to avoid head-rush if prone to low blood pressure.'
    ],
    avoidIfLimitation: ['lower_back'],
    caloriesEst: 15,
    isPeriodComfortSafe: true,
    animationType: 'stretching'
  },

  // 20. Calf Raises on Step / Floor
  {
    id: 'standing_calf_raises',
    name: 'Standing Calf Raises',
    tagline: 'Ankle strength, lower leg pump & circulation boost',
    categories: ['home', 'strength', 'low_impact', 'beginner'],
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Ankle Stabilizers'],
    fitnessBenefit: 'Acts as the peripheral heart pump to improve blood return from legs and reduce fluid retention.',
    isTimed: false,
    defaultSets: 2,
    defaultReps: '15 reps',
    restSeconds: 30,
    levels: ['beginner', 'intermediate'],
    equipment: ['none'],
    generations: ['gen_alpha', 'gen_z', 'millennial', 'gen_x', 'boomer', 'golden'],
    instructions: [
      'Stand tall near a wall or chair, holding gently for light balance.',
      'Feet are hip-width apart, pointing straight forward.',
      'Press through the balls of both feet to lift your heels as high as possible.',
      'Hold at peak height for 1 second, then lower heels slowly back down.'
    ],
    beginnerAlternative: 'Perform seated on a chair with hands resting on knees.',
    safetyTips: [
      'Press evenly across all toes without rolling out onto little toes.',
      'Keep body upright; do not lean forward.'
    ],
    avoidIfLimitation: [],
    caloriesEst: 15,
    isPeriodComfortSafe: true,
    animationType: 'lunge'
  }
];

export const DAILY_LIFESTYLE_HABITS = [
  {
    id: 'desk_movement',
    title: '2-Minute Desk Movement Break',
    tag: 'Mobility & Posture',
    duration: '2 mins',
    desc: 'Roll shoulders, unclench your jaw, and stretch your spine to instantly reset circulation.',
    icon: 'Compass',
    category: 'mobility'
  },
  {
    id: 'gentle_walk',
    title: 'Post-Meal 10-Minute Stroll',
    tag: 'Blood Sugar & Stamina',
    duration: '10 mins',
    desc: 'A gentle walk after lunch or dinner supports smooth digestion and stable energy curves.',
    icon: 'Footprints',
    category: 'walking'
  },
  {
    id: 'hydration_goal',
    title: 'Hydration Check-in (8 Glasses)',
    tag: 'Cellular Vitality',
    duration: 'All Day',
    desc: 'Sip water regularly to keep fascia pliable, reduce cramping intensity, and clear fatigue.',
    icon: 'Droplet',
    category: 'hydration'
  },
  {
    id: 'breathing_rest',
    title: '4-7-8 Rest & Downregulation Breath',
    tag: 'Nervous System Reset',
    duration: '3 mins',
    desc: 'Inhale 4s, hold 7s, exhale 8s. Clinically proven to signal safety to your adrenal glands.',
    icon: 'Moon',
    category: 'rest'
  }
];

// Helper: Smart Plan Generator based on User Profile
export function generateDailyPlan(
  profile: FitnessProfile, 
  userAge: number, 
  isPeriodActive: boolean = false
): {
  planTitle: string;
  planSubtitle: string;
  estimatedMinutes: number;
  exercises: Exercise[];
} {
  // If period is currently active or high cramps reported, prioritize comfort flow
  if (isPeriodActive) {
    const comfortExercises = HER_MOVE_EXERCISES.filter(ex => ex.isPeriodComfortSafe).slice(0, 4);
    return {
      planTitle: 'Gentle Period Comfort & Pelvic Care Flow',
      planSubtitle: 'Restorative, zero-pressure movement to soothe cramps and release lumbar tightness.',
      estimatedMinutes: 12,
      exercises: comfortExercises
    };
  }

  // Filter based on age / generation safety
  let candidateExercises = HER_MOVE_EXERCISES.filter(ex => {
    // Gen Alpha protection
    if (userAge < 15) {
      return ex.generations.includes('gen_alpha');
    }
    // Filter out avoided limitations
    if (profile.mobilityConsiderations && profile.mobilityConsiderations.length > 0) {
      const hasConflict = ex.avoidIfLimitation?.some(lim => profile.mobilityConsiderations.includes(lim));
      if (hasConflict) return false;
    }
    // Equipment match
    if (profile.preference === 'home' && !ex.equipment.includes('none') && !ex.equipment.includes('bands')) {
      return false;
    }
    if (profile.preference === 'gym' && !ex.categories.includes('gym') && !ex.categories.includes('strength')) {
      return true; // allow variety
    }
    return true;
  });

  // Goal-based sorting
  if (profile.goal === 'flexibility' || profile.preference === 'yoga') {
    candidateExercises.sort((a, b) => (b.categories.includes('yoga_flexibility') ? 1 : 0) - (a.categories.includes('yoga_flexibility') ? 1 : 0));
  } else if (profile.goal === 'strength') {
    candidateExercises.sort((a, b) => (b.categories.includes('strength') ? 1 : 0) - (a.categories.includes('strength') ? 1 : 0));
  } else if (profile.goal === 'posture') {
    candidateExercises.sort((a, b) => (b.categories.includes('mobility_posture') ? 1 : 0) - (a.categories.includes('mobility_posture') ? 1 : 0));
  } else if (profile.goal === 'stamina') {
    candidateExercises.sort((a, b) => (b.categories.includes('cardio_stamina') ? 1 : 0) - (a.categories.includes('cardio_stamina') ? 1 : 0));
  }

  // Determine count based on available minutes
  const count = profile.availableMinutes <= 10 ? 3 : profile.availableMinutes <= 20 ? 4 : 5;
  const selected = candidateExercises.slice(0, count);

  // If fallback needed
  if (selected.length < 3) {
    selected.push(...HER_MOVE_EXERCISES.slice(0, 3 - selected.length));
  }

  const titlesByGoal: Record<FitnessGoal, string> = {
    general: 'Daily Vitality & Balanced Movement',
    flexibility: 'Deep Flexibility & Gentle Joint Opening',
    strength: 'Empowered Full-Body Strength & Tone',
    stamina: 'Energizing Cardio & Natural Stamina Boost',
    posture: 'Spine Alignment, Core & Posture Reset',
    stress_relief: 'Calming Stress-Relief & Mindful Flow',
    active_lifestyle: 'Joyful Active Living Routine'
  };

  return {
    planTitle: titlesByGoal[profile.goal] || 'Personalized Movement Plan',
    planSubtitle: `Tailored for ${profile.level.toUpperCase()} level • ${profile.availableMinutes} min session • ${profile.preference.replace('_', ' ').toUpperCase()}`,
    estimatedMinutes: profile.availableMinutes,
    exercises: selected
  };
}
