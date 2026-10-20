import React from 'react';

interface BotanicalCornersProps {
  color?: string;
  size?: number;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const BotanicalCorner: React.FC<BotanicalCornersProps> = ({
  color = 'rgba(213, 181, 140, 0.45)',
  size = 56,
  position = 'top-left',
}) => {
  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');

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
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Secondary Tendril */}
        <path
          d="M 28 54 Q 45 42 68 46"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Organic Rose Leaves */}
        <path
          d="M 40 32 C 45 22 56 24 54 34 C 48 38 42 36 40 32 Z"
          fill={color}
          fillOpacity="0.35"
          stroke={color}
          strokeWidth="0.8"
        />
        <path
          d="M 22 66 C 18 56 26 50 32 58 C 30 65 24 68 22 66 Z"
          fill={color}
          fillOpacity="0.35"
          stroke={color}
          strokeWidth="0.8"
        />
        <path
          d="M 62 20 C 70 12 79 16 75 24 C 68 26 63 24 62 20 Z"
          fill={color}
          fillOpacity="0.4"
          stroke={color}
          strokeWidth="0.8"
        />
        {/* Little Rosebud */}
        <circle cx="92" cy="7" r="2.5" fill="#C98291" fillOpacity="0.65" />
        <circle cx="68" cy="46" r="2" fill="#D5B58C" fillOpacity="0.75" />
      </svg>
    </div>
  );
};
