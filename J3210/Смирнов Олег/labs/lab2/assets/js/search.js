let allItems = [];
let activeTags = new Set();
let currentType = '';

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function buildCard(item) {
  const isModel = item.type === 'model';
  const badge2 = isModel
    ? '<span class="badge badge-framework">' + item.framework + '</span>'
    : '<span class="badge badge-license">' + item.license + '</span>';

  return '<div class="col-12">' +
    '<div class="card"><div class="card-body">' +
    '<h5 class="card-title mb-1"><a href="' + (isModel ? 'model' : 'dataset') + '.html">' + item.slug + '</a></h5>' +
    '<p class="card-text small mb-2">' + item.description + '</p>' +
    '<div class="d-flex flex-wrap gap-1 mb-2"><span class="badge badge-task">' + item.task + '</span>' + badge2 + '</div>' +
    '<div class="d-flex gap-3 text-muted small">' +
    '<span><i class="bi bi-star-fill text-warning"></i> ' + formatCount(item.stars) + '</span>' +
    '<span><i class="bi bi-download"></i> ' + formatCount(item.downloads) + '</span>' +
    '</div></div></div></div>';
}

function renderTagFilters() {
  var tagFiltersEl = document.getElementById('tagFilters');
  var tags = new Set();
  allItems.forEach(function (item) {
    if (item.task) tags.add(item.task);
    if (currentType === 'models' && item.framework) tags.add(item.framework);
    if (currentType === 'datasets' && item.license) tags.add(item.license);
  });

  tagFiltersEl.innerHTML = '';
  tags.forEach(function (tag) {
    var btn = document.createElement('button');
    btn.className = 'badge tag-filter-btn ' + (activeTags.has(tag) ? 'badge-task' : 'badge-muted');
    btn.textContent = tag;
    btn.addEventListener('click', function () {
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
      renderTagFilters();
      applyFilters();
    });
    tagFiltersEl.appendChild(btn);
  });
}

function applyFilters() {
  var query = document.getElementById('searchInput').value.trim().toLowerCase();
  var sort = document.getElementById('sortSelect').value;

  var filtered = allItems.filter(function (item) {
    // Жёсткая фильтрация по типу
    if (currentType === 'models' && item.type !== 'model') return false;
    if (currentType === 'datasets' && item.type !== 'dataset') return false;

    var matchQuery = !query ||
      item.slug.toLowerCase().indexOf(query) !== -1 ||
      item.task.toLowerCase().indexOf(query) !== -1 ||
      item.author.toLowerCase().indexOf(query) !== -1;
    var matchTags = activeTags.size === 0 ||
      [item.task, item.framework, item.license].some(function (t) { return t && activeTags.has(t); });
    return matchQuery && matchTags;
  });

  if (sort === 'stars') filtered.sort(function (a, b) { return b.stars - a.stars; });
  else if (sort === 'downloads') filtered.sort(function (a, b) { return b.downloads - a.downloads; });

  document.getElementById('cardList').innerHTML = filtered.map(buildCard).join('');
  document.getElementById('resultsCount').textContent = filtered.length;
}

document.addEventListener('DOMContentLoaded', function () {
  // 1) Читаем тип из URL
  currentType = new URLSearchParams(window.location.search).get('type') || '';

  // 2) Сразу ставим заголовок и active-класс
  if (currentType === 'models') {
    document.getElementById('pageTitle').textContent = 'Модели';
    document.getElementById('navModels').classList.add('active');
  } else if (currentType === 'datasets') {
    document.getElementById('pageTitle').textContent = 'Датасеты';
    document.getElementById('navDatasets').classList.add('active');
  }

  // 3) Грузим данные
  var loadData;
  if (currentType === 'models') {
    loadData = getModels().then(function (models) {
      return models.map(function (m) { m.type = 'model'; return m; });
    });
  } else if (currentType === 'datasets') {
    loadData = getDatasets().then(function (datasets) {
      return datasets.map(function (d) { d.type = 'dataset'; return d; });
    });
  } else {
    loadData = Promise.all([getModels(), getDatasets()]).then(function (res) {
      var models = res[0].map(function (m) { m.type = 'model'; return m; });
      var datasets = res[1].map(function (d) { d.type = 'dataset'; return d; });
      return models.concat(datasets);
    });
  }

  loadData.then(function (items) {
    allItems = items;
    renderTagFilters();
    applyFilters();
  }).catch(function () {
    document.getElementById('cardList').innerHTML =
      '<p class="text-danger">Не удалось загрузить данные. Убедитесь, что json-server запущен.</p>';
  });

  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  document.getElementById('searchInput').addEventListener('input', applyFilters);
});
