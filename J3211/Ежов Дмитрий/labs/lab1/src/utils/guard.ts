import { getCurrentUser, getToken } from '../api/auth';
import type { User } from '../types/domain';

export function requireAuth(): User {
  const token = getToken();
  const user = getCurrentUser();
  if (!token || !user) {
    location.replace('/index.html');
    throw new Error('Not authenticated');
  }
  return user;
}

export function redirectIfAuthed(): void {
  if (getToken()) {
    location.replace('/dashboard.html');
  }
}
