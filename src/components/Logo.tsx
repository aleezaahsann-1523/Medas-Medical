
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-12',
  variant = 'light',
}) => {
  const textColor =
    variant === 'dark' ? 'text-white' : 'text-black';

  const subtitleColor =
    variant === 'dark' ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src="/images/categories/logo.png"
        alt="Medas Medical icon"
        className="h-full w-auto max-h-12 object-contain"
      />

      <div className="flex flex-col justify-center leading-tight">
        <span className={`text-lg font-extrabold ${textColor}`}>
          MEDAS MEDICAL
        </span>
        <span
          className={`text-xs font-bold tracking-[0.2em] ${subtitleColor}`}
        >
          SUPPLIER
        </span>
      </div>
    </div>
  );
};
