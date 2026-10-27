import React from 'react';

interface BotanicalCornersProps {
  color?: string;
  size?: number;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'champagne' | 'rose' | 'white-orchid';
}

export const BotanicalCorner: React.FC<BotanicalCornersProps> = ({
  color,
  size = 56,
  position = 'top-left',
  variant = 'champagne',
}) => {
  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');

  const strokeColor = color || (variant === 'white-orchid' ? 'rgba(212, 175, 55, 0.75)' : variant === 'rose' ? 'rgba(201, 130, 145, 0.5)' : 'rgba(212, 175, 55, 0.55)');
  const leafColor = variant === 'white-orchid' ? 'rgba(255, 255, 255, 0.8)' : strokeColor;
  const bud1Color = variant === 'white-orchid' ? '#FFFFFF' : '#C98291';
  const bud2Color = variant === 'white-orchid' ? '#D4AF37' : '#D5B58C';

  const transform = `
    scale(${isRight ? -1 : 1}, ${isBottom ? -1 : 1})
  `;

  return (
    <div
      style={{
        position: 'absolute',
        top: isBottom ? 'auto' : '8px',
        bottom: isBottom ? '8px' : 'auto',
        left: isRight ? 'auto' : '8px',
        right: isRight ? '8px' : 'auto',
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        zIndex: 2,
        transform,
      }}
      className="botanical-sway"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden="true"
      >
        {/* Main Arch Branch */}
        <path
          d="M 6 94 Q 10 35 60 14 Q 85 8 94 6"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Secondary Tendril */}
        <path
          d="M 28 54 Q 45 42 68 46"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Organic Rose/Orchid Leaves */}
        <path
          d="M 40 32 C 45 22 56 24 54 34 C 48 38 42 36 40 32 Z"
          fill={leafColor}
          fillOpacity="0.45"
          stroke={strokeColor}
          strokeWidth="0.8"
        />
        <path
          d="M 22 66 C 18 56 26 50 32 58 C 30 65 24 68 22 66 Z"
          fill={leafColor}
          fillOpacity="0.45"
          stroke={strokeColor}
          strokeWidth="0.8"
        />
        <path
          d="M 62 20 C 70 12 79 16 75 24 C 68 26 63 24 62 20 Z"
          fill={leafColor}
          fillOpacity="0.5"
          stroke={strokeColor}
          strokeWidth="0.8"
        />
        {/* Little Flower Buds */}
        <circle cx="92" cy="7" r="2.8" fill={bud1Color} fillOpacity="0.85" />
        <circle cx="68" cy="46" r="2.2" fill={bud2Color} fillOpacity="0.85" />
      </svg>
    </div>
  );
};
