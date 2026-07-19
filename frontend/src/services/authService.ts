const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.detail ?? payload?.message ?? 'Request failed');
  }

  return payload as T;
};

import type {
  LoginRequest,
  OTPRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '../types/auth';

export const login = async (request: LoginRequest) => {
  const response = await requestJson<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: request.email,
      password: request.password,
    }),
  });

  localStorage.setItem('access_token', response.access_token);
  return response;
};

export const register = async (request: RegisterRequest) => {
  const response = await requestJson<{ access_token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: request.fullName,
      email: request.email,
      password: request.password,
      role: request.role,
    }),
  });

  localStorage.setItem('access_token', response.access_token);
  return response;
};

export const forgotPassword = (email: string) => Promise.resolve(email);

export const verifyOTP = (request: OTPRequest) => {
  void request;
  return Promise.resolve();
};

export const resetPassword = (request: ResetPasswordRequest) => {
  void request;
  return Promise.resolve();
};
