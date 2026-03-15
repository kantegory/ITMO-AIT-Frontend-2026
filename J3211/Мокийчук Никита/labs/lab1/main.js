document.addEventListener('DOMContentLoaded', function () {

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 30) {
        navbar.classList.add('shadow');
      } else {
        navbar.classList.remove('shadow');
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      if (email && password) {
        showToast('Вход выполнен успешно!', 'success');
        setTimeout(() => { window.location.href = 'profile.html'; }, 1000);
      } else {
        showToast('Заполните все поля', 'danger');
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;

      if (!name || !email || !password || !confirmPassword) {
        showToast('Заполните все поля', 'danger');
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
      showToast('Регистрация прошла успешно!', 'success');
      setTimeout(() => { window.location.href = 'profile.html'; }, 1000);
    });
  }

  const searchInput = document.getElementById('courseSearch');
  const filterChecks = document.querySelectorAll('.filter-check');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const courseCards = document.querySelectorAll('.course-card-item');

  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }
  if (filterChecks.length > 0) {
    filterChecks.forEach(check => check.addEventListener('change', filterCourses));
  }
  if (priceRange) {
    priceRange.addEventListener('input', function () {
      if (priceValue) priceValue.textContent = this.value === '10000' ? '10 000+' : Number(this.value).toLocaleString('ru-RU');
      filterCourses();
    });
  }

  function filterCourses() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const activeSubjects = [];
    const activeLevels = [];
    document.querySelectorAll('.filter-subject:checked').forEach(c => activeSubjects.push(c.value));
    document.querySelectorAll('.filter-level:checked').forEach(c => activeLevels.push(c.value));
    const maxPrice = priceRange ? parseInt(priceRange.value) : 99999;

    courseCards.forEach(card => {
      const title = card.dataset.title || '';
      const subject = card.dataset.subject || '';
      const level = card.dataset.level || '';
      const price = parseInt(card.dataset.price || '0');

      const matchSearch = title.toLowerCase().includes(query);
      const matchSubject = activeSubjects.length === 0 || activeSubjects.includes(subject);
      const matchLevel = activeLevels.length === 0 || activeLevels.includes(level);
      const matchPrice = price <= maxPrice;

      card.style.display = (matchSearch && matchSubject && matchLevel && matchPrice) ? '' : 'none';
    });

    const visible = document.querySelectorAll('.course-card-item:not([style*="display: none"])');
    const countEl = document.getElementById('courseCount');
    if (countEl) countEl.textContent = visible.length;
  }

  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      filterChecks.forEach(c => c.checked = false);
      if (priceRange) {
        priceRange.value = 10000;
        if (priceValue) priceValue.textContent = '10 000+';
      }
      courseCards.forEach(card => card.style.display = '');
      const countEl = document.getElementById('courseCount');
      if (countEl) countEl.textContent = courseCards.length;
    });
  }

  const lessonItems = document.querySelectorAll('.lesson-item');
  lessonItems.forEach(item => {
    item.addEventListener('click', function () {
      lessonItems.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const title = this.dataset.title || 'Урок';
      const lessonTitle = document.getElementById('currentLessonTitle');
      if (lessonTitle) lessonTitle.textContent = title;
      showToast('Загружен: ' + title, 'info');
    });
  });

  const completeBtn = document.getElementById('completeLesson');
  if (completeBtn) {
    completeBtn.addEventListener('click', function () {
      const active = document.querySelector('.lesson-item.active');
      if (active) {
        active.classList.add('completed');
        showToast('Урок отмечен как пройденный!', 'success');

        const total = document.querySelectorAll('.lesson-item').length;
        const completed = document.querySelectorAll('.lesson-item.completed').length;
        const pct = Math.round((completed / total) * 100);
        const progressBar = document.getElementById('courseProgressBar');
        const progressText = document.getElementById('courseProgressText');
        if (progressBar) {
          progressBar.style.width = pct + '%';
          progressBar.setAttribute('aria-valuenow', pct);
        }
        if (progressText) progressText.textContent = pct + '%';
      }
    });
  }

  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.getElementById('commentInput');
      const text = input.value.trim();
      if (!text) return;

      const commentsList = document.getElementById('commentsList');
      const html = `
        <div class="comment-item">
          <div class="d-flex gap-3">
            <div class="comment-avatar">Я</div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong>Вы</strong>
                <small class="text-muted">Только что</small>
              </div>
              <p class="mb-0" style="font-size:0.92rem">${escapeHtml(text)}</p>
            </div>
          </div>
        </div>`;
      commentsList.insertAdjacentHTML('afterbegin', html);
      input.value = '';
      showToast('Комментарий добавлен', 'success');
    });
  }

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

  const sortLinks = document.querySelectorAll('.sort-option');
  sortLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const sortBy = this.dataset.sort;
      const btn = document.getElementById('sortDropdown');
      if (btn) btn.textContent = this.textContent;
      showToast('Сортировка: ' + this.textContent, 'info');
    });
  });

});

function showToast(message, type) {
  type = type || 'info';
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-circle-fill'
  };

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi ${icons[type] || icons.info} me-2"></i>${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}