document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const role = document.getElementById('role').value;

  if (!name || !email || !password || !confirmPassword) {
    alert('Заполните все поля');
    return;
  }

  if (password !== confirmPassword) {
    alert('Пароли не совпадают');
    return;
  }

  try {
    const newUser = {
      name,
      email,
      password,
      role
    };

    if (role === 'student') {
      newUser.myCourses = [];
      newUser.certificates = [];
    }

    const res = await axios.post('http://127.0.0.1:4000/register', newUser);

    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    alert('Регистрация прошла успешно');

    if (res.data.user.role === 'teacher') {
      window.location.href = 'profile-teacher.html';
    } else {
      window.location.href = 'profile-user.html';
    }

  } catch (err) {
    alert('Ошибка регистрации. Возможно, такой email уже существует.');
    console.error(err);
  }
});