const API_URL = 'http://127.0.0.1:4000';

function getCourseId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<p>Нет данных</p>';
    return;
  }

  items.forEach(item => {
    const p = document.createElement('p');
    p.textContent = item;
    container.appendChild(p);
  });
}

function renderDiscussion(items) {
  const container = document.getElementById('discussion');
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<p>Нет обсуждений</p>';
    return;
  }

  items.forEach(item => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${item.author}:</strong> ${item.text}`;
    container.appendChild(p);
  });
}

async function loadCourse() {
  const id = getCourseId();
  console.log('ID курса:', id);

  if (!id) return;

  try {
    const res = await axios.get(`${API_URL}/courses/${id}`);
    const course = res.data;

    document.getElementById('course-title').textContent = course.title;
    document.getElementById('course-teacher').textContent = `Преподаватель: ${course.teacher}`;
    document.getElementById('course-description').textContent = course.description;
    document.getElementById('course-price').textContent = `Цена: ${course.price}`;

    if (course.video) {
      document.getElementById('course-video').src = course.video;
    }

    document.getElementById('course-duration').textContent = `Длительность курса: ${course.duration || '—'}`;
    document.getElementById('course-lessons').textContent = `Количество уроков: ${course.lessonsCount || '—'}`;
    document.getElementById('course-format').textContent = `Формат: ${course.format || '—'}`;
    document.getElementById('course-level').textContent = `Уровень: ${course.level || '—'}`;
    document.getElementById('course-category').textContent = `Категория: ${course.category || '—'}`;

    renderList(course.materials, 'materials');
    renderList(course.tasks, 'tasks');
    renderDiscussion(course.discussion);

  } catch (err) {
    console.error('Ошибка загрузки курса:', err);
  }
}

loadCourse();