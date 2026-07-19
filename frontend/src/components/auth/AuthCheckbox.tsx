// Accessible checkbox control for authentication preferences and agreements.
import type { InputHTMLAttributes, ReactNode } from 'react';

interface AuthCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
}

export const AuthCheckbox = ({ children, ...inputProps }: AuthCheckboxProps) => {
  return (
    <label className="auth-checkbox">
      <input type="checkbox" {...inputProps} />
      <span>{children}</span>
    </label>
  );
};
