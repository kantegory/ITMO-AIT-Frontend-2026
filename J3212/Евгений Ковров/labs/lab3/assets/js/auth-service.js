(function (global) {
  if (!global.KontramarkaApi || !global.KontramarkaApi.apiClient) {
    throw new Error('API client is required to initialize auth service.');
  }

  const { apiClient } = global.KontramarkaApi;
  const STORAGE_KEY = 'kontramarkaCurrentUser';

  function saveCurrentUser(user) {
    const userToStore = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(userToStore));
    return userToStore;
  }

  function isNetworkError(error) {
    return !error.response;
  }

  function getAuthErrorMessage(error, fallbackMessage) {
    if (isNetworkError(error)) {
      return 'Сервис временно недоступен. Попробуйте позже.';
    }

    return error.message || fallbackMessage;
  }

  function createAuthError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  async function registerUser({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUsersResponse = await apiClient.get('/users', {
      params: {
        email: normalizedEmail
      }
    });

    if (existingUsersResponse.data.length > 0) {
      throw createAuthError('EMAIL_EXISTS', 'Пользователь с таким email уже существует.');
    }

    const createUserResponse = await apiClient.post('/users', {
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    return saveCurrentUser(createUserResponse.data);
  }

  async function loginUser({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await apiClient.get('/users', {
      params: {
        email: normalizedEmail,
        password
      }
    });

    const user = response.data[0];

    if (!user) {
      throw createAuthError('INVALID_CREDENTIALS', 'Неверный email или пароль.');
    }

    return saveCurrentUser(user);
  }

  function getCurrentUser() {
    const rawUser = global.localStorage.getItem(STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch (error) {
      global.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function logoutUser() {
    global.localStorage.removeItem(STORAGE_KEY);
  }

  function isAuthenticated() {
    return Boolean(getCurrentUser());
  }

  global.KontramarkaAuth = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    isAuthenticated,
    getAuthErrorMessage,
    storageKey: STORAGE_KEY
  };
})(window);
