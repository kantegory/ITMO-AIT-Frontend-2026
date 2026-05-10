import { computed, ref } from "vue";
import { buildSession, loginWithCredentials, registerWithProfile } from "@/services/authApi";
import { clearStoredSession, loadStoredSession, saveStoredSession } from "@/services/sessionStorage";

const session = ref(loadStoredSession());

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(session.value?.accessToken));

  async function login(credentials) {
    const nextSession = await loginWithCredentials(credentials);
    saveStoredSession(nextSession);
    session.value = nextSession;
    return nextSession;
  }

  async function register(profile) {
    const nextSession = await registerWithProfile(profile);
    saveStoredSession(nextSession);
    session.value = nextSession;
    return nextSession;
  }

  async function ensureSession() {
    if (!session.value?.accessToken) {
      throw new Error("Требуется авторизация.");
    }

    if (session.value.user?.id) {
      return session.value;
    }

    const refreshed = await buildSession(session.value.accessToken, session.value.user);
    saveStoredSession(refreshed);
    session.value = refreshed;
    return refreshed;
  }

  function logout() {
    clearStoredSession();
    session.value = null;
  }

  return {
    session,
    isAuthenticated,
    login,
    register,
    ensureSession,
    logout,
  };
}

