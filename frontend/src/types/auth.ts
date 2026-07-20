// Shared contracts for the future SafeRoad authentication API integration.
export type UserRole = 'citizen' | 'municipal_officer' | 'admin';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}


export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface OTPRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}
