document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await axios.post('http://127.0.0.1:4000/login', {
      email,
      password
    });

    // сохраняем данные
    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    alert('Успешный вход');

    // редирект
    window.location.href = 'courses.html';

  } catch (err) {
    alert('Неверный email или пароль');
    console.error(err);
  }
});