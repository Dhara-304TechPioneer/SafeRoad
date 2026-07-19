// Account registration form with client-side validation only.
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
import type { UserRole } from '../../types/auth';

export const Register = () => {
  const navigate = useNavigate();
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

    await register(form);
    navigate('/verify-otp');
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        description="Join the movement for safer roads."
      />
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput label="Full name" id="register-name" value={form.fullName} error={errors.fullName} onChange={(event) => updateForm('fullName', event.target.value)} placeholder="Your full name" />
        <AuthInput label="Email address" id="register-email" type="email" value={form.email} error={errors.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="you@organization.gov" />
        <AuthInput label="Phone number" id="register-phone" type="tel" value={form.phoneNumber} error={errors.phoneNumber} onChange={(event) => updateForm('phoneNumber', event.target.value)} placeholder="+91 98765 43210" />
        <label className="auth-field" htmlFor="register-role">
          <span>Role</span>
          <select className="auth-select" id="register-role" value={form.role} onChange={(event) => updateForm('role', event.target.value as UserRole)}>
            <option value="citizen">Citizen</option>
            <option value="municipal_officer">Municipal Officer</option>
          </select>
        </label>
        <PasswordInput label="Password" id="register-password" value={form.password} error={errors.password} onChange={(event) => updateForm('password', event.target.value)} placeholder="Create a password" />
        <PasswordInput label="Confirm password" id="register-confirm-password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(event) => updateForm('confirmPassword', event.target.value)} placeholder="Repeat your password" />
        <AuthCheckbox checked={form.acceptedTerms} onChange={(event) => updateForm('acceptedTerms', event.target.checked)}>I agree to the Terms &amp; Conditions</AuthCheckbox>
        {errors.acceptedTerms && <small className="auth-error">{errors.acceptedTerms}</small>}
        <AuthButton type="submit">Create account</AuthButton>
      </form>
      <AuthFooter prompt="Already have an account?" action="Sign in" to="/login" />
    </AuthCard>
  );
};
