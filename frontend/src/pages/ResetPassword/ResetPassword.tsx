// Final password reset form with matching-password validation.
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthButton, AuthCard, AuthHeader, PasswordInput } from '../../components/auth';
import { resetPassword } from '../../services/authService';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await resetPassword({ password, confirmPassword });
    navigate('/login');
  };

  return <AuthCard><AuthHeader title="Set a new password" description="Choose a strong password you have not used before." /><form className="auth-form" onSubmit={handleSubmit} noValidate><PasswordInput label="New password" id="new-password" value={password} error={errors.password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a new password" /><PasswordInput label="Confirm new password" id="confirm-new-password" value={confirmPassword} error={errors.confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your new password" /><AuthButton type="submit">Reset password</AuthButton></form></AuthCard>;
};
