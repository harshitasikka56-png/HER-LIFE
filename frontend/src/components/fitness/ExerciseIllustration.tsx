import React from 'react';

interface ExerciseIllustrationProps {
  type: 'squat' | 'pushup' | 'catcow' | 'glutebridge' | 'stretching' | 'cardio' | 'lunge' | 'core' | 'arms';
  className?: string;
  isAnimated?: boolean;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  type,
  className = 'w-full h-44',
  isAnimated = true
}) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-purple-50/70 border border-pink-100/80 p-3 ${className}`}>
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-36 h-36 rounded-full border border-pink-200/60 animate-pulse" />
        <div className="w-48 h-48 rounded-full border border-rose-200/40 absolute" />
      </div>

      {type === 'squat' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Floor Guide Line */}
          <line x1="20" y1="140" x2="180" y2="140" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
          
          {/* Movement Trajectory Arrow */}
          <path d="M150 45 Q 165 80 150 115" stroke="#C026D3" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.6" />
          <polygon points="148,118 153,110 144,112" fill="#C026D3" opacity="0.8" />

          {/* Squatting Human Figure */}
          {/* Head */}
          <circle cx="100" cy="35" r="12" fill="#E11D48" className={isAnimated ? 'animate-bounce' : ''} style={{ animationDuration: '3s' }} />
          {/* Torso */}
          <path d="M100 47 L95 85" stroke="#BE123C" strokeWidth="9" strokeLinecap="round" />
          {/* Thigh (bent) */}
          <path d="M95 85 L125 95" stroke="#BE123C" strokeWidth="8" strokeLinecap="round" />
          {/* Shin */}
          <path d="M125 95 L118 138" stroke="#9F1239" strokeWidth="7" strokeLinecap="round" />
          {/* Foot */}
          <path d="M118 138 L135 138" stroke="#881337" strokeWidth="6" strokeLinecap="round" />
          
          {/* Front Leg */}
          <path d="M95 85 L72 96" stroke="#FB7185" strokeWidth="7" strokeLinecap="round" />
          <path d="M72 96 L78 138" stroke="#E11D48" strokeWidth="6" strokeLinecap="round" />
          <path d="M78 138 L62 138" stroke="#BE123C" strokeWidth="5" strokeLinecap="round" />

          {/* Arms Reaching Forward for Balance */}
          <path d="M98 52 L60 62 L42 66" stroke="#FDA4AF" strokeWidth="5" strokeLinecap="round" />
          
          {/* Knee Alignment Cue Badge */}
          <g transform="translate(130, 80)">
            <rect width="52" height="18" rx="9" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="1" opacity="0.9" />
            <text x="26" y="12" textAnchor="middle" fill="#E11D48" fontSize="8" fontWeight="bold">90° Knee</text>
          </g>
        </svg>
      )}

      {type === 'catcow' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Mat */}
          <rect x="25" y="135" width="150" height="6" rx="3" fill="#FBCFE8" />

          {/* Arching Spine Guideline */}
          <path d="M60 85 Q 100 55 140 85" stroke="#9333EA" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.5" />

          {/* Hands & Arms */}
          <path d="M60 85 L60 135" stroke="#9F1239" strokeWidth="6" strokeLinecap="round" />
          {/* Knees & Thighs */}
          <path d="M140 85 L140 135" stroke="#9F1239" strokeWidth="7" strokeLinecap="round" />

          {/* Arched Spine (Cat-Cow) */}
          <path d="M60 85 Q 100 65 140 85" stroke="#E11D48" strokeWidth="9" strokeLinecap="round" />

          {/* Head & Neck */}
          <circle cx="45" cy="95" r="11" fill="#BE123C" />
          
          {/* Pelvis Soft Glow */}
          <circle cx="140" cy="85" r="8" fill="#F43F5E" opacity="0.4" />

          {/* Gentle Breath Indicator */}
          <g transform="translate(25, 40)">
            <rect width="68" height="20" rx="10" fill="#FFFFFF" stroke="#C084FC" strokeWidth="1" opacity="0.9" />
            <text x="34" y="14" textAnchor="middle" fill="#7E22CE" fontSize="9" fontWeight="bold">Inhale • Exhale</text>
          </g>
        </svg>
      )}

      {type === 'pushup' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Wall / Floor Incline */}
          <line x1="30" y1="20" x2="30" y2="140" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          
          {/* Hand on Wall */}
          <circle cx="30" cy="70" r="5" fill="#E11D48" />

          {/* Human Body Straight Diagonal Line */}
          <circle cx="155" cy="40" r="11" fill="#E11D48" />
          {/* Torso & Legs in 1 Straight Plank Line */}
          <path d="M145 48 L80 90 L40 120" stroke="#BE123C" strokeWidth="8" strokeLinecap="round" />
          
          {/* Arm Pushing */}
          <path d="M135 55 L85 68 L33 70" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />

          {/* Feet on Ground */}
          <line x1="15" y1="140" x2="185" y2="140" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
          <path d="M40 120 L40 138" stroke="#881337" strokeWidth="5" strokeLinecap="round" />

          {/* Neutral Spine Badge */}
          <g transform="translate(75, 25)">
            <rect width="78" height="18" rx="9" fill="#FFFFFF" stroke="#BE123C" strokeWidth="1" opacity="0.9" />
            <text x="39" y="12" textAnchor="middle" fill="#BE123C" fontSize="8" fontWeight="bold">Straight Spine</text>
          </g>
        </svg>
      )}

      {type === 'glutebridge' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Floor Mat */}
          <rect x="20" y="130" width="160" height="6" rx="3" fill="#FCE7F3" />

          {/* Head & Upper Back on Ground */}
          <circle cx="45" cy="120" r="11" fill="#E11D48" />
          <path d="M48 126 L65 128" stroke="#BE123C" strokeWidth="7" strokeLinecap="round" />

          {/* Elevated Hips (Bridge Angle) */}
          <path d="M65 128 L105 85" stroke="#E11D48" strokeWidth="9" strokeLinecap="round" />
          
          {/* Thigh to Knee */}
          <path d="M105 85 L145 92" stroke="#BE123C" strokeWidth="8" strokeLinecap="round" />
          
          {/* Shin to Foot */}
          <path d="M145 92 L145 130" stroke="#9F1239" strokeWidth="7" strokeLinecap="round" />

          {/* Hands Resting Flat */}
          <path d="M60 128 L100 128" stroke="#FDA4AF" strokeWidth="4" strokeLinecap="round" />

          {/* Upward Squeeze Arrow */}
          <path d="M105 110 L105 92" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" />
          <polygon points="105,86 109,94 101,94" fill="#9333EA" />

          <g transform="translate(75, 55)">
            <rect width="66" height="18" rx="9" fill="#FFFFFF" stroke="#A855F7" strokeWidth="1" opacity="0.9" />
            <text x="33" y="12" textAnchor="middle" fill="#7E22CE" fontSize="8" fontWeight="bold">Squeeze Glutes</text>
          </g>
        </svg>
      )}

      {type === 'stretching' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Soft Pillow / Mat */}
          <ellipse cx="100" cy="135" rx="65" ry="8" fill="#FCE7F3" />

          {/* Resting Head */}
          <circle cx="65" cy="115" r="11" fill="#BE123C" />
          
          {/* Folded Body / Child's Pose Curve */}
          <path d="M70 120 Q 95 90 125 105" stroke="#E11D48" strokeWidth="8" strokeLinecap="round" />
          <path d="M125 105 L140 130" stroke="#9F1239" strokeWidth="7" strokeLinecap="round" />

          {/* Outstretched Arms */}
          <path d="M70 122 L35 130" stroke="#FB7185" strokeWidth="5" strokeLinecap="round" />

          {/* Calming Aura Radiance */}
          <circle cx="100" cy="100" r="28" stroke="#F43F5E" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          
          <g transform="translate(68, 50)">
            <rect width="64" height="18" rx="9" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" opacity="0.9" />
            <text x="32" y="12" textAnchor="middle" fill="#BE185D" fontSize="8" fontWeight="bold">Deep Release</text>
          </g>
        </svg>
      )}

      {type === 'cardio' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Energy Radiance Waves */}
          <path d="M30 40 Q 50 30 70 45" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 2" />
          <path d="M130 40 Q 150 25 170 38" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 2" />

          {/* Head */}
          <circle cx="100" cy="30" r="11" fill="#E11D48" />

          {/* Torso */}
          <path d="M100 41 L100 85" stroke="#BE123C" strokeWidth="8" strokeLinecap="round" />

          {/* High Knee Lift */}
          <path d="M100 85 L75 90 L75 125" stroke="#E11D48" strokeWidth="7" strokeLinecap="round" />
          
          {/* Standing Leg */}
          <path d="M100 85 L118 108 L118 140" stroke="#9F1239" strokeWidth="7" strokeLinecap="round" />

          {/* Dynamic Arms Marching */}
          <path d="M100 48 L72 65 L80 82" stroke="#FB7185" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 48 L128 60 L135 42" stroke="#FB7185" strokeWidth="5" strokeLinecap="round" />

          <g transform="translate(60, 5)">
            <rect width="80" height="18" rx="9" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" opacity="0.9" />
            <text x="40" y="12" textAnchor="middle" fill="#D97706" fontSize="8" fontWeight="bold">Energy Rhythm</text>
          </g>
        </svg>
      )}

      {type === 'lunge' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          <line x1="20" y1="140" x2="180" y2="140" stroke="#E2E8F0" strokeWidth="2" />
          
          {/* Standing Upright */}
          <circle cx="90" cy="35" r="11" fill="#E11D48" />
          <path d="M90 46 L90 88" stroke="#BE123C" strokeWidth="8" strokeLinecap="round" />
          
          {/* Ground Foot */}
          <path d="M90 88 L85 140" stroke="#9F1239" strokeWidth="7" strokeLinecap="round" />

          {/* Side Leg Lifted High */}
          <path d="M90 88 L142 98" stroke="#E11D48" strokeWidth="7" strokeLinecap="round" />
          <path d="M142 98 L152 105" stroke="#881337" strokeWidth="6" strokeLinecap="round" />

          {/* Hands on Hips */}
          <path d="M90 55 L70 70 L85 75" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
          <path d="M90 55 L110 70 L95 75" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />

          <g transform="translate(108, 65)">
            <rect width="66" height="18" rx="9" fill="#FFFFFF" stroke="#E11D48" strokeWidth="1" opacity="0.9" />
            <text x="33" y="12" textAnchor="middle" fill="#BE123C" fontSize="8" fontWeight="bold">Glute Medius</text>
          </g>
        </svg>
      )}

      {type === 'core' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Floor Mat */}
          <rect x="20" y="125" width="160" height="6" rx="3" fill="#FCE7F3" />

          {/* Horizontal Plank Alignment */}
          <circle cx="160" cy="75" r="11" fill="#E11D48" />
          
          {/* Forearm on Ground */}
          <path d="M148 85 L148 125 L165 125" stroke="#9F1239" strokeWidth="6" strokeLinecap="round" />

          {/* Straight Torso to Feet */}
          <path d="M148 85 L70 95 L35 125" stroke="#BE123C" strokeWidth="8" strokeLinecap="round" />

          {/* Core Brace Focus Ring */}
          <circle cx="95" cy="90" r="14" stroke="#9333EA" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />

          <g transform="translate(62, 45)">
            <rect width="76" height="18" rx="9" fill="#FFFFFF" stroke="#9333EA" strokeWidth="1" opacity="0.9" />
            <text x="38" y="12" textAnchor="middle" fill="#7E22CE" fontSize="8" fontWeight="bold">Brace Abdominals</text>
          </g>
        </svg>
      )}

      {type === 'arms' && (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-xs" fill="none">
          {/* Dumbbells or Lat Pulldown Bar */}
          <line x1="40" y1="30" x2="160" y2="30" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

          {/* Head */}
          <circle cx="100" cy="55" r="11" fill="#E11D48" />
          
          {/* Back & Torso */}
          <path d="M100 66 L100 120" stroke="#BE123C" strokeWidth="9" strokeLinecap="round" />

          {/* Arms Pulling Downward */}
          <path d="M60 30 L80 65 L95 68" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />
          <path d="M140 30 L120 65 L105 68" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />

          <g transform="translate(60, 130)">
            <rect width="80" height="18" rx="9" fill="#FFFFFF" stroke="#059669" strokeWidth="1" opacity="0.9" />
            <text x="40" y="12" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="bold">Back & Posture</text>
          </g>
        </svg>
      )}
    </div>
  );
};
