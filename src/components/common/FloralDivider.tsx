import React from 'react';

interface FloralDividerProps {
  className?: string;
  variant?: 'gold' | 'rose';
}

export const FloralDivider: React.FC<FloralDividerProps> = ({ className = '', variant = 'gold' }) => {
  const strokeColor = variant === 'gold' ? '#C6A46A' : '#C99A9A';
  const fillColor = variant === 'gold' ? '#E8DFD2' : '#F4E3E3';

  return (
    <div className={`floral-divider-container ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.25rem 0' }}>
      <svg width="180" height="24" viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Left branch */}
        <path d="M10 12H76" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3"/>
        <path d="M52 12C52 12 58 7 66 9C74 11 76 12 76 12" stroke={strokeColor} strokeWidth="1"/>
        <circle cx="58" cy="8" r="2" fill={fillColor} />
        <circle cx="68" cy="9" r="1.5" fill={strokeColor} />

        {/* Center Diamond & Ring */}
        <circle cx="90" cy="12" r="5" stroke={strokeColor} strokeWidth="1.2" fill="#FAF7F0"/>
        <polygon points="90,8 93,12 90,16 87,12" fill={strokeColor} />

        {/* Right branch */}
        <path d="M104 12C104 12 106 11 114 9C122 7 128 12 128 12" stroke={strokeColor} strokeWidth="1"/>
        <circle cx="112" cy="9" r="1.5" fill={strokeColor} />
        <circle cx="122" cy="8" r="2" fill={fillColor} />
        <path d="M104 12H170" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3"/>
      </svg>
    </div>
  );
};
