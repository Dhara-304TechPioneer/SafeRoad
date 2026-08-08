// Login form with frontend validation, real backend session integration, and error state handling.
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

const mapRole = (backendRole: string): 'citizen' | 'municipal_officer' | 'admin' => {
  const roleLower = (backendRole || '').toLowerCase();
  if (roleLower === 'admin') return 'admin';
  if (roleLower === 'officer' || roleLower === 'municipal_officer') return 'municipal_officer';
  return 'citizen';
};

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      setGeneralError('');
      const response = await login({ email, password, rememberMe });
      const backendUser = response.data.user;
      
      signIn({
        id: backendUser.id,
        name: backendUser.fullName,
        email: backendUser.email,
        role: mapRole(backendUser.role),
      });

      const role = mapRole(backendUser.role);
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'municipal_officer') {
        navigate('/officer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" description="Sign in to continue improving road safety." />
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {generalError && <div className="auth-error-banner">{generalError}</div>}
        <AuthInput label="Email address" id="login-email" type="email" value={email} error={errors.email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organization.gov" disabled={loading} />
        <PasswordInput label="Password" id="login-password" value={password} error={errors.password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" disabled={loading} />
        <div className="auth-row">
          <AuthCheckbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} disabled={loading}>Remember me</AuthCheckbox>
          <Link to="/forgot-password" style={loading ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>Forgot password?</Link>
        </div>
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </AuthButton>
        <div className="auth-divider">or continue with</div>
        <AuthButton type="button" variant="secondary" disabled><FiChrome /> Google (coming soon)</AuthButton>
      </form>
      <AuthFooter prompt="Don't have an account?" action="Create one" to="/register" />
    </AuthCard>
  );
};
