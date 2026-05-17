async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: "POST",
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      alert("Регистрация успешна! Теперь вы можете войти.");
      window.location.href = "login.html";
    } else {
      const err = await response.text();
      alert("Ошибка регистрации: " + err);
    }
  } catch (error) {
    alert("Ошибка сети: сервер авторизации (порт 3000) не запущен.");
  }
}
