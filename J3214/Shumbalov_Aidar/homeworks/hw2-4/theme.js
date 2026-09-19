(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const searchInput = document.getElementById('courseSearch');
  const levelInputs = document.querySelectorAll('input[name="level"]');
  const cards = document.querySelectorAll('.course-card');
  const resultCount = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  function getCurrentTheme() {
    const explicitTheme = root.getAttribute('data-theme');
    if (explicitTheme) return explicitTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeButton() {
    themeToggle.setAttribute('aria-pressed', String(getCurrentTheme() === 'dark'));
  }

  function toggleTheme() {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    syncThemeButton();
  }

  function getSelectedLevel() {
    const selected = document.querySelector('input[name="level"]:checked');
    return selected ? selected.value : 'all';
  }

  function filterCourses() {
    const query = searchInput.value.trim().toLowerCase();
    const level = getSelectedLevel();
    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.dataset.title || '';
      const cardLevel = card.dataset.level || '';
      const isVisible = title.includes(query) && (level === 'all' || cardLevel === level);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    resultCount.textContent = `Найдено ${visibleCount} ${getCourseWord(visibleCount)}`;
    emptyState.hidden = visibleCount !== 0;
  }

  function getCourseWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'курс';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'курса';
    return 'курсов';
  }

  syncThemeButton();
  themeToggle.addEventListener('click', toggleTheme);
  searchInput.addEventListener('input', filterCourses);
  levelInputs.forEach((input) => input.addEventListener('change', filterCourses));
})();
