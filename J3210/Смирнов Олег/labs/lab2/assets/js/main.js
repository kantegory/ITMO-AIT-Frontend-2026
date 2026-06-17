document.addEventListener('DOMContentLoaded', function () {

  // Star/Fork counter increment
  document.querySelectorAll('#starBtn, #forkBtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isStarBtn = btn.id === 'starBtn';
      const countEl = btn.querySelector(isStarBtn ? '.star-count' : '.fork-count');
      if (!countEl) return;

      const raw = countEl.textContent.replace(/[\s,]/g, '');
      let count = parseInt(raw, 10);

      if (btn.classList.contains('active')) {
        count--;
        btn.classList.remove('active');
      } else {
        count++;
        btn.classList.add('active');
      }

      countEl.textContent = count.toLocaleString();
    });
  });

  // Mobile filter toggle
  const filterToggle = document.getElementById('filterToggle');
  const filterSidebar = document.getElementById('filterSidebar');

  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', function () {
      filterSidebar.classList.toggle('show');
      const isShown = filterSidebar.classList.contains('show');
      filterToggle.innerHTML = isShown
        ? '<i class="bi bi-funnel-fill"></i> Скрыть фильтры'
        : '<i class="bi bi-funnel"></i> Показать фильтры';
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
