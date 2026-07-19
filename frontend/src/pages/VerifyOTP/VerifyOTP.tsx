// OTP verification form using the reusable multi-field code input.
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthButton, AuthCard, AuthHeader, OTPInput } from '../../components/auth';
import { verifyOTP } from '../../services/authService';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError('Enter the complete six-digit code.');
      return;
    }
    await verifyOTP({ email: '', code });
    navigate('/reset-password');
  };

  return <AuthCard><AuthHeader title="Verify your email" description="Enter the six-digit code we sent to your email address." /><form className="auth-form" onSubmit={handleSubmit}><OTPInput value={code} onChange={setCode} error={error} /><p className="auth-note">Code expires in 09:59. Didn't receive it? <button className="auth-inline-button" type="button">Resend OTP</button></p><AuthButton type="submit">Verify code</AuthButton></form></AuthCard>;
};
