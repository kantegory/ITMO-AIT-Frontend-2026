document.addEventListener('DOMContentLoaded', function () {

  // Star/Fork counter increment
  document.querySelectorAll('#starBtn, #forkBtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isStarBtn = btn.id === 'starBtn';
      const countEl = btn.querySelector(isStarBtn ? '.star-count' : '.fork-count');
      if (!countEl) return;

      const raw = countEl.textContent.replace(/,/g, '');
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

  // Filter search results by URL parameter ?type=models or ?type=datasets
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const cards = document.querySelectorAll('[data-type]');
  const countEl = document.querySelector('.text-muted.small.mb-3');

  if (typeParam && cards.length > 0) {
    let visible = 0;
    cards.forEach(function (card) {
      if (typeParam === 'models' && card.dataset.type !== 'model') {
        card.style.display = 'none';
      } else if (typeParam === 'datasets' && card.dataset.type !== 'dataset') {
        card.style.display = 'none';
      } else {
        visible++;
      }
    });

    if (countEl) {
      countEl.textContent = 'Найдено: ' + visible;
    }

    // Pre-select radio
    if (typeParam === 'models') {
      const rModels = document.getElementById('typeModels');
      if (rModels) rModels.checked = true;
    } else if (typeParam === 'datasets') {
      const rDatasets = document.getElementById('typeDatasets');
      if (rDatasets) rDatasets.checked = true;
    }
  }

  // Radio filter click handling
  document.querySelectorAll('input[name="type"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      const selected = this.id; // typeAll, typeModels, typeDatasets
      let visible = 0;
      cards.forEach(function (card) {
        if (selected === 'typeAll') {
          card.style.display = '';
          visible++;
        } else if (selected === 'typeModels') {
          card.style.display = card.dataset.type === 'model' ? '' : 'none';
          if (card.dataset.type === 'model') visible++;
        } else if (selected === 'typeDatasets') {
          card.style.display = card.dataset.type === 'dataset' ? '' : 'none';
          if (card.dataset.type === 'dataset') visible++;
        }
      });
      if (countEl) {
        countEl.textContent = 'Найдено: ' + visible;
      }
    });
  });

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
