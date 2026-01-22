import React from 'react';
import './Button.css';

export type ButtonVariant = 'filled' | 'outlined' | 'text';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`md-button md-button--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
