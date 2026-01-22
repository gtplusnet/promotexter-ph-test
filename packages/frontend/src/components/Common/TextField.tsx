import React from 'react';
import './TextField.css';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leadingIcon?: string;
  trailingIcon?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  leadingIcon,
  trailingIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `textfield-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasError = Boolean(error);

  return (
    <div className={`md-text-field ${hasError ? 'md-text-field--error' : ''} ${className}`}>
      <div className="md-text-field__container">
        {leadingIcon && (
          <span className="md-text-field__icon md-text-field__icon--leading material-symbols-outlined">
            {leadingIcon}
          </span>
        )}
        <div className="md-text-field__input-wrapper">
          <input
            id={inputId}
            className="md-text-field__input"
            placeholder=" "
            {...props}
          />
          <label htmlFor={inputId} className="md-text-field__label">
            {label}
          </label>
        </div>
        {trailingIcon && (
          <span className="md-text-field__icon md-text-field__icon--trailing material-symbols-outlined">
            {trailingIcon}
          </span>
        )}
      </div>
      {error && (
        <div className="md-text-field__supporting-text">
          {error}
        </div>
      )}
    </div>
  );
};
