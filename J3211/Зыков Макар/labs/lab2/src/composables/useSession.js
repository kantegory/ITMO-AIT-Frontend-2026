import { computed, reactive } from "vue";

const SESSION_STORAGE_KEY = "makars-event-lab2-session";

function loadSession() {
  try {
    const rawValue = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    return null;
  }
}

function persistSession(session) {
  try {
    if (!session) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
  }
}

const state = reactive({
  session: typeof window === "undefined" ? null : loadSession()
});

export function useSession() {
  const session = computed(() => state.session);
  const user = computed(() => state.session?.user || null);
  const role = computed(() => user.value?.role || "");
  const isAuthenticated = computed(() => Boolean(state.session?.token));
  const cabinetRouteName = computed(() => role.value === "organizer" ? "organizer-cabinet" : "user-cabinet");

  function login(nextSession) {
    state.session = nextSession;
    persistSession(nextSession);
  }

  function logout() {
    state.session = null;
    persistSession(null);
  }

  function getAuthHeaders() {
    return state.session?.token
      ? { Authorization: `Bearer ${state.session.token}` }
      : {};
  }

  return {
    session,
    user,
    role,
    isAuthenticated,
    cabinetRouteName,
    login,
    logout,
    getAuthHeaders
  };
}
