import React from 'react';
import './FAB.css';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label?: string;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`md-fab ${className}`}
      aria-label={label || 'Floating action button'}
      {...props}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};
