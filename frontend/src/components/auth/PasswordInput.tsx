// Password input with an accessible visibility control.
import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const PasswordInput = ({ label, error, id, ...inputProps }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <div className="password-input">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
        <button
          type="button"
          className="password-input__toggle"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          {isVisible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <small className="auth-error">{error}</small>}
    </label>
  );
};
