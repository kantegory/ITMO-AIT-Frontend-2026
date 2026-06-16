import { api, TOKEN_KEY, USER_KEY } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import type { User } from '../types/domain';

export async function login(payload: LoginRequest): Promise<User> {
  const { data } = await api.post<AuthResponse>('/login', payload);
  saveSession(data);
  return data.user;
}

export async function register(payload: RegisterRequest): Promise<User> {
  const { data } = await api.post<AuthResponse>('/register', payload);
  saveSession(data);
  return data.user;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function saveSession({ accessToken, user }: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
