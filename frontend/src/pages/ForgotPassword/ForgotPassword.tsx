// Password recovery request form with a future backend-ready service boundary.
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthButton, AuthCard, AuthFooter, AuthHeader, AuthInput } from '../../components/auth';
import { forgotPassword } from '../../services/authService';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    await forgotPassword(email);
    navigate('/verify-otp');
  };

  return <AuthCard><AuthHeader title="Forgot your password?" description="Enter your email and we will send a six-digit verification code." /><form className="auth-form" onSubmit={handleSubmit} noValidate><AuthInput label="Email address" id="forgot-email" type="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} placeholder="you@organization.gov" /><p className="auth-note">The code lets us verify your identity before you choose a new password.</p><AuthButton type="submit">Send OTP</AuthButton></form><AuthFooter prompt="Remembered your password?" action="Sign in" to="/login" /></AuthCard>;
};
