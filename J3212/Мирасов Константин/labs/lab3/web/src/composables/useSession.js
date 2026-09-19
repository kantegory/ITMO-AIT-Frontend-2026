import { readonly, shallowRef } from 'vue';

const key = 'axonhub-session';
const notice = shallowRef(null);

export const accountNotice = readonly(notice);

const notices = {
  login: { tone: 'success', message: 'You are now logged in.' },
  registered: { tone: 'success', message: 'Your account is ready. You are now logged in.' },
  logout: { tone: 'info', message: 'You have been logged out.' },
  expired: { tone: 'error', message: 'Your session has expired. Log in again to continue.' },
};

export function dismissAccountNotice() {
  notice.value = null;
}

export function safeSession(value) {
  const user = value?.user;

  if (
    typeof value?.accessToken !== 'string' ||
    !value.accessToken ||
    !Number.isSafeInteger(user?.id) ||
    user.id <= 0 ||
    typeof user.email !== 'string' ||
    typeof user.displayName !== 'string'
  ) {
    return null;
  }

  return {
    accessToken: value.accessToken,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
  };
}

function readSession() {
  try {
    return safeSession(JSON.parse(sessionStorage.getItem(key)));
  } catch {
    return null;
  }
}

const current = shallowRef(readSession());

export const session = readonly(current);

export function saveSession(value, reason) {
  const safe = safeSession(value);

  if (!safe) {
    throw new Error('Invalid session response.');
  }

  current.value = safe;
  notice.value = notices[reason] ? { ...notices[reason] } : null;

  try {
    sessionStorage.setItem(key, JSON.stringify(safe));
  } catch {}
}

export function clearSession(reason) {
  current.value = null;
  notice.value = notices[reason] ? { ...notices[reason] } : null;

  try {
    sessionStorage.removeItem(key);
  } catch {}
}

export function useSession() {
  return { session, saveSession, clearSession };
}

export function getReturnPath(value) {
  if (
    typeof value !== 'string' ||
    !/^\/(explore|profile|resources\/[1-9]\d*)(?:[?#]|$)/.test(value) ||
    /[\\\r\n]/.test(value)
  ) {
    return '/profile';
  }

  return value;
}
