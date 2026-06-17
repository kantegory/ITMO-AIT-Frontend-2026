export const AUTH_STORAGE_KEY = 'lab3-auth-state';

export function decodeBase64Url(raw) {
  const normalized = String(raw || '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  return atob(normalized + padding);
}

export function decodeUserIdFromToken(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const userId = Number(payload.sub || payload.userId || payload.id);
    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
}

export function readStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* Ignore private mode/localStorage write failures. */
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* Ignore private mode/localStorage write failures. */
  }
}
