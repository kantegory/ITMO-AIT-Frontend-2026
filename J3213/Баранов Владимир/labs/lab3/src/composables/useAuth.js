import { reactive, readonly, computed } from "vue";
import { apiClient, TOKEN_KEY } from "@/api/client.js";

const USER_KEY = "pipelinelab-user";

function loadUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

const state = reactive({
    token: localStorage.getItem(TOKEN_KEY),
    user: loadUser(),
});

function persist(token, user) {
    state.token = token;
    state.user = user;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
}

export function useAuth() {
    const isAuthenticated = computed(() => !!state.token);
    const currentUserId = computed(() => (state.user ? Number(state.user.id) : null));
    const currentUsername = computed(() => state.user?.username || state.user?.email || "");

    async function login(email, password) {
        const { data } = await apiClient.post("/login", { email, password });
        persist(data.accessToken, data.user);
        return data.user;
    }

    async function register(username, email, password) {
        const { data } = await apiClient.post("/register", { username, email, password });
        persist(data.accessToken, data.user || { username, email });
        return data.user;
    }

    function logout() {
        persist(null, null);
    }

    return {
        state: readonly(state),
        isAuthenticated,
        currentUserId,
        currentUsername,
        login,
        register,
        logout,
    };
}
