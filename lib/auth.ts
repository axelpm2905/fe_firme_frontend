import { api } from './api';
import { apiUrl } from './api';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string | null;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const signInWithEmail = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    localStorage.setItem('fe_firme_token', res.token);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  }
  return res;
};

export const getGoogleLoginUrl = (): string => {
  return `${apiUrl}/api/auth/google`;
};

export const signOut = (): void => {
  localStorage.removeItem('fe_firme_token');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-change'));
  }
};

export const getMe = async (): Promise<{ user: AuthUser }> => {
  return api<{ user: AuthUser }>('/api/auth/me');
};
