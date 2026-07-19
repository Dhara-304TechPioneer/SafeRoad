// Shared primary and secondary button treatment for auth workflows.
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export const AuthButton = ({ children, variant = 'primary', ...buttonProps }: AuthButtonProps) => {
  return (
    <button className={`auth-button auth-button--${variant}`} {...buttonProps}>
      {children}
    </button>
  );
};
