import React from 'react';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<VerifiedBadgeProps['size']>, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-[18px] h-[18px]',
  lg: 'w-5 h-5'
};

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'sm',
  title = 'Verified Official',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      title={title}
      aria-label={title}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${SIZE_CLASSES[size]} drop-shadow-[0_0_7px_rgba(56,189,248,0.7)]`}
      >
        <defs>
          <linearGradient id="benzto2BlueTick" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path
          d="M12 1.75L14.62 3.38L17.68 3.19L19.04 5.95L21.75 7.4L21.31 10.44L22.75 13.15L20.89 15.61L21.13 18.67L18.35 19.99L16.86 22.68L13.83 22.19L11.1 23.59L8.68 21.7L5.61 21.9L4.33 19.1L1.66 17.59L2.18 14.56L0.81 11.81L2.73 9.41L2.56 6.34L5.37 5.08L6.91 2.43L9.93 2.98L12 1.75Z"
          fill="url(#benzto2BlueTick)"
        />
        <path
          d="M8.75 12.35L10.95 14.55L15.55 9.65"
          stroke="#ffffff"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
