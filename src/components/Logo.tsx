import React from 'react';

interface LogoProps {
  className?: string;
  height?: number; // px mein, jaise height={90}
  variant?: 'light' | 'dark'; // purane code ke liye, use nahi hota
}

const LOGO_SRC = '/images/categories/Logo-White.jpeg';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  height,
}) => {
  return (
    <div className="flex items-center select-none">
      <img
        src={LOGO_SRC}
        alt="Medas Medical Suppliers Logo"
        className={`${height ? '' : 'h-14 sm:h-16'} ${className} w-auto max-w-none object-contain`}
        style={height ? { height: `${height}px`, width: 'auto' } : undefined}
      />
    </div>
  );
};