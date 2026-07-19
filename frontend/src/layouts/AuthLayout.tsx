// Split authentication shell shared by all public account-management pages.
import type { ReactNode } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

import '../components/auth/Auth.css';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
}

const platformFeatures = [
  'AI-powered pothole detection',
  'Live road monitoring',
  'Smart government dashboard',
  'Citizen reporting',
];

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <section className="auth-layout__intro">
        <div className="auth-layout__brand">
          <span className="auth-layout__logo">S</span>
          <div>
            <strong>SafeRoad</strong>
            <small>Making Every Road Safer.</small>
          </div>
        </div>

        <div className="auth-layout__copy">
          <p className="auth-layout__eyebrow">ROAD SAFETY, REIMAGINED</p>
          <h2>Better decisions begin with safer roads.</h2>
          <p>
            A connected platform that helps citizens and authorities act on road risks faster.
          </p>
        </div>

        <ul className="auth-layout__features">
          {platformFeatures.map((feature) => (
            <li key={feature}>
              <FiCheckCircle />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <div className="auth-layout__form-area">{children}</div>
    </div>
  );
};
