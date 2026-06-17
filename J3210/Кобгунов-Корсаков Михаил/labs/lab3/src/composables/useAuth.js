import { ref } from 'vue';
import { useApi } from './useApi';

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

export function useAuth() {
  const { api } = useApi();

  function setUser(value) {
    user.value = value;

    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
    }
  }

  async function login(email, password) {
    const response = await api.get('/users', {
      params: { email }
    });

    const foundUser = response.data.find(
      (item) => String(item.password).trim() === String(password).trim()
    );

    if (!foundUser) {
      throw new Error('Неверный email или пароль');
    }

    setUser(foundUser);
    return foundUser;
  }

  async function register(name, email, password) {
    const existingResponse = await api.get('/users', {
      params: { email }
    });

    if (existingResponse.data.length > 0) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const response = await api.post('/users', {
      name,
      email,
      password
    });

    return response.data;
  }

  function logout() {
    setUser(null);
  }

  return {
    user,
    login,
    register,
    logout
  };
}
