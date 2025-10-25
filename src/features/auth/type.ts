import { ApiResponse } from '@/types/api.type';

export type LoginCredentials = {
  email: string;
  password: string;
};

export interface User {
  id: number;
  name: string;
  email: string;
  googleId?: string | null;
  avatar?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  user: User;
  token: string;
  refreshToken: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export type registrationRequest = {
  email: string;
  password: string;
  name: string;
};

export type RegistrationResponse = ApiResponse<{
  user: User;
}>;
