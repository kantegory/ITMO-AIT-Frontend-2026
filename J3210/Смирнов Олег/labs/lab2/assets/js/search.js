let allItems = [];
let activeTags = new Set();

const TYPE_TITLES = { models: 'Модели', datasets: 'Датасеты' };

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function buildCard(item) {
  const isModel = item.type === 'model';
  const badge2 = isModel
    ? `<span class="badge badge-framework">${item.framework}</span>`
    : `<span class="badge badge-license">${item.license}</span>`;

  return `
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-1">
            <a href="${isModel ? 'model' : 'dataset'}.html">${item.slug}</a>
          </h5>
          <p class="card-text small mb-2">${item.description}</p>
          <div class="d-flex flex-wrap gap-1 mb-2">
            <span class="badge badge-task">${item.task}</span>
            ${badge2}
          </div>
          <div class="d-flex gap-3 text-muted small">
            <span><i class="bi bi-star-fill text-warning"></i> ${formatCount(item.stars)}</span>
            <span><i class="bi bi-download"></i> ${formatCount(item.downloads)}</span>
          </div>
        </div>
      </div>
    </div>`;
}

function getTypeParam() {
  return new URLSearchParams(window.location.search).get('type') || '';
}

function renderTagFilters(sourceItems, typeParam) {
  const tagFiltersEl = document.getElementById('tagFilters');
  const tags = new Set();
  sourceItems.forEach(function (item) {
    if (item.task) tags.add(item.task);
    if (typeParam === 'models' && item.framework) tags.add(item.framework);
    if (typeParam === 'datasets' && item.license) tags.add(item.license);
  });

  tagFiltersEl.innerHTML = '';
  tags.forEach(function (tag) {
    const btn = document.createElement('button');
    btn.className = 'badge tag-filter-btn ' + (activeTags.has(tag) ? 'badge-task' : 'badge-muted');
    btn.textContent = tag;
    btn.addEventListener('click', function () {
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
      renderTagFilters(sourceItems, typeParam);
      applyFilters();
    });
    tagFiltersEl.appendChild(btn);
  });
}

function applyFilters() {
  const typeParam = getTypeParam();
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const sort = document.getElementById('sortSelect').value;

  let filtered = allItems.filter(function (item) {
    let matchType = true;
    if (typeParam === 'models') matchType = item.type === 'model';
    else if (typeParam === 'datasets') matchType = item.type === 'dataset';
    const matchQuery = !query ||
      item.slug.toLowerCase().includes(query) ||
      item.task.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query);
    const matchTags = activeTags.size === 0 ||
      [item.task, item.framework, item.license].some(function (t) { return t && activeTags.has(t); });
    return matchType && matchQuery && matchTags;
  });

  if (sort === 'stars') filtered.sort(function (a, b) { return b.stars - a.stars; });
  else if (sort === 'downloads') filtered.sort(function (a, b) { return b.downloads - a.downloads; });

  const list = document.getElementById('cardList');
  const count = document.getElementById('resultsCount');
  list.innerHTML = filtered.map(buildCard).join('');
  count.textContent = filtered.length;
}

async function init() {
  let models, datasets;
  try {
    [models, datasets] = await Promise.all([getModels(), getDatasets()]);
  } catch {
    document.getElementById('cardList').innerHTML =
      '<p class="text-danger">Не удалось загрузить данные. Убедитесь, что json-server запущен (<code>npx json-server db.json</code>).</p>';
    return;
  }

  allItems = [
    ...models.map(function (m) { return Object.assign({}, m, { type: 'model' }); }),
    ...datasets.map(function (d) { return Object.assign({}, d, { type: 'dataset' }); }),
  ];

  const typeParam = getTypeParam();

  // Заголовок страницы
  const titleEl = document.getElementById('pageTitle');
  if (titleEl && TYPE_TITLES[typeParam]) titleEl.textContent = TYPE_TITLES[typeParam];

  // Подсветка активного пункта navbar
  const navEl = document.getElementById(typeParam === 'models' ? 'navModels' : typeParam === 'datasets' ? 'navDatasets' : null);
  if (navEl) navEl.classList.add('active');

  // Тег-фильтры строим только из элементов нужного типа
  const typeItems = allItems.filter(function (item) {
    return !typeParam || item.type + 's' === typeParam;
  });
  renderTagFilters(typeItems, typeParam);

  applyFilters();

  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  document.getElementById('searchInput').addEventListener('input', applyFilters);
}

document.addEventListener('DOMContentLoaded', init);
