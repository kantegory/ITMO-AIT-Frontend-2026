function checkAuth() {
  if (localStorage.accessToken) {
    window.location.href = "dashboard.html";
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const loginData = {};
  formData.forEach((value, key) => loginData[key] = value);

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const responseJson = await response.json();
      localStorage.accessToken = responseJson.accessToken;
      localStorage.user = JSON.stringify(responseJson.user);
      window.location.href = "dashboard.html";
    } else {
      const err = await response.text();
      alert("Ошибка входа: " + err);
    }
  } catch (error) {
    alert("Ошибка сети: сервер авторизации (порт 3000) не запущен.");
  }
}

document.addEventListener('DOMContentLoaded', checkAuth);
