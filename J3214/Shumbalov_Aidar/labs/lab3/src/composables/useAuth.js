import { computed, ref } from 'vue';
import { api } from '../services/api';

const token = ref(localStorage.getItem('omagad_lab3_token'));
const user = ref(JSON.parse(localStorage.getItem('omagad_lab3_user') || 'null'));
const authError = ref('');
const authLoading = ref(false);

function persistAuth(payload) {
  token.value = payload.accessToken;
  user.value = payload.user;
  localStorage.setItem('omagad_lab3_token', token.value);
  localStorage.setItem('omagad_lab3_user', JSON.stringify(user.value));
}

async function ensureUser(payload, email) {
  if (payload.user) return payload;

  localStorage.setItem('omagad_lab3_token', payload.accessToken);
  const { data } = await api.get('/users', {
    params: { email },
  });

  return {
    ...payload,
    user: data[0],
  };
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(token.value && user.value));

  async function login(credentials) {
    authLoading.value = true;
    authError.value = '';

    try {
      const { data } = await api.post('/login', credentials);
      persistAuth(await ensureUser(data, credentials.email));
      return true;
    } catch (error) {
      authError.value = 'Не удалось войти. Проверьте email и пароль.';
      return false;
    } finally {
      authLoading.value = false;
    }
  }

  async function register(form) {
    authLoading.value = true;
    authError.value = '';

    try {
      const { data } = await api.post('/register', {
        ...form,
        role: 'student',
      });
      persistAuth(await ensureUser(data, form.email));
      return true;
    } catch (error) {
      authError.value = 'Не удалось зарегистрироваться. Возможно, email уже занят.';
      return false;
    } finally {
      authLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('omagad_lab3_token');
    localStorage.removeItem('omagad_lab3_user');
  }

  return {
    authError,
    authLoading,
    isAuthenticated,
    login,
    logout,
    register,
    token,
    user,
  };
}
