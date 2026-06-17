const { ref, computed } = window.Vue;
const api = window.axios;

const fallbackUser = {
    id: '1',
    username: 'nina',
    email: 'nina@itmo.ru',
    password: '123'
};

const currentUser = ref(readUser());

function readUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function readLocalUsers() {
    try {
        return JSON.parse(localStorage.getItem('registeredUsers')) || [];
    } catch {
        return [];
    }
}

async function loadUsers() {
    const localUsers = readLocalUsers();

    try {
        const response = await api.get('./json/db.json');
        return [...response.data.users, ...localUsers];
    } catch {
        return [fallbackUser, ...localUsers];
    }
}

export function useAuth() {
    const isAuthenticated = computed(() => localStorage.getItem('isAuth') === 'true' && Boolean(currentUser.value));

    async function login(email, password) {
        const users = await loadUsers();
        const foundUser = users.find((user) => user.email === email && user.password === password);

        if (!foundUser) {
            throw new Error('Invalid email or password');
        }

        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('user', JSON.stringify(foundUser));
        currentUser.value = foundUser;
        return foundUser;
    }

    function register(payload) {
        const users = readLocalUsers();
        const exists = users.some((user) => user.email === payload.email);

        if (exists || payload.email === fallbackUser.email) {
            throw new Error('User with this email already exists');
        }

        const user = {
            id: String(Date.now()),
            username: payload.username,
            email: payload.email,
            password: payload.password
        };

        localStorage.setItem('registeredUsers', JSON.stringify([...users, user]));
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        currentUser.value = user;
        return user;
    }

    function logout() {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('user');
        currentUser.value = null;
    }

    return {
        currentUser,
        isAuthenticated,
        login,
        register,
        logout
    };
}
