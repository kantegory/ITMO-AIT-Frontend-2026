document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNavbarShadow();
  initPasswordToggles();
  initSidebarTabs();
  initLogoutLinks();
  syncAuthButtons();
  syncHeaderUser();

  setupLoginForm();
  setupRegisterForm();
  setupResetPassword();
  syncTeacherOnlyLinks();

  if (document.getElementById('popularCoursesList')) {
    await initHomePage();
  }

  if (document.getElementById('catalogCoursesList')) {
    await initCatalogPage();
  }

  if (document.getElementById('profileCoursesList')) {
    await initProfilePage();
  }

  if (document.getElementById('courseTitle')) {
    await initCoursePage();
  }

  if (document.getElementById('teacherCoursesList')) {
    await initTeacherPage();
  }
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  themeToggle.checked = document.body.classList.contains('dark-theme');

  themeToggle.addEventListener('change', function () {
    document.body.classList.toggle('dark-theme', this.checked);
    localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    showToast(this.checked ? 'Тёмная тема включена' : 'Светлая тема включена', 'success');
  });
}

function initNavbarShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('shadow', window.scrollY > 30);
  });
}

function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.closest('.input-group').querySelector('input');
      const icon = this.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });
}

function initSidebarTabs() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const tabPanes = document.querySelectorAll('.profile-tab-pane');

  if (!sidebarLinks.length || !tabPanes.length) return;

  sidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      sidebarLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');

      const target = this.dataset.tab;
      tabPanes.forEach(pane => {
        pane.classList.toggle('d-none', pane.id !== target);
      });
    });
  });
}

function initLogoutLinks() {
  document.querySelectorAll('[data-logout]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      AppAPI.logout();
      showToast('Вы вышли из аккаунта', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 700);
    });
  });
}

function syncAuthButtons() {
  const user = AppAPI.getCurrentUser();

  document.querySelectorAll('[data-auth-area]').forEach(container => {
    if (!user) return;

    if (user.role === 'teacher') {
      container.innerHTML = `
        <a href="teacher.html" class="btn btn-outline-primary btn-sm">Кабинет</a>
        <a href="profile.html" class="btn btn-primary btn-sm">Профиль</a>
      `;
    } else {
      container.innerHTML = `
        <a href="profile.html" class="btn btn-outline-primary btn-sm">Профиль</a>
        <a href="#" class="btn btn-primary btn-sm" data-logout>Выйти</a>
      `;
    }
  });

  initLogoutLinks();
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      showToast('Заполните все поля', 'danger');
      return;
    }

    try {
      const user = await AppAPI.login(email, password);
      showToast('Вход выполнен успешно!', 'success');

      setTimeout(() => {
        window.location.href = user.role === 'teacher' ? 'teacher.html' : 'profile.html';
      }, 800);
    } catch (error) {
      showToast(error.message, 'danger');
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value || 'student';
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!name || !email || !password || !confirmPassword) {
      showToast('Заполните все поля', 'danger');
      return;
    }

    if (!agreeTerms) {
      showToast('Нужно принять условия использования', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Пароли не совпадают', 'danger');
      return;
    }

    if (password.length < 6) {
      showToast('Пароль должен содержать минимум 6 символов', 'danger');
      return;
    }

    try {
      const user = await AppAPI.register({
        name,
        email,
        password,
        role
      });

      showToast('Регистрация прошла успешно!', 'success');

      setTimeout(() => {
        window.location.href = user.role === 'teacher' ? 'teacher.html' : 'profile.html';
      }, 800);
    } catch (error) {
      showToast(error.message, 'danger');
    }
  });
}

function setupResetPassword() {
  const resetBtn = document.getElementById('sendResetBtn');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    const email = document.getElementById('resetEmail').value.trim();

    if (!email) {
      showToast('Введите email', 'danger');
      return;
    }

    showToast(`Письмо отправлено на ${email}`, 'success');

    const modalEl = document.getElementById('resetModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  });
}

async function initHomePage() {
  const container = document.getElementById('popularCoursesList');
  if (!container) return;

  try {
    const courses = await AppAPI.getPopularCourses(4);
    container.innerHTML = courses.map(course => renderCourseCard(course, 'home')).join('');
  } catch (error) {
    container.innerHTML = renderErrorState('Не удалось загрузить популярные курсы');
  }
}

async function initCatalogPage() {
  const container = document.getElementById('catalogCoursesList');
  if (!container) return;

  let courses = [];
  let currentSort = 'popular';

  try {
    courses = await AppAPI.getCourses();
    applyCatalogFilters();

    const searchInput = document.getElementById('courseSearch');
    const filterChecks = document.querySelectorAll('.filter-check');
    const priceRange = document.getElementById('priceRange');
    const resetBtn = document.getElementById('resetFilters');
    const sortLinks = document.querySelectorAll('.sort-option');

    if (searchInput) searchInput.addEventListener('input', applyCatalogFilters);
    filterChecks.forEach(item => item.addEventListener('change', applyCatalogFilters));

    if (priceRange) {
      priceRange.addEventListener('input', function () {
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
          priceValue.textContent = this.value === '10000'
            ? '10 000+'
            : Number(this.value).toLocaleString('ru-RU');
        }
        applyCatalogFilters();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        filterChecks.forEach(item => item.checked = false);
        if (priceRange) priceRange.value = 10000;
        const priceValue = document.getElementById('priceValue');
        if (priceValue) priceValue.textContent = '10 000+';
        currentSort = 'popular';
        const sortBtn = document.getElementById('sortDropdown');
        if (sortBtn) sortBtn.textContent = 'Сортировка';
        applyCatalogFilters();
      });
    }

    sortLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        currentSort = link.dataset.sort;
        const btn = document.getElementById('sortDropdown');
        if (btn) btn.textContent = link.textContent.trim();
        applyCatalogFilters();
      });
    });

  } catch (error) {
    container.innerHTML = renderErrorState('Не удалось загрузить каталог курсов');
  }

  function applyCatalogFilters() {
    const query = (document.getElementById('courseSearch')?.value || '').toLowerCase().trim();
    const maxPrice = Number(document.getElementById('priceRange')?.value || 10000);

    const activeSubjects = [...document.querySelectorAll('.filter-subject:checked')].map(el => el.value);
    const activeLevels = [...document.querySelectorAll('.filter-level:checked')].map(el => el.value);

    let filtered = courses.filter(course => {
      const matchTitle = course.title.toLowerCase().includes(query);
      const matchSubject = activeSubjects.length === 0 || activeSubjects.includes(course.subject);
      const matchLevel = activeLevels.length === 0 || activeLevels.includes(course.level);
      const matchPrice = course.price <= maxPrice;
      return matchTitle && matchSubject && matchLevel && matchPrice;
    });

    filtered = sortCourses(filtered, currentSort);

    container.innerHTML = filtered.length
      ? filtered.map(course => renderCourseCard(course, 'catalog')).join('')
      : renderEmptyState('По вашему запросу курсы не найдены');

    const countEl = document.getElementById('courseCount');
    if (countEl) countEl.textContent = filtered.length;
  }
}

function sortCourses(courses, mode) {
  const items = [...courses];

  switch (mode) {
    case 'rating':
      return items.sort((a, b) => b.rating - a.rating);
    case 'price-asc':
      return items.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return items.sort((a, b) => b.price - a.price);
    case 'new':
      return items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'popular':
    default:
      return items.sort((a, b) => b.students - a.students);
  }
}

async function initProfilePage() {
  const user = AppAPI.getCurrentUser();

  if (!user) {
    showToast('Сначала войдите в аккаунт', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  const avatar = document.getElementById('profileAvatar');
  const name = document.getElementById('profileName');
  const meta = document.getElementById('profileMeta');
  const coursesList = document.getElementById('profileCoursesList');

  if (avatar) avatar.textContent = getInitials(user.name);
  if (name) name.textContent = user.name;
  if (meta) meta.textContent = `${user.email} · ${user.role === 'teacher' ? 'Преподаватель' : 'Студент'} с ${formatMonthYear(user.registeredAt)}`;

  const settingsFirstName = document.getElementById('settingsFirstName');
  const settingsLastName = document.getElementById('settingsLastName');
  const settingsEmail = document.getElementById('settingsEmail');
  const settingsPhone = document.getElementById('settingsPhone');

  const nameParts = (user.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  if (settingsFirstName) settingsFirstName.value = firstName;
  if (settingsLastName) settingsLastName.value = lastName;
  if (settingsEmail) settingsEmail.value = user.email || '';
  if (settingsPhone) settingsPhone.value = user.phone || '';

  try {
    let myCourses = [];
    let enrollments = [];

    if (user.role === 'teacher') {
      const teacherCourses = await AppAPI.getTeacherCourses(user.id);
      myCourses = teacherCourses.map(course => ({
        ...course,
        enrollment: {
          completedLessons: [],
          progress: 0
        }
      }));
    } else {
      enrollments = await AppAPI.getEnrollmentsByUser(user.id);
      const allCourses = await AppAPI.getCourses();

      myCourses = enrollments
        .map(enrollment => {
          const course = allCourses.find(item => Number(item.id) === Number(enrollment.courseId));
          if (!course) return null;
          return { ...course, enrollment };
        })
        .filter(Boolean);
    }

    if (coursesList) {
      coursesList.innerHTML = myCourses.length
        ? myCourses.map(renderProfileCourseCard).join('')
        : renderEmptyState('Вы пока не записались ни на один курс');
    }

    const startedCount = document.getElementById('startedCount');
    const completedCount = document.getElementById('completedCount');
    const lessonsCount = document.getElementById('lessonsCount');

    if (user.role === 'teacher') {
    if (startedCount) startedCount.textContent = myCourses.length;
    if (completedCount) completedCount.textContent = 0;
    if (lessonsCount) lessonsCount.textContent = 0;
  } else {
    const totalCompletedLessons = enrollments.reduce((sum, item) => sum + item.completedLessons.length, 0);
    const fullyCompleted = enrollments.filter(item => item.progress === 100).length;

    if (startedCount) startedCount.textContent = enrollments.length;
    if (completedCount) completedCount.textContent = fullyCompleted;
    if (lessonsCount) lessonsCount.textContent = totalCompletedLessons;
  }
  } catch (error) {
    if (coursesList) {
      coursesList.innerHTML = renderErrorState('Не удалось загрузить данные профиля');
    }
  }

  const editProfileAvatar = document.getElementById('editProfileAvatar');
  const editProfileFullName = document.getElementById('editProfileFullName');
  const editProfileBio = document.getElementById('editProfileBio');

  if (editProfileAvatar) editProfileAvatar.textContent = getInitials(user.name);
  if (editProfileFullName) editProfileFullName.value = user.name || '';
  if (editProfileBio) editProfileBio.value = user.bio || '';

  const editProfileForm = document.getElementById('editProfileForm');
  if (editProfileForm && !editProfileForm.dataset.bound) {
    editProfileForm.dataset.bound = 'true';

    editProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedName = editProfileFullName?.value.trim() || user.name || '';
      const updatedBio = editProfileBio?.value.trim() || '';

      try {
        const savedUser = await AppAPI.updateUser(user.id, {
          name: updatedName,
          bio: updatedBio
        });

        localStorage.setItem('currentUser', JSON.stringify(savedUser));
        user.name = savedUser.name;
        user.bio = savedUser.bio;

        if (avatar) avatar.textContent = getInitials(savedUser.name);
        if (name) name.textContent = savedUser.name;
        if (meta) {
          meta.textContent = `${savedUser.email} · ${savedUser.role === 'teacher' ? 'Преподаватель' : 'Студент'} с ${formatMonthYear(savedUser.registeredAt)}`;
        }

        const headerUserName = document.getElementById('headerUserName');
        if (headerUserName) headerUserName.textContent = savedUser.name;

        const nameParts = (savedUser.name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        if (settingsFirstName) settingsFirstName.value = firstName;
        if (settingsLastName) settingsLastName.value = lastName;
        if (settingsEmail) settingsEmail.value = savedUser.email || '';

        if (editProfileAvatar) editProfileAvatar.textContent = getInitials(savedUser.name);

        showToast('Профиль обновлен', 'success');

        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();
      } catch (error) {
        showToast('Не удалось сохранить профиль', 'danger');
      }
    });
  }
}

async function initCoursePage() {
  const params = new URLSearchParams(window.location.search);
  const courseId = Number(params.get('id') || 1);

  const user = AppAPI.getCurrentUser();

  const titleEl = document.getElementById('courseTitle');
  const descEl = document.getElementById('courseDescription');
  const authorEl = document.getElementById('courseAuthor');
  const ratingEl = document.getElementById('courseRatingText');
  const studentsEl = document.getElementById('courseStudentsText');
  const durationEl = document.getElementById('courseDurationText');
  const priceEl = document.getElementById('coursePrice');
  const lessonListEl = document.getElementById('lessonList');
  const buyCourseBtn = document.getElementById('buyCourseBtn');
  const confirmBuyBtn = document.getElementById('confirmBuy');
  const buyModalCourseTitle = document.getElementById('buyModalCourseTitle');
  const buyModalCourseMeta = document.getElementById('buyModalCourseMeta');
  const commentsList = document.getElementById('commentsList');
  const commentForm = document.getElementById('commentForm');

  let course;
  let lessons = [];
  let enrollment = null;
  let activeLessonId = null;

  try {
    course = await AppAPI.getCourseById(courseId);
    lessons = await AppAPI.getLessonsByCourse(courseId);

    if (user) {
      enrollment = await AppAPI.getEnrollment(user.id, courseId);
    }

    document.title = `${course.title} - MokiichukKnowledge`;

    if (titleEl) titleEl.textContent = course.title;
    if (descEl) descEl.textContent = course.description;
    if (authorEl) authorEl.innerHTML = `Автор: <strong>${escapeHtml(course.teacherName)}</strong>`;
    if (ratingEl) ratingEl.textContent = `${course.rating} (${course.reviews} отзыва)`;
    if (studentsEl) studentsEl.innerHTML = `<i class="bi bi-people me-1"></i>${formatStudents(course.students)} студентов`;
    if (durationEl) durationEl.innerHTML = `<i class="bi bi-clock me-1"></i>${course.durationHours} часов`;
    if (priceEl) priceEl.textContent = formatPrice(course.price);
    if (buyModalCourseTitle) buyModalCourseTitle.textContent = course.title;
    if (buyModalCourseMeta) {
      buyModalCourseMeta.textContent = `${course.price === 0 ? 'Бесплатный курс' : formatPrice(course.price)} — ${lessons.length} уроков, ${course.durationHours} часа(ов) контента`;
    }

    if (lessonListEl) {
      lessonListEl.innerHTML = lessons.map((lesson, index) => `
        <div class="lesson-item ${index === 0 ? 'active' : ''} ${isLessonCompleted(enrollment, lesson.id) ? 'completed' : ''}" data-lesson-id="${lesson.id}" data-title="${escapeHtml(lesson.title)}">
          <div class="d-flex justify-content-between align-items-center">
            <span class="lesson-title">${escapeHtml(lesson.title)}</span>
            <small class="text-muted">${lesson.duration}</small>
          </div>
        </div>
      `).join('');

      activeLessonId = lessons[0] ? Number(lessons[0].id) : null;

      lessonListEl.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', () => {
          lessonListEl.querySelectorAll('.lesson-item').forEach(node => node.classList.remove('active'));
          item.classList.add('active');
          activeLessonId = Number(item.dataset.lessonId);

          const currentLessonTitle = document.getElementById('currentLessonTitle');
          if (currentLessonTitle) currentLessonTitle.textContent = item.dataset.title;
        });
      });
    }

    updateCourseProgress(lessons, enrollment);

    const comments = await AppAPI.getCommentsByCourse(courseId);
    if (commentsList) {
      commentsList.innerHTML = comments.map(renderComment).join('');
    }

    if (buyCourseBtn) {
      buyCourseBtn.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('buyModal'));
        modal.show();
      });
    }

    if (confirmBuyBtn) {
      confirmBuyBtn.addEventListener('click', async () => {
        if (!user) {
          showToast('Сначала войдите в аккаунт', 'warning');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 800);
          return;
        }

        try {
          enrollment = await AppAPI.enrollUser(user.id, courseId);
          updateCourseProgress(lessons, enrollment);
          showToast('Вы успешно записались на курс!', 'success');

          const modal = bootstrap.Modal.getInstance(document.getElementById('buyModal'));
          if (modal) modal.hide();
        } catch (error) {
          showToast('Не удалось записаться на курс', 'danger');
        }
      });
    }

    const completeBtn = document.getElementById('completeLesson');
    if (completeBtn) {
      completeBtn.addEventListener('click', async () => {
        if (!user) {
          showToast('Сначала войдите в аккаунт', 'warning');
          return;
        }

        if (!activeLessonId) return;

        try {
          if (!enrollment) {
            enrollment = await AppAPI.enrollUser(user.id, courseId);
          }

          const set = new Set(enrollment.completedLessons || []);
          set.add(activeLessonId);

          const completedLessons = [...set];
          const progress = lessons.length
            ? Math.round((completedLessons.length / lessons.length) * 100)
            : 0;

          enrollment = await AppAPI.updateEnrollment(enrollment.id, {
            completedLessons,
            progress
          });

          updateCourseProgress(lessons, enrollment);

          const activeNode = document.querySelector(`.lesson-item[data-lesson-id="${activeLessonId}"]`);
          if (activeNode) activeNode.classList.add('completed');

          showToast('Урок отмечен как пройденный!', 'success');
        } catch (error) {
          showToast('Не удалось обновить прогресс', 'danger');
        }
      });
    }

    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = document.getElementById('commentInput');
        const text = input?.value.trim();

        if (!text) {
          showToast('Введите комментарий', 'danger');
          return;
        }

        try {
          await AppAPI.addComment({
          courseId: Number(courseId),
          author: user ? user.name : 'Гость',
          text,
          createdAt: new Date().toISOString()
        });

          const comments = await AppAPI.getCommentsByCourse(courseId);
          if (commentsList) {
            commentsList.innerHTML = comments.map(renderComment).join('');
          }

          input.value = '';
          showToast('Комментарий отправлен', 'success');
          const discussionTabTrigger = document.querySelector('[href="#tabDiscussion"]');
          if (discussionTabTrigger) {
            bootstrap.Tab.getOrCreateInstance(discussionTabTrigger).show();
          }
        } catch (error) {
          showToast('Не удалось отправить комментарий', 'danger');
        }
      });
    }
  } catch (error) {
    const mainArea = document.querySelector('.section.pt-reduced .container');
    if (mainArea) {
      mainArea.innerHTML = renderErrorState('Не удалось загрузить страницу курса');
    }
  }
}

function updateCourseProgress(lessons, enrollment) {
  const progressBar = document.getElementById('courseProgressBar');
  const progressText = document.getElementById('courseProgressText');

  const progress = enrollment?.progress || 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
  }

  if (progressText) {
    progressText.textContent = `${progress}%`;
  }
}

function syncHeaderUser() {
  const user = AppAPI.getCurrentUser();
  const headerUserName = document.getElementById('headerUserName');

  if (!headerUserName || !user) return;

  headerUserName.textContent = user.name || 'Пользователь';
}

async function initTeacherPage() {
  const user = AppAPI.getCurrentUser();
  const studentsBlock = document.getElementById('teacherStudentsBlock');
  const analyticsBlock = document.getElementById('teacherAnalyticsBlock');

  if (!user || user.role !== 'teacher') {
    window.location.href = 'login.html';
    return;
  }

  const teacher = user;
  const coursesList = document.getElementById('teacherCoursesList');
  const addCourseForm = document.getElementById('addCourseForm');
  const addLessonForm = document.getElementById('addLessonForm');

  let courses = [];

  try {
    courses = await AppAPI.getTeacherCourses(teacher.id);

    const totalStudents = courses.reduce((sum, course) => {
      return sum + Number(course.students || 0);
    }, 0);

    const avgRating = courses.length
      ? (
          courses.reduce((sum, course) => sum + Number(course.rating || 0), 0) /
          courses.length
        ).toFixed(1)
      : '0.0';

    const totalRevenue = courses.reduce((sum, course) => {
      return sum + Number(course.price || 0) * Number(course.students || 0);
    }, 0);

    setText('teacherCoursesCount', courses.length);
    setText('teacherStudentsCount', formatStudents(totalStudents));
    setText('teacherRevenueCount', `${totalRevenue.toLocaleString('ru-RU')} ₽`);
    setText('teacherRatingCount', avgRating);

    if (coursesList) {
      coursesList.innerHTML = courses.length
        ? courses.map(renderTeacherCourseCard).join('')
        : renderEmptyState('У вас пока нет созданных курсов');
    }
  } catch (error) {
    if (coursesList) {
      coursesList.innerHTML = renderErrorState('Не удалось загрузить ваши курсы');
    }
  }

  if (studentsBlock) {
    if (!courses.length) {
      studentsBlock.innerHTML = renderEmptyState('У вас пока нет студентов');
    } else if (Number(teacher.id) === 2) {
      studentsBlock.innerHTML = `
        <div class="card-custom">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr class="table-header-bg">
                  <th class="border-0 ps-4 fw-bold">Студент</th>
                  <th class="border-0 fw-bold">Курс</th>
                  <th class="border-0 fw-bold">Прогресс</th>
                  <th class="border-0 fw-bold">Последняя активность</th>
                  <th class="border-0 pe-4 fw-bold"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-2">
                      <div class="comment-avatar">АМ</div>
                      <span class="fw-bold text-sm-2">Арина Миронова</span>
                    </div>
                  </td>
                  <td class="text-sm-2">Python для начинающих</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress progress-custom flex-grow-1">
                        <div class="progress-bar" style="width: 75%"></div>
                      </div>
                      <small class="fw-bold">75%</small>
                    </div>
                  </td>
                  <td><small class="text-muted">Сегодня</small></td>
                  <td class="pe-4">
                    <button class="btn btn-sm btn-outline-primary" onclick="showToast('Сообщение студенту','info')">
                      <i class="bi bi-chat-dots"></i>
                    </button>
                  </td>
                </tr>

                <tr>
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-2">
                      <div class="comment-avatar">ПК</div>
                      <span class="fw-bold text-sm-2">Павел Кулинич</span>
                    </div>
                  </td>
                  <td class="text-sm-2">JavaScript продвинутый</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress progress-custom flex-grow-1">
                        <div class="progress-bar" style="width: 40%"></div>
                      </div>
                      <small class="fw-bold">40%</small>
                    </div>
                  </td>
                  <td><small class="text-muted">Вчера</small></td>
                  <td class="pe-4">
                    <button class="btn btn-sm btn-outline-primary" onclick="showToast('Сообщение студенту','info')">
                      <i class="bi bi-chat-dots"></i>
                    </button>
                  </td>
                </tr>

                <tr>
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-2">
                      <div class="comment-avatar">ЕС</div>
                      <span class="fw-bold text-sm-2">Екатерина Смирнова</span>
                    </div>
                  </td>
                  <td class="text-sm-2">UX/UI Дизайн в Figma</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress progress-custom flex-grow-1">
                        <div class="progress-bar bg-success" style="width: 100%"></div>
                      </div>
                      <small class="fw-bold text-success">100%</small>
                    </div>
                  </td>
                  <td><small class="text-muted">3 дня назад</small></td>
                  <td class="pe-4">
                    <button class="btn btn-sm btn-outline-primary" onclick="showToast('Сообщение студенту','info')">
                      <i class="bi bi-chat-dots"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      studentsBlock.innerHTML = renderEmptyState('У вас пока нет студентов');
    }
  }

  if (analyticsBlock) {
    if (!courses.length) {
      analyticsBlock.innerHTML = renderEmptyState('У вас пока нет аналитики');
    } else if (Number(teacher.id) === 2) {
      analyticsBlock.innerHTML = `
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card-custom p-4 text-center">
              <div class="fw-bold text-primary mb-2" style="font-size: 2rem;">16.1K</div>
              <div class="text-muted">Всего студентов</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-custom p-4 text-center">
              <div class="fw-bold text-success mb-2" style="font-size: 2rem;">4.8</div>
              <div class="text-muted">Средний рейтинг</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-custom p-4 text-center">
              <div class="fw-bold text-primary mb-2" style="font-size: 2rem;">10</div>
              <div class="text-muted">Опубликованных курсов</div>
            </div>
          </div>

          <div class="col-12">
            <div class="card-custom p-4">
              <h5 class="fw-bold mb-4">Популярность курсов</h5>

              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>Веб-разработка с нуля</span>
                  <span class="fw-bold">5.6K</span>
                </div>
                <div class="progress progress-custom">
                  <div class="progress-bar" style="width: 100%"></div>
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>Английский B2</span>
                  <span class="fw-bold">3.1K</span>
                </div>
                <div class="progress progress-custom">
                  <div class="progress-bar" style="width: 55%"></div>
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>Python для начинающих</span>
                  <span class="fw-bold">2.4K</span>
                </div>
                <div class="progress progress-custom">
                  <div class="progress-bar" style="width: 43%"></div>
                </div>
              </div>

              <div class="mb-0">
                <div class="d-flex justify-content-between mb-1">
                  <span>UX/UI Дизайн в Figma</span>
                  <span class="fw-bold">1.8K</span>
                </div>
                <div class="progress progress-custom">
                  <div class="progress-bar" style="width: 32%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      analyticsBlock.innerHTML = renderEmptyState('У вас пока нет аналитики');
    }
  }

  if (addCourseForm && !addCourseForm.dataset.bound) {
    addCourseForm.dataset.bound = 'true';

    addCourseForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('newCourseTitle')?.value.trim() || '';
      const description = addCourseForm.querySelector('textarea')?.value.trim() || '';
      const selects = addCourseForm.querySelectorAll('select');
      const priceInput = addCourseForm.querySelector('input[type="number"]');

      const subjectLabel = selects[0]?.value || 'Программирование';
      const levelLabel = selects[1]?.value || 'Начальный';
      const price = Number(priceInput?.value || 0);

      const subjectMap = {
        'Программирование': 'programming',
        'Дизайн': 'design',
        'Маркетинг': 'marketing',
        'Аналитика': 'analytics',
        'Языки': 'languages',
        'Бизнес': 'business'
      };

      const levelMap = {
        'Начальный': 'beginner',
        'Средний': 'intermediate',
        'Продвинутый': 'advanced'
      };

      if (!title) {
        showToast('Введите название курса', 'danger');
        return;
      }

      try {
        await AppAPI.createCourse({
          title,
          subject: subjectMap[subjectLabel] || 'programming',
          subjectLabel,
          level: levelMap[levelLabel] || 'beginner',
          levelLabel,
          price,
          rating: 5.0,
          reviews: 0,
          students: 0,
          durationHours: 10,
          teacherId: teacher.id,
          teacherName: teacher.name,
          shortDescription: description || 'Новый курс преподавателя',
          description: description || 'Описание курса будет добавлено позже',
          gradient: 'bg-gradient-1',
          icon: 'bi-mortarboard',
          isPopular: false,
          isNew: true,
          published: true
        });

        showToast('Курс создан!', 'success');

        const modalEl = document.getElementById('addCourseModal');
        const modal = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;
        if (modal) modal.hide();

        addCourseForm.reset();
        await initTeacherPage();
      } catch (error) {
        showToast('Не удалось создать курс', 'danger');
      }
    });
  }

  if (addLessonForm && !addLessonForm.dataset.bound) {
    addLessonForm.dataset.bound = 'true';

    addLessonForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('newLessonTitle')?.value.trim() || '';

      if (!title) {
        showToast('Введите название урока', 'danger');
        return;
      }

      if (!courses.length) {
        showToast('Сначала создайте хотя бы один курс', 'warning');
        return;
      }

      try {
        const latestCourse = courses[0];

        await AppAPI.createLesson({
          courseId: latestCourse.id,
          title,
          duration: '10:00',
          order: Date.now()
        });

        showToast('Урок добавлен!', 'success');

        const modalEl = document.getElementById('addLessonModal');
        const modal = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;
        if (modal) modal.hide();

        addLessonForm.reset();
      } catch (error) {
        showToast('Не удалось добавить урок', 'danger');
      }
    });
  }
}

function renderCourseCard(course, mode = 'catalog') {
  const colClass = mode === 'home'
    ? 'col-sm-6 col-lg-3'
    : 'col-sm-6 col-xl-4';

  const priceHtml = course.price === 0
    ? `<span class="price-free">Бесплатно</span>`
    : `<span class="price-tag">${formatPrice(course.price)}</span>`;

  return `
    <div class="${colClass}">
      <a href="course.html?id=${course.id}" class="text-decoration-none">
        <div class="card card-custom h-100">
          <div class="course-img-placeholder ${course.gradient}">
            <i class="bi ${course.icon}"></i>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge-level ${getLevelBadgeClass(course.level)}">${escapeHtml(course.levelLabel)}</span>
              <div class="rating"><i class="bi bi-star-fill"></i> ${course.rating}</div>
            </div>
            <h6 class="card-title">${escapeHtml(course.title)}</h6>
            <p class="card-text">${escapeHtml(course.shortDescription)}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              ${priceHtml}
              <small class="text-muted">
                <i class="bi bi-people me-1"></i>${formatStudents(course.students)}
              </small>
            </div>
          </div>
        </div>
      </a>
    </div>
  `;
}

function renderProfileCourseCard(course) {
  const completed = course.enrollment?.completedLessons?.length || 0;
  const progress = course.enrollment?.progress || 0;

  const title = course.title || 'Курс без названия';
  const teacherName = course.teacherName || 'Преподаватель не указан';
  const gradient = course.gradient || 'bg-gradient-1';
  const icon = course.icon || 'bi-mortarboard';

  return `
    <div class="col-md-6">
      <div class="card-custom p-3 h-100">
        <div class="d-flex gap-3">
          <div class="course-img-placeholder-profile ${gradient} rounded">
            <i class="bi ${icon}"></i>
          </div>
          <div class="flex-grow-1">
            <h6 class="fw-bold mb-1 text-md-2">${escapeHtml(title)}</h6>
            <small class="text-muted">${escapeHtml(teacherName)}</small>
            <div class="progress progress-custom mt-2 progress-thin">
              <div class="progress-bar" style="width:${progress}%"></div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <small class="text-muted">${completed} уроков пройдено</small>
              <small class="fw-bold text-primary">${progress}%</small>
            </div>
          </div>
        </div>
        <a href="course.html?id=${course.id}" class="btn btn-primary btn-sm w-100 mt-3">Продолжить</a>
      </div>
    </div>
  `;
}

function renderTeacherCourseCard(course) {
  return `
    <div class="col-12">
      <div class="card-custom p-4">
        <div class="row align-items-center">
          <div class="col-auto d-none d-md-block">
            <div class="course-img-placeholder-teacher ${course.gradient} rounded">
              <i class="bi ${course.icon}"></i>
            </div>
          </div>
          <div class="col">
            <div class="d-flex align-items-center gap-2 mb-1">
              <h6 class="fw-bold mb-0">${escapeHtml(course.title)}</h6>
              <span class="badge bg-success">Опубликован</span>
            </div>
            <small class="text-muted">
              ${course.durationHours} часов · ${formatStudents(course.students)} студентов · Рейтинг ${course.rating}
            </small>
          </div>
          <div class="col-auto d-flex gap-2 mt-2 mt-md-0">
            <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-primary">Открыть</a>
            <button class="btn btn-sm btn-outline-secondary" onclick="showToast('Редактирование курса','info')">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderComment(comment) {
  return `
    <div class="comment-item">
      <div class="d-flex gap-3">
        <div class="comment-avatar">${getInitials(comment.author)}</div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>${escapeHtml(comment.author)}</strong>
            <small class="text-muted">${formatDateTime(comment.createdAt)}</small>
          </div>
          <p class="mb-0">${escapeHtml(comment.text)}</p>
        </div>
      </div>
    </div>
  `;
}

function renderEmptyState(text) {
  return `
    <div class="col-12">
      <div class="card-custom p-4 text-center text-muted">
        ${escapeHtml(text)}
      </div>
    </div>
  `;
}

function renderErrorState(text) {
  return `
    <div class="col-12">
      <div class="card-custom p-4 text-center text-danger">
        ${escapeHtml(text)}
      </div>
    </div>
  `;
}

function getLevelBadgeClass(level) {
  if (level === 'beginner') return 'badge-beginner';
  if (level === 'intermediate') return 'badge-intermediate';
  return 'badge-advanced';
}

function formatPrice(price) {
  return price === 0 ? 'Бесплатно' : `${Number(price).toLocaleString('ru-RU')} ₽`;
}

function formatStudents(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.0', '')}K`;
  }
  return String(value);
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

function isLessonCompleted(enrollment, lessonId) {
  return Boolean(
    enrollment?.completedLessons?.map(Number).includes(Number(lessonId))
  );
}

function formatMonthYear(dateString) {
  if (!dateString) return 'недавно';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  });
}

function formatDateTime(dateString) {
  if (!dateString) return 'только что';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function syncTeacherOnlyLinks() {
  const user = AppAPI.getCurrentUser();
  const teacherLinks = document.querySelectorAll('.teacher-only');

  teacherLinks.forEach(link => {
    if (user && user.role === 'teacher') {
      link.classList.remove('d-none');
    } else {
      link.classList.add('d-none');
    }
  });
}

function showToast(message, type = 'info') {
  const oldContainer = document.getElementById('toastContainer');
  if (oldContainer) oldContainer.remove();

  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '2000';

  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  toast.role = 'alert';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  container.appendChild(toast);
  document.body.appendChild(container);

  const bsToast = new bootstrap.Toast(toast, { delay: 2500 });
  bsToast.show();
}

window.showToast = showToast;