import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { authApi } from "../api";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const token = ref("");
  const error = ref("");
  const isLoading = ref(false);

  const isAuthenticated = computed(() => Boolean(currentUser.value && token.value));

  function saveSession(user) {
    const { password, ...safeUser } = user;
    currentUser.value = safeUser;
    token.value = `demo-token-${user.id}`;
    localStorage.setItem("travel-token", token.value);
  }

  async function login(email, password) {
    error.value = "";
    isLoading.value = true;

    try {
      const response = await authApi.findByEmail(email.trim().toLowerCase());
      const user = response.data.find((item) => item.password === password);

      if (!user) {
        error.value = "Неверная почта или пароль.";
        return false;
      }

      saveSession(user);
      return true;
    } catch (requestError) {
      error.value = "Не удалось войти. Проверьте работу JSON Server.";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(form) {
    error.value = "";
    isLoading.value = true;

    try {
      const existingUsers = await authApi.findByEmail(form.email.trim().toLowerCase());
      if (existingUsers.data.length) {
        error.value = "Пользователь с такой почтой уже существует.";
        return false;
      }

      const response = await authApi.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        city: form.city.trim()
      });
      saveSession(response.data);
      return true;
    } catch (requestError) {
      error.value = "Не удалось зарегистрироваться.";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    currentUser.value = null;
    token.value = "";
    error.value = "";
    localStorage.removeItem("travel-token");
  }

  return {
    currentUser,
    token,
    error,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  };
}, {
  persist: {
    pick: ["currentUser", "token"]
  }
});
