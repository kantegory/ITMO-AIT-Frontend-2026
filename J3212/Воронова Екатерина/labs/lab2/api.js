const API_URL = "http://localhost:3000";

async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error("Ошибка загрузки данных");
  }
  return await response.json();
}

async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Ошибка отправки данных");
  }

  return await response.json();
}

function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}