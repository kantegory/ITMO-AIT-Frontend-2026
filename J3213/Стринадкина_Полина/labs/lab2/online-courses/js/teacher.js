const API_URL = 'http://127.0.0.1:4000';

function renderTeacherProfile() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('Сначала войдите в систему');
    window.location.href = 'login.html';
    return null;
  }

  document.getElementById('teacher-name').textContent = user.name || 'Без имени';
  document.getElementById('teacher-email').textContent = user.email || '—';
  document.getElementById('teacher-role').textContent =
    user.role === 'teacher' ? 'Преподаватель' : user.role;

  return user;
}

async function loadTeacherCourses(user) {
  try {
    const res = await axios.get(API_URL + '/courses');
    const allCourses = res.data;

    const myCourses = allCourses.filter(course => course.teacherEmail === user.email);

    const container = document.getElementById('teacher-courses');
    container.innerHTML = '';

    if (myCourses.length === 0) {
      container.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <p class="mb-0">У преподавателя пока нет курсов.</p>
          </div>
        </div>
      `;
      return;
    }

    myCourses.forEach(course => {
      container.innerHTML += `
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <h5>${course.title}</h5>
            <p>Студентов: ${course.studentsCount ?? 0}</p>
            <p>Статус: ${course.status ?? 'Не указан'}</p>
            <button class="btn btn-primary btn-sm">Редактировать</button>
            <button class="btn btn-warning btn-sm">Загрузить материалы</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.id})">Удалить</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Ошибка загрузки курсов преподавателя:', error);
  }
}

async function deleteCourse(courseId) {
  const ok = confirm('Удалить курс?');
  if (!ok) return;

  try {
    await axios.delete(API_URL + '/courses/' + courseId);
    alert('Курс удалён');

    const user = JSON.parse(localStorage.getItem('user'));
    loadTeacherCourses(user);
  } catch (error) {
    console.error('Ошибка удаления курса:', error);
    alert('Не удалось удалить курс');
  }
}

const currentUser = renderTeacherProfile();
if (currentUser) {
  loadTeacherCourses(currentUser);
}