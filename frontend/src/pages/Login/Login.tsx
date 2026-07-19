// Login form with frontend validation and temporary client-side session state.
import { useState, type FormEvent } from 'react';
import { FiChrome } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import {
  AuthButton,
  AuthCard,
  AuthCheckbox,
  AuthFooter,
  AuthHeader,
  AuthInput,
  PasswordInput,
} from '../../components/auth';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await login({ email, password, rememberMe });
    signIn({ name: 'Ananya Patel', email, role: 'municipal_officer' });
    navigate('/dashboard');
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" description="Sign in to continue improving road safety." />
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput label="Email address" id="login-email" type="email" value={email} error={errors.email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organization.gov" />
        <PasswordInput label="Password" id="login-password" value={password} error={errors.password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
        <div className="auth-row"><AuthCheckbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}>Remember me</AuthCheckbox><Link to="/forgot-password">Forgot password?</Link></div>
        <AuthButton type="submit">Sign in</AuthButton>
        <div className="auth-divider">or continue with</div>
        <AuthButton type="button" variant="secondary" disabled><FiChrome /> Google (coming soon)</AuthButton>
      </form>
      <AuthFooter prompt="Don't have an account?" action="Create one" to="/register" />
    </AuthCard>
  );
};
