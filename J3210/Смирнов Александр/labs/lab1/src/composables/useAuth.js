import { computed, ref } from "vue";

const user = ref(readStoredUser());

function readStoredUser() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) return null;

    const id = localStorage.getItem("userId") || "";
    const username = localStorage.getItem("userName") || "Student User";
    const email = localStorage.getItem("userEmail") || "student@itmo.ru";

    return { id, username, email };
}

function persistUser(nextUser) {
    if (!nextUser) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        user.value = null;
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", String(nextUser.id));
    localStorage.setItem("userName", nextUser.username);
    localStorage.setItem("userEmail", nextUser.email);
    user.value = {
        id: String(nextUser.id),
        username: nextUser.username,
        email: nextUser.email
    };
}

export function useAuth() {
    const isLoggedIn = computed(() => Boolean(user.value));

    const login = (nextUser) => {
        persistUser(nextUser);
    };

    const logout = () => {
        persistUser(null);
    };

    const updateProfile = (username) => {
        if (!user.value) return;
        persistUser({
            ...user.value,
            username
        });
    };

    return {
        user,
        isLoggedIn,
        login,
        logout,
        updateProfile
    };
}
