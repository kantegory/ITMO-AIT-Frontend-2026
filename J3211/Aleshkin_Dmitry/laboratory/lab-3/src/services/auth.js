const AUTH_STORAGE_KEY = 'financeManagerAuth';

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setStoredAuth(user) {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      userId: user.id,
    }),
  );
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}