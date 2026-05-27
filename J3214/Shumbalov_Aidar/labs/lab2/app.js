const API_URL = 'http://127.0.0.1:3001';
const storage = {
  token: 'omagad_lab2_token',
  user: 'omagad_lab2_user',
};

const state = {
  token: localStorage.getItem(storage.token),
  user: JSON.parse(localStorage.getItem(storage.user) || 'null'),
  courses: [],
  enrollments: [],
  selectedCourseId: null,
};

const elements = {
  apiStatus: document.getElementById('apiStatus'),
  authStatus: document.getElementById('authStatus'),
  logoutButton: document.getElementById('logoutButton'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  authMessage: document.getElementById('authMessage'),
  authTabs: document.querySelectorAll('[data-auth-tab]'),
  queryInput: document.getElementById('queryInput'),
  subjectSelect: document.getElementById('subjectSelect'),
  levelSelect: document.getElementById('levelSelect'),
  priceSelect: document.getElementById('priceSelect'),
  courseGrid: document.getElementById('courseGrid'),
  courseCount: document.getElementById('courseCount'),
  emptyState: document.getElementById('emptyState'),
  profileContent: document.getElementById('profileContent'),
  courseDetails: document.getElementById('courseDetails'),
  template: document.getElementById('courseCardTemplate'),
};

function getWord(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'курс';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'курса';
  return 'курсов';
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Ошибка API: ${response.status}`);
  }

  return response.json();
}

async function setAuthData(payload, fallbackEmail) {
  state.token = payload.accessToken;
  state.user = payload.user || null;
  localStorage.setItem(storage.token, state.token);

  if (!state.user && fallbackEmail) {
    const users = await request(`/users?email=${encodeURIComponent(fallbackEmail)}`);
    state.user = users[0] || null;
  }

  if (!state.user) {
    throw new Error('Не удалось получить пользователя');
  }

  localStorage.setItem(storage.user, JSON.stringify(state.user));
}

function clearAuthData() {
  state.token = null;
  state.user = null;
  state.enrollments = [];
  localStorage.removeItem(storage.token);
  localStorage.removeItem(storage.user);
}

function syncAuthView() {
  const name = state.user?.name || state.user?.email;
  elements.authStatus.textContent = state.user ? `Пользователь: ${name}` : 'Гость';
  elements.logoutButton.hidden = !state.user;
  renderProfile();
  renderCourses();
}

async function loadCourses() {
  try {
    state.courses = await request('/courses');
    state.selectedCourseId = state.courses[0]?.id || null;
    elements.apiStatus.textContent = 'API подключён';
    renderCourses();
    renderCourseDetails();
  } catch (error) {
    elements.apiStatus.textContent = 'API недоступен';
    elements.courseGrid.innerHTML = '';
    elements.emptyState.hidden = false;
    elements.emptyState.textContent = 'Запустите mock API: npm run api';
  }
}

async function loadEnrollments() {
  if (!state.user) {
    state.enrollments = [];
    syncAuthView();
    return;
  }

  try {
    state.enrollments = await request(`/enrollments?userId=${state.user.id}`);
  } catch (error) {
    elements.authMessage.textContent = 'Не удалось загрузить кабинет. Проверьте токен авторизации.';
    state.enrollments = [];
  }

  syncAuthView();
}

function getFilteredCourses() {
  const query = elements.queryInput.value.trim().toLowerCase();
  const subject = elements.subjectSelect.value;
  const level = elements.levelSelect.value;
  const price = elements.priceSelect.value;

  return state.courses.filter((course) => {
    const matchesQuery = course.title.toLowerCase().includes(query);
    const matchesSubject = subject === 'all' || course.subject === subject;
    const matchesLevel = level === 'all' || course.level === level;
    const matchesPrice =
      price === 'all' || (price === 'free' && course.price === 0) || (price === 'paid' && course.price > 0);

    return matchesQuery && matchesSubject && matchesLevel && matchesPrice;
  });
}

function getEnrollment(courseId) {
  return state.enrollments.find((enrollment) => enrollment.courseId === courseId);
}

function renderCourses() {
  const courses = getFilteredCourses();
  elements.courseGrid.innerHTML = '';
  elements.courseCount.textContent = `${courses.length} ${getWord(courses.length)}`;
  elements.emptyState.hidden = courses.length > 0;

  courses.forEach((course) => {
    const card = elements.template.content.firstElementChild.cloneNode(true);
    const enrollment = getEnrollment(course.id);

    card.querySelector('.course-meta').textContent = `${course.subjectLabel} - ${course.levelLabel}`;
    card.querySelector('h3').textContent = course.title;
    card.querySelector('p').textContent = course.description;
    card.querySelector('strong').textContent = course.price === 0 ? 'Бесплатно' : `${course.price} ₽`;

    const button = card.querySelector('button');
    button.textContent = enrollment ? `Открыть, ${enrollment.progress}%` : 'Записаться';
    button.addEventListener('click', () => handleCourseAction(course.id));

    card.addEventListener('click', (event) => {
      if (event.target.tagName !== 'BUTTON') {
        state.selectedCourseId = course.id;
        renderCourseDetails();
      }
    });

    elements.courseGrid.append(card);
  });
}

function renderProfile() {
  if (!state.user) {
    elements.profileContent.innerHTML = `
      <div class="notice">
        <strong>Войдите в аккаунт</strong>
        <p>После авторизации здесь появятся купленные курсы, прогресс и сертификаты.</p>
      </div>
    `;
    return;
  }

  const completedCount = state.enrollments.filter((enrollment) => enrollment.progress === 100).length;
  const averageProgress = state.enrollments.length
    ? Math.round(state.enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / state.enrollments.length)
    : 0;

  const courseRows = state.enrollments
    .map((enrollment) => {
      const course = state.courses.find((item) => item.id === enrollment.courseId);
      if (!course) return '';
      return `
        <li>
          <span>${course.title}</span>
          <strong>${enrollment.progress}%</strong>
        </li>
      `;
    })
    .join('');

  elements.profileContent.innerHTML = `
    <div class="metrics">
      <div><span>Курсов</span><strong>${state.enrollments.length}</strong></div>
      <div><span>Средний прогресс</span><strong>${averageProgress}%</strong></div>
      <div><span>Сертификатов</span><strong>${completedCount}</strong></div>
    </div>
    <ul class="profile-list">${courseRows || '<li>Курсы пока не выбраны.</li>'}</ul>
  `;
}

function renderCourseDetails() {
  const course = state.courses.find((item) => item.id === state.selectedCourseId);
  if (!course) {
    elements.courseDetails.innerHTML = '<p class="text-muted">Выберите курс из каталога.</p>';
    return;
  }

  const materials = course.materials.map((item) => `<li>${item}</li>`).join('');
  elements.courseDetails.innerHTML = `
    <article>
      <span class="pill">${course.subjectLabel}</span>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <dl>
        <div><dt>Преподаватель</dt><dd>${course.teacher}</dd></div>
        <div><dt>Лекций</dt><dd>${course.lessons}</dd></div>
        <div><dt>Рейтинг</dt><dd>${course.rating}</dd></div>
      </dl>
    </article>
    <aside>
      <h3>Материалы и задания</h3>
      <ul>${materials}</ul>
    </aside>
  `;
}

async function handleCourseAction(courseId) {
  state.selectedCourseId = courseId;
  renderCourseDetails();

  if (!state.user) {
    elements.authMessage.textContent = 'Чтобы записаться на курс, войдите или зарегистрируйтесь.';
    location.hash = 'auth';
    return;
  }

  if (getEnrollment(courseId)) return;

  try {
    await request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({
        userId: state.user.id,
        courseId,
        progress: 0,
      }),
    });
    await loadEnrollments();
    elements.authMessage.textContent = 'Курс добавлен в личный кабинет.';
  } catch (error) {
    elements.authMessage.textContent = 'Не удалось записаться на курс.';
  }
}

function setAuthTab(tab) {
  const isLogin = tab === 'login';
  elements.loginForm.hidden = !isLogin;
  elements.registerForm.hidden = isLogin;

  elements.authTabs.forEach((button) => {
    button.classList.toggle('active', button.dataset.authTab === tab);
  });
}

elements.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  try {
    const payload = await request('/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    await setAuthData(payload, formData.get('email'));
    elements.authMessage.textContent = 'Вход выполнен.';
    await loadEnrollments();
  } catch (error) {
    elements.authMessage.textContent = 'Не удалось войти. Проверьте email и пароль.';
  }
});

elements.registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  try {
    const payload = await request('/register', {
      method: 'POST',
      body: JSON.stringify({
        ...Object.fromEntries(formData),
        role: 'student',
      }),
    });
    await setAuthData(payload, formData.get('email'));
    elements.authMessage.textContent = 'Аккаунт создан.';
    await loadEnrollments();
  } catch (error) {
    elements.authMessage.textContent = 'Не удалось зарегистрироваться. Возможно, email уже занят.';
  }
});

elements.logoutButton.addEventListener('click', () => {
  clearAuthData();
  elements.authMessage.textContent = 'Вы вышли из аккаунта.';
  syncAuthView();
});

elements.authTabs.forEach((button) => {
  button.addEventListener('click', () => setAuthTab(button.dataset.authTab));
});

[elements.queryInput, elements.subjectSelect, elements.levelSelect, elements.priceSelect].forEach((control) => {
  control.addEventListener('input', renderCourses);
  control.addEventListener('change', renderCourses);
});

syncAuthView();
await loadCourses();
await loadEnrollments();
