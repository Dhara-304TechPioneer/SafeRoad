// Consistent glass-style container for each authentication form.
import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return <section className="auth-card">{children}</section>;
};
