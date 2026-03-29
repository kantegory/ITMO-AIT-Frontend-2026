document.addEventListener('DOMContentLoaded', function () {

  // Star/Fork counter increment
  document.querySelectorAll('#starBtn, #forkBtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isStarBtn = btn.id === 'starBtn';
      var countEl = btn.querySelector(isStarBtn ? '.star-count' : '.fork-count');
      if (!countEl) return;

      var raw = countEl.textContent.replace(/,/g, '');
      var count = parseInt(raw, 10);

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
  var filterToggle = document.getElementById('filterToggle');
  var filterSidebar = document.getElementById('filterSidebar');

  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', function () {
      filterSidebar.classList.toggle('show');
      var isShown = filterSidebar.classList.contains('show');
      filterToggle.innerHTML = isShown
        ? '<i class="bi bi-funnel-fill"></i> Скрыть фильтры'
        : '<i class="bi bi-funnel"></i> Показать фильтры';
    });
  }

  // Filter search results by URL parameter ?type=models or ?type=datasets
  var params = new URLSearchParams(window.location.search);
  var typeParam = params.get('type');
  var cards = document.querySelectorAll('[data-type]');
  var countEl = document.querySelector('.text-muted.small.mb-3');

  if (typeParam && cards.length > 0) {
    var visible = 0;
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
      var r = document.getElementById('typeModels');
      if (r) r.checked = true;
    } else if (typeParam === 'datasets') {
      var r = document.getElementById('typeDatasets');
      if (r) r.checked = true;
    }
  }

  // Radio filter click handling
  document.querySelectorAll('input[name="type"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var selected = this.id; // typeAll, typeModels, typeDatasets
      var visible = 0;
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
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
