import React from 'react';

interface LotusBloomIconProps {
  className?: string;
  size?: number;
}

/**
 * Handcrafted Premium Lotus Bloom Emblem
 * Replaces generic AI sparkle stars with a signature, organic feminine wellness botanical emblem.
 */
export const LotusBloomIcon: React.FC<LotusBloomIconProps> = ({ 
  className = "w-4 h-4 text-brand-500", 
  size 
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Center lotus core petal */}
      <path d="M12 3C10.5 7 10 9.5 10 13C10 16.5 12 18 12 18C12 18 14 16.5 14 13C14 9.5 13.5 7 12 3Z" fill="currentColor" fillOpacity="0.18" />
      {/* Left blooming petal */}
      <path d="M10 13C8.5 10.5 6 9 3.5 10C3 13 5.5 16 8.5 17C10 17.5 10.8 17.5 10.8 17.5" />
      {/* Right blooming petal */}
      <path d="M14 13C15.5 10.5 18 9 20.5 10C21 13 18.5 16 15.5 17C14 17.5 13.2 17.5 13.2 17.5" />
      {/* Inner graceful accent drops */}
      <path d="M12 18C10 19.5 7 19.8 4 19.5" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M12 18C14 19.5 17 19.8 20 19.5" strokeOpacity="0.6" strokeWidth="1.5" />
      {/* Gentle center dewdrop seed */}
      <circle cx="12" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
};

export default LotusBloomIcon;
