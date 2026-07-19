// Labeled input with consistent validation feedback.
import type { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = ({ label, error, id, ...inputProps }: AuthInputProps) => {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} aria-invalid={Boolean(error)} {...inputProps} />
      {error && <small className="auth-error">{error}</small>}
    </label>
  );
};
