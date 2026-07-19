// Async frontend placeholders that can later be replaced by FastAPI requests.
import type {
  LoginRequest,
  OTPRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '../types/auth';

export const login = (request: LoginRequest) => {
  void request;
  return Promise.resolve();
};

export const register = (request: RegisterRequest) => {
  void request;
  return Promise.resolve();
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
