(() => {
    const cookieName = "userid";
    let currentUser = null;

    const emitChange = () => {
        window.dispatchEvent(new Event("userchange"));
    };

    const getUserId = () => {
        const match = document.cookie.match(/(?:^|;\s*)userid=([^;]+)/);

        if (!match) {
            return null;
        }

        return Number(match[1]);
    };

    const setSession = (user) => {
        currentUser = user;
        document.cookie = `${cookieName}=${user.id}; path=/`;
        emitChange();
    };

    const clearSession = () => {
        currentUser = null;
        document.cookie = `${cookieName}=; path=/; max-age=0;`;
        emitChange();
    };

    const loadCurrentUser = async () => {
        const userId = getUserId();
        if (!userId) {
            currentUser = null;
            return null;
        }
        if (currentUser && currentUser.id === userId) {
            return currentUser;
        }
        try {
            currentUser = await window.api.getUser(userId);
            return currentUser;
        } catch {
            clearSession();
            return null;
        }
    };

    const requireAuth = async () => {
        const user = await loadCurrentUser();

        if (!user) {
            window.location.href = "login.html";
            return null;
        }

        return user;
    };

    const redirectAuth = async () => {
        const user = await loadCurrentUser();

        if (user) {
            window.location.replace("courses.html");
            return true;
        }

        return false;
    };

    const updateCurrentUser = (user) => {
        currentUser = user;
        emitChange();
    };

    window.auth = {
        getUserId,
        loadCurrentUser,
        requireAuth,
        redirectAuth,
        setSession,
        clearSession,
        updateCurrentUser
    };
})();
