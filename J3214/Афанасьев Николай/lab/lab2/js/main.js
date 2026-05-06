(function () {
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function getInitials(f, l) { return ((f || '').charAt(0) + (l || '').charAt(0)).toUpperCase() || '??'; }

  function initAuthGuard() {
    const file = window.location.pathname.split('/').pop() || '';
    const session = api.getSession();
    const guarded  = new Set(['dashboard.html', 'courses.html', 'course.html', 'settings.html', 'teacher.html']);
    const authOnly = new Set(['login.html', 'register.html']);
    if (guarded.has(file) && !session) { window.location.href = 'login.html'; return; }
    if (authOnly.has(file) && session) {
      window.location.href = session.role === 'teacher' ? 'teacher.html' : 'dashboard.html';
    }
  }

  function initNavActive() {
    const file = window.location.pathname.split('/').pop() || '';
    qsa('.nav-item[href]').forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href') || '';
      if (href && href !== '#' && href.endsWith(file)) a.classList.add('active');
    });
  }

  function initLogout() {
    qsa('[data-logout]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        api.clearSession();
        window.location.href = 'login.html';
      });
    });
  }

  function initLogin() {
    const form = qs('#loginForm');
    if (!form) return;

    window.togglePass = function () {
      const p = qs('#passInput');
      if (p) p.type = p.type === 'password' ? 'text' : 'password';
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = (qs('#emailInput')?.value || '').trim();
      const password = (qs('#passInput')?.value  || '').trim();
      if (!email || !password) { alert('Заполните все поля!'); return; }

      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Входим…';
      btn.disabled = true;

      try {
        const users = await api.get(`/users?email=${encodeURIComponent(email)}`);
        const user  = users.find(u => u.password === password);
        if (!user) { alert('Неверный email или пароль'); return; }
        const session = api.setSession(user);
        window.location.href = session.role === 'teacher' ? 'teacher.html' : 'dashboard.html';
      } catch {
        alert('Не удалось подключиться к серверу. Убедитесь, что json-server запущен (npm start).');
      } finally {
        btn.textContent = 'Войти';
        btn.disabled = false;
      }
    });
  }

  function initRegister() {
    if (!qs('.register-card')) return;

    let selectedRole = 'student';

    window.selectRole = function (role) {
      selectedRole = role;
      qs('#role-student')?.classList.toggle('active', role === 'student');
      qs('#role-teacher')?.classList.toggle('active', role === 'teacher');
    };

    window.checkStrength = function (pass) {
      const fill  = qs('#strengthFill');
      const label = qs('#strengthLabel');
      if (!fill || !label) return;
      if (!pass.length) { fill.style.width = '0'; label.textContent = ''; return; }
      let score = 0;
      if (pass.length > 5) score++;
      if (pass.length > 8) score++;
      if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
      const idx = Math.max(0, score - 1);
      fill.style.width      = ['33%', '66%', '100%'][idx];
      fill.style.background = ['#ff4d4d', '#ffd11a', '#2ecc71'][idx];
      label.textContent     = ['Слабый', 'Средний', 'Надежный'][idx];
    };

    window.togglePass = window.togglePass || function () {
      const p = qs('#passInput');
      if (p) p.type = p.type === 'password' ? 'text' : 'password';
    };

    window.handleRegister = async function () {
      const firstName = (qs('#reg-name')?.value     || '').trim();
      const lastName  = (qs('#reg-lastname')?.value || '').trim();
      const email     = (qs('#reg-email')?.value    || '').trim();
      const password  = (qs('#passInput')?.value    || '').trim();
      const agree     = qs('#agreeCheck')?.checked;

      if (!firstName || !lastName || !email || !password) {
        alert('Пожалуйста, заполните все поля'); return;
      }
      if (!agree) { alert('Необходимо согласиться с условиями'); return; }

      try {
        const existing = await api.get(`/users?email=${encodeURIComponent(email)}`);
        if (existing.length > 0) { alert('Пользователь с таким email уже существует'); return; }

        const user    = await api.post('/users', { firstName, lastName, email, password, role: selectedRole, about: '' });
        const session = api.setSession(user);
        window.location.href = session.role === 'teacher' ? 'teacher.html' : 'dashboard.html';
      } catch {
        alert('Не удалось подключиться к серверу. Убедитесь, что json-server запущен (npm start).');
      }
    };
  }

  async function initDashboard() {
    if (!qs('#myCoursesGrid')) return;
    const session = api.getSession();
    if (!session) return;

    const welcomeTitle = qs('.welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `Привет, ${session.firstName}!`;

    const avatar = qs('.avatar');
    if (avatar) avatar.textContent = getInitials(session.firstName, session.lastName);

    const banner = qs('.banner');
    if (banner) banner.style.display = session.role === 'teacher' ? 'none' : '';

    try {
      const [enrollments, certs] = await Promise.all([
        api.get(`/enrollments?userId=${session.userId}`),
        api.get(`/certificates?userId=${session.userId}`),
      ]);

      const enriched = await Promise.all(
        enrollments.map(async e => {
          const course = await api.get(`/courses/${e.courseId}`);
          return { ...e, course };
        })
      );

      const statCourses = qs('#stat-courses');
      const statCerts   = qs('#stat-certs');
      if (statCourses) statCourses.textContent = enrollments.length;
      if (statCerts)   statCerts.textContent   = certs.length;

      const grid = qs('#myCoursesGrid');
      grid.innerHTML = '';
      if (enriched.length === 0) {
        grid.innerHTML = '<div class="col-12"><p style="color:#888;font-size:14px;">Вы ещё не записаны ни на один курс. <a href="courses.html" style="color:#534AB7;">Найти курсы →</a></p></div>';
      } else {
        enriched.forEach(e => {
          const pct = Math.round((e.completedLessons / e.totalLessons) * 100);
          const col = document.createElement('div');
          col.className = 'col-md-4';
          col.innerHTML = `
            <div class="course-card-teacher" onclick="location.href='course.html?courseId=${e.courseId}'" style="cursor:pointer;padding:15px;">
              <div class="course-thumb" style="background:${e.course?.thumbBg||'#edeaf8'};height:100px;display:flex;align-items:center;justify-content:center;font-size:40px;border-radius:12px;margin-bottom:12px;">${e.course?.emoji||'📚'}</div>
              <div style="font-size:13px;font-weight:500;color:#222;margin-bottom:4px;">${e.course?.title||'Курс'}</div>
              <div style="font-size:12px;color:#888;">Урок ${e.completedLessons} из ${e.totalLessons}</div>
              <div class="progress-bar-custom"><div class="progress-fill" style="width:${pct}%;"></div></div>
              <div class="d-flex justify-content-between align-items-center">
                <span style="font-size:12px;color:#534AB7;font-weight:500;">${pct}%</span>
                <span style="font-size:12px;color:#534AB7;">Продолжить →</span>
              </div>
            </div>`;
          grid.appendChild(col);
        });
      }

      const certsContainer = qs('#certsContainer');
      if (certsContainer) {
        certsContainer.innerHTML = '';
        if (certs.length === 0) {
          certsContainer.innerHTML = '<p style="color:#888;font-size:14px;">Сертификатов пока нет</p>';
        } else {
          certs.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'cert-card';
            const dateStr = new Date(cert.issuedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            card.innerHTML = `
              <div class="cert-icon">🏆</div>
              <div style="flex:1;">
                <div style="font-size:14px;font-weight:500;color:#222;">${cert.courseTitle}</div>
                <div style="font-size:12px;color:#888;">Выдан ${dateStr}</div>
              </div>
              <span class="badge-pill" style="background:#e1f5ee;color:#0F6E56;">Получен</span>`;
            certsContainer.appendChild(card);
          });
        }
      }
    } catch {
      alert('Ошибка загрузки данных. Убедитесь, что json-server запущен (npm start).');
    }
  }

  async function initCatalog() {
    const grid = qs('#coursesGrid');
    if (!grid) return;

    let allCourses = [];

    function formatPrice(price) {
      return price ? new Intl.NumberFormat('ru-RU').format(price) + ' ₽' : 'Бесплатно';
    }

    function render(courses) {
      grid.innerHTML = '';
      const info = qs('#resultsInfo');
      if (info) info.textContent = `Найдено ${courses.length} курсов`;

      courses.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col-md-4 course-item';
        col.innerHTML = `
          <div class="course-card" role="button" tabindex="0">
            <div class="course-thumb" style="background:${c.thumbBg};">${c.emoji}</div>
            <div style="padding:14px;">
              <div style="margin-bottom:8px;"><span class="badge-level">${c.level}</span></div>
              <div style="font-size:14px;font-weight:700;color:#222;margin-bottom:4px;">${c.title}</div>
              <div style="font-size:12px;color:#888;margin-bottom:8px;">${c.author} · ${c.lessons} уроков</div>
              <div style="margin-bottom:8px;"><span class="tag">${c.subject}</span></div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="rating">★ ${c.rating.toFixed(1)}</span>
                <span class="price">${formatPrice(c.price)}</span>
              </div>
            </div>
          </div>`;

        function openCourse() {
          window.location.href = `course.html?courseId=${c.id}`;
        }
        const card = col.querySelector('.course-card');
        card.addEventListener('click', openCourse);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCourse(); });

        grid.appendChild(col);
      });
    }

    function applyFilter() {
      const search  = (qs('#searchInput')?.value  || '').trim().toLowerCase();
      const subject = qs('#filterSubject')?.value || '';
      const level   = qs('#filterLevel')?.value   || '';
      const price   = qs('#filterPrice')?.value   || '';

      const filtered = allCourses.filter(c => {
        const hay = `${c.title} ${c.subject} ${c.author}`.toLowerCase();
        if (search && !hay.includes(search)) return false;
        if (subject && c.subject !== subject) return false;
        if (level   && c.level   !== level)   return false;
        if (price === 'free' && c.price !== 0) return false;
        if (price === '1000' && c.price > 1000) return false;
        if (price === '3000' && c.price > 3000) return false;
        return true;
      });
      render(filtered);
    }

    window.filterCourses = applyFilter;
    qs('#searchInput')?.addEventListener('input', applyFilter);
    qs('#filterSubject')?.addEventListener('change', applyFilter);
    qs('#filterLevel')?.addEventListener('change', applyFilter);
    qs('#filterPrice')?.addEventListener('change', applyFilter);
    qs('#clearFiltersBtn')?.addEventListener('click', () => {
      ['#searchInput','#filterSubject','#filterLevel','#filterPrice'].forEach(sel => {
        const el = qs(sel); if (el) el.value = '';
      });
      applyFilter();
    });

    const info = qs('#resultsInfo');
    if (info) info.textContent = 'Загрузка…';

    try {
      allCourses = await api.get('/courses?status=published');
      render(allCourses);
    } catch {
      if (info) info.textContent = 'Ошибка загрузки. Убедитесь, что json-server запущен.';
    }
  }

  async function initCoursePage() {
    if (!qs('[data-course-tabs]')) return;

    window.showTab = function (tabName, btnEl) {
      qsa('.tab-btn').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      qsa('[id^="tab-"]').forEach(p => (p.style.display = 'none'));
      const panel = qs('#tab-' + tabName);
      if (panel) panel.style.display = '';
    };

    const params   = new URLSearchParams(window.location.search);
    const courseId = parseInt(params.get('courseId'));
    if (!courseId) return;

    const session = api.getSession();

    function renderLessonList(course, completedCount) {
      const list = qs('#lesson-list');
      if (!list) return;
      list.innerHTML = '';
      const total = Math.max(course.lessons || 5, 1);
      const show  = Math.min(total, 6);
      for (let i = 1; i <= show; i++) {
        const done    = completedCount >= i;
        const current = completedCount + 1 === i;
        const item = document.createElement('div');
        item.className = `lesson-item${done ? ' done' : current ? ' active' : ''}`;
        item.innerHTML = `
          <div class="lesson-num${done ? ' done' : ''}">${done ? '✓' : i}</div>
          <div>
            <div style="font-size:13px;color:${current ? '#534AB7' : '#222'};font-weight:${current ? '500' : '400'};">Урок ${i}</div>
            <div style="font-size:11px;color:#aaa;">~15 мин</div>
          </div>`;
        list.appendChild(item);
      }
      if (total > show) {
        const more = document.createElement('div');
        more.style.cssText = 'font-size:12px;color:#888;padding:8px 4px;';
        more.textContent = `+ ещё ${total - show} уроков`;
        list.appendChild(more);
      }
    }

    try {
      const course = await api.get(`/courses/${courseId}`);

      document.title = `LearnFlow — ${course.title}`;

      const sidebarTitle = qs('#course-sidebar-title');
      if (sidebarTitle) sidebarTitle.textContent = course.title;

      const pageTitle = qs('#course-page-title');
      if (pageTitle) pageTitle.textContent = course.title;

      const pageDesc = qs('#course-page-desc');
      if (pageDesc) pageDesc.textContent = course.description || `Курс по теме «${course.subject}». Уровень: ${course.level}. ${course.lessons} уроков.`;

      const videoLabel = qs('#course-video-label');
      if (videoLabel) videoLabel.textContent = course.title;

      let enrollment = null;
      if (session) {
        const list = await api.get(`/enrollments?userId=${session.userId}&courseId=${courseId}`);
        enrollment = list[0] || null;
      }

      if (enrollment) {
        const total = enrollment.totalLessons || course.lessons || 1;
        const done  = enrollment.completedLessons || 0;
        const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

        const progressText = qs('#course-sidebar-progress-text');
        if (progressText) progressText.textContent = `Урок ${done} из ${total} · ${pct}%`;

        const progressFill = qs('#course-sidebar-progress-fill');
        if (progressFill) progressFill.style.width = pct + '%';

        renderLessonList(course, done);
      } else {
        const progressText = qs('#course-sidebar-progress-text');
        if (progressText) progressText.textContent = `${course.lessons || 0} уроков · ещё не начат`;

        renderLessonList(course, 0);

        const videoPlayer = qs('.video-player');
        if (videoPlayer) videoPlayer.style.display = 'none';

        const price = course.price
          ? new Intl.NumberFormat('ru-RU').format(course.price) + ' ₽'
          : 'Бесплатно';

        const cta = document.createElement('div');
        cta.id = 'enroll-section';
        cta.innerHTML = `
          <div style="background:#f8f7fd;border:1px solid #e8e6f5;border-radius:12px;padding:20px;margin-top:16px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
              <div style="font-size:40px;">${course.emoji || '📚'}</div>
              <div>
                <div style="font-size:15px;font-weight:600;color:#222;">${course.title}</div>
                <div style="font-size:12px;color:#888;">${course.subject} · ${course.level} · ${course.lessons} уроков · ★ ${(course.rating||0).toFixed(1)}</div>
              </div>
            </div>
            <div style="font-size:22px;font-weight:700;color:#534AB7;margin-bottom:14px;">${price}</div>
            <button id="enroll-btn" class="btn-purple" style="width:100%;padding:12px;font-size:14px;">Записаться на курс</button>
          </div>`;
        qs('#tab-materials')?.appendChild(cta);

        qs('#enroll-btn')?.addEventListener('click', async () => {
          if (!session) { window.location.href = 'login.html'; return; }
          const btn = qs('#enroll-btn');
          btn.textContent = 'Записываем…';
          btn.disabled = true;
          try {
            await api.post('/enrollments', {
              userId: session.userId,
              courseId,
              completedLessons: 0,
              totalLessons: course.lessons || 10,
            });
            window.location.reload();
          } catch {
            alert('Ошибка записи на курс.');
            btn.textContent = 'Записаться на курс';
            btn.disabled = false;
          }
        });
      }
    } catch { /* */ }
  }

  async function initSettings() {
    if (!qs('#set-name')) return;
    const session = api.getSession();
    if (!session) return;

    try {
      const user = await api.get(`/users/${session.userId}`);
      qs('#set-name').value     = user.firstName || '';
      qs('#set-lastname').value = user.lastName  || '';
      qs('#set-email').value    = user.email     || '';
      qs('#set-about').value    = user.about     || '';
      const av = qs('#avatar-preview');
      if (av) av.textContent = getInitials(user.firstName, user.lastName);
    } catch {
      qs('#set-name').value     = session.firstName || '';
      qs('#set-lastname').value = session.lastName  || '';
      qs('#set-email').value    = session.email     || '';
    }

    window.saveProfileSettings = async function () {
      const firstName = qs('#set-name').value.trim();
      const lastName  = qs('#set-lastname').value.trim();
      const email     = qs('#set-email').value.trim();
      const about     = qs('#set-about').value.trim();
      try {
        await api.patch(`/users/${session.userId}`, { firstName, lastName, email, about });
        localStorage.setItem('session', JSON.stringify({ ...session, firstName, lastName, email }));
        const av = qs('#avatar-preview');
        if (av) av.textContent = getInitials(firstName, lastName);
        alert('Настройки профиля сохранены!');
      } catch {
        alert('Ошибка сохранения. Убедитесь, что json-server запущен.');
      }
    };
  }

  async function initTeacher() {
    if (!window.location.pathname.includes('teacher.html')) return;
    const session = api.getSession();
    if (!session) return;

    window.openModal  = () => { const m = qs('#createModal'); if (m) m.style.display = 'flex'; };
    window.closeModal = () => { const m = qs('#createModal'); if (m) m.style.display = 'none'; };

    window.saveNewCourse = async function () {
      const title   = (qs('#modal-title')?.value  || '').trim();
      const subject = qs('#modal-subject')?.value || 'Программирование';
      const level   = qs('#modal-level')?.value   || 'Начинающий';
      if (!title) { alert('Введите название!'); return; }

      try {
        const course = await api.post('/courses', {
          title, subject, level,
          authorId: session.userId,
          author: `${session.firstName} ${session.lastName}`,
          status: 'draft',
          price: 0, lessons: 0, rating: 0, emoji: '📚', thumbBg: '#edeaf8',
        });
        appendCourseCard(course);
        if (qs('#modal-title')) qs('#modal-title').value = '';
        window.closeModal();
      } catch {
        alert('Ошибка создания курса. Убедитесь, что json-server запущен.');
      }
    };

    function appendCourseCard(course) {
      const container = qs('#courses-container');
      if (!container) return;

      const isDraft = course.status !== 'published';
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      col.id = `course-card-${course.id}`;
      col.innerHTML = `
        <div class="course-card-teacher" style="padding:16px;">
          <div class="d-flex justify-content-between mb-3">
            <div style="width:40px;height:40px;background:#f0eefb;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">${course.emoji || '📚'}</div>
            <span class="badge-pill status-label" style="background:${isDraft ? '#f5f4fb' : '#e3f9e5'};color:${isDraft ? '#534AB7' : '#1f7a33'};">${isDraft ? 'Черновик' : 'Опубликован'}</span>
          </div>
          <div style="font-weight:700;color:#222;margin-bottom:4px;">${course.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:15px;">${course.subject} • ${course.level}</div>
          <div class="d-flex gap-2">
            <button class="btn-action publish-btn" style="flex:1;background:#e3f9e5;color:#1f7a33;display:${isDraft ? 'block' : 'none'};">Опубликовать</button>
            <button class="btn-action delete-btn" style="flex:1;background:#fff1f0;color:#e24b4a;border:1px solid #ffccc7;">Удалить</button>
          </div>
        </div>`;

      col.querySelector('.publish-btn').addEventListener('click', () => publishCourse(course.id, col));
      col.querySelector('.delete-btn').addEventListener('click',  () => deleteCourse(course.id,  col));
      container.appendChild(col);
    }

    async function publishCourse(id, colEl) {
      try {
        await api.patch(`/courses/${id}`, { status: 'published' });
        const label = colEl.querySelector('.status-label');
        if (label) { label.textContent = 'Опубликован'; label.style.background = '#e3f9e5'; label.style.color = '#1f7a33'; }
        const btn = colEl.querySelector('.publish-btn');
        if (btn) btn.style.display = 'none';
      } catch { alert('Ошибка публикации.'); }
    }

    async function deleteCourse(id, colEl) {
      if (!confirm('Удалить курс?')) return;
      try {
        await api.del(`/courses/${id}`);
        colEl.remove();
      } catch { alert('Ошибка удаления.'); }
    }

    try {
      const courses = await api.get(`/courses?authorId=${session.userId}`);
      courses.forEach(c => appendCourseCard(c));
    } catch {
      alert('Ошибка загрузки курсов. Убедитесь, что json-server запущен.');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAuthGuard();
    initNavActive();
    initLogout();
    initLogin();
    initRegister();
    initDashboard();
    initCatalog();
    initCoursePage();
    initSettings();
    initTeacher();
  });
})();
