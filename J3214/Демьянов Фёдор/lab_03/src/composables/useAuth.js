import { ref, computed } from 'vue';
import { usersApi } from '../api/users';

const AUTH_STORAGE_KEY = 'nova_user';
const user = ref(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null'));

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value);

    const setSession = (userData) => {
        user.value = userData;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    };

    const clearSession = () => {
        user.value = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const login = async (email, password) => {
        const users = await usersApi.getByCredentials(email, password);
        if (!users || users.length === 0) {
            throw new Error('Неверный бортовой email или ключ доступа');
        }
        setSession(users[0]);
        return users[0];
    };

    const register = async (name, email, password) => {
        const existing = await usersApi.getByEmail(email);
        if (existing.length > 0) {
            throw new Error('Исследователь с таким email уже зарегистрирован');
        }

        const randomCode = 'NT-' + Math.floor(1000 + Math.random() * 9000) + '-X';
        const newUser = {
            name,
            email,
            password,
            code: randomCode,
            class: 'Cadet Class',
            isDeepSpaceMember: false,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1e29&color=c8d0db&size=96`,
            cabinSettings: {
                gravity: true,
                hypoallergenicFood: false,
                windowDimming: false
            },
            trainingProgress: {
                centrifuge: 0,
                docking: 0,
                suitFitting: 0
            }
        };

        const created = await usersApi.create(newUser);
        setSession(created);
        return created;
    };

    const refreshUserData = async () => {
        if (!user.value) return;
        try {
            const freshData = await usersApi.getById(user.value.id);
            setSession(freshData);
        } catch (e) {
            console.warn('Используются локальные кэшированные данные сессии');
        }
    };

    const updateCabinSetting = async (key, value) => {
        if (!user.value) return;
        const updatedSettings = {
            ...user.value.cabinSettings,
            [key]: value
        };
        const updatedUser = await usersApi.updateCabinSettings(user.value.id, updatedSettings);
        setSession(updatedUser);
    };

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout: clearSession,
        refreshUserData,
        updateCabinSetting
    };
}