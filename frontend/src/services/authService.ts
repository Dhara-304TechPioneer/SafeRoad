const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
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

export interface BackendAuthResponse {
  status: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export const login = async (request: LoginRequest): Promise<BackendAuthResponse> => {
  const response = await requestJson<BackendAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: request.email,
      password: request.password,
    }),
  });

  return response;
};

export const register = async (request: RegisterRequest): Promise<BackendAuthResponse> => {
  const response = await requestJson<BackendAuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: request.fullName,
      name: request.fullName,
      email: request.email,
      password: request.password,
    }),
  });

  return response;
};

export const getProfile = async () => {
  return await requestJson<{
    status: string;
    data: {
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  }>('/auth/me');
};

export const logout = async (): Promise<void> => {
  await requestJson('/auth/logout', { method: 'POST' });
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
