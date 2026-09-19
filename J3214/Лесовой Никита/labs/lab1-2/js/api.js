const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getCurrentUser() {
  const value = localStorage.getItem("currentUser");
  return value ? JSON.parse(value) : null;
}

function saveCurrentUser(user) {
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    city: user.city
  };

  localStorage.setItem("currentUser", JSON.stringify(safeUser));
  localStorage.setItem("authToken", `demo-token-${user.id}`);
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function showMessage(container, message, type = "danger") {
  if (!container) {
    return;
  }

  container.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

function getApiErrorMessage(error) {
  if (error.code === "ECONNABORTED") {
    return "Сервер слишком долго не отвечает.";
  }

  if (!error.response) {
    return "Не удалось подключиться к API. Запустите проект командой npm start.";
  }

  return `Ошибка API: ${error.response.status}`;
}
