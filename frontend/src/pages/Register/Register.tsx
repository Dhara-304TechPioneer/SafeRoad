// Account registration form with client-side validation, backend integration, and auto-login.
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AuthButton,
  AuthCard,
  AuthCheckbox,
  AuthFooter,
  AuthHeader,
  AuthInput,
  PasswordInput,
} from '../../components/auth';
import { register } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';

const mapRole = (backendRole: string): 'citizen' | 'municipal_officer' | 'admin' => {
  const roleLower = (backendRole || '').toLowerCase();
  if (roleLower === 'admin') return 'admin';
  if (roleLower === 'officer' || roleLower === 'municipal_officer') return 'municipal_officer';
  return 'citizen';
};

export const Register = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' as UserRole,
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const updateForm = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!/^\+?[\d\s-]{7,15}$/.test(form.phoneNumber)) nextErrors.phoneNumber = 'Enter a valid phone number.';
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!form.acceptedTerms) nextErrors.acceptedTerms = 'Accept the terms to continue.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      setGeneralError('');
      const response = await register(form);
      const backendUser = response.data.user;

      signIn({
        id: backendUser.id,
        name: backendUser.fullName,
        email: backendUser.email,
        role: mapRole(backendUser.role),
      });

      navigate('/dashboard');
    } catch (err: any) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        description="Join the movement for safer roads."
      />
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {generalError && <div className="auth-error-banner">{generalError}</div>}
        <AuthInput label="Full name" id="register-name" value={form.fullName} error={errors.fullName} onChange={(event) => updateForm('fullName', event.target.value)} placeholder="Your full name" disabled={loading} />
        <AuthInput label="Email address" id="register-email" type="email" value={form.email} error={errors.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="you@organization.gov" disabled={loading} />
        <AuthInput label="Phone number" id="register-phone" type="tel" value={form.phoneNumber} error={errors.phoneNumber} onChange={(event) => updateForm('phoneNumber', event.target.value)} placeholder="+91 98765 43210" disabled={loading} />
        <label className="auth-field" htmlFor="register-role">
          <span>Role</span>
          <select className="auth-select" id="register-role" value={form.role} onChange={(event) => updateForm('role', event.target.value as UserRole)} disabled={loading}>
            <option value="citizen">Citizen</option>
            <option value="municipal_officer">Municipal Officer</option>
          </select>
        </label>
        <PasswordInput label="Password" id="register-password" value={form.password} error={errors.password} onChange={(event) => updateForm('password', event.target.value)} placeholder="Create a password" disabled={loading} />
        <PasswordInput label="Confirm password" id="register-confirm-password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(event) => updateForm('confirmPassword', event.target.value)} placeholder="Repeat your password" disabled={loading} />
        <AuthCheckbox checked={form.acceptedTerms} onChange={(event) => updateForm('acceptedTerms', event.target.checked)} disabled={loading}>I agree to the Terms &amp; Conditions</AuthCheckbox>
        {errors.acceptedTerms && <small className="auth-error">{errors.acceptedTerms}</small>}
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </AuthButton>
      </form>
      <AuthFooter prompt="Already have an account?" action="Sign in" to="/login" />
    </AuthCard>
  );
};
