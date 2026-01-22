import React from 'react';
import './IconButton.css';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`md-icon-button ${className}`}
      aria-label={label || icon}
      {...props}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
};
