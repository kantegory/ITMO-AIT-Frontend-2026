export const CURRENT_USER_STORAGE_KEY = 'currentUser';

export function getStoredCurrentUser() {
  const rawUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error('Не удалось прочитать currentUser из localStorage', error);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    return null;
  }
}

export function saveStoredCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}
