let allItems = [];
let activeTags = new Set();

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function getTypeParam() {
  return new URLSearchParams(window.location.search).get('type') || '';
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

function renderTagFilters(typeParam) {
  const tagFiltersEl = document.getElementById('tagFilters');
  const tags = new Set();
  allItems.forEach(function (item) {
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
      renderTagFilters(typeParam);
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
    if (typeParam === 'models' && item.type !== 'model') return false;
    if (typeParam === 'datasets' && item.type !== 'dataset') return false;
    const matchQuery = !query ||
      item.slug.toLowerCase().includes(query) ||
      item.task.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query);
    const matchTags = activeTags.size === 0 ||
      [item.task, item.framework, item.license].some(function (t) { return t && activeTags.has(t); });
    return matchQuery && matchTags;
  });

  if (sort === 'stars') filtered.sort(function (a, b) { return b.stars - a.stars; });
  else if (sort === 'downloads') filtered.sort(function (a, b) { return b.downloads - a.downloads; });

  const list = document.getElementById('cardList');
  const count = document.getElementById('resultsCount');
  list.innerHTML = filtered.map(buildCard).join('');
  count.textContent = filtered.length;
}

async function init() {
  const typeParam = getTypeParam();

  // Грузим ТОЛЬКО нужный тип — не оба
  try {
    if (typeParam === 'models') {
      const models = await getModels();
      allItems = models.map(function (m) { return Object.assign({}, m, { type: 'model' }); });
    } else if (typeParam === 'datasets') {
      const datasets = await getDatasets();
      allItems = datasets.map(function (d) { return Object.assign({}, d, { type: 'dataset' }); });
    } else {
      const [models, datasets] = await Promise.all([getModels(), getDatasets()]);
      allItems = [
        ...models.map(function (m) { return Object.assign({}, m, { type: 'model' }); }),
        ...datasets.map(function (d) { return Object.assign({}, d, { type: 'dataset' }); }),
      ];
    }
  } catch {
    document.getElementById('cardList').innerHTML =
      '<p class="text-danger">Не удалось загрузить данные. Убедитесь, что json-server запущен.</p>';
    return;
  }

  renderTagFilters(typeParam);
  applyFilters();

  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  document.getElementById('searchInput').addEventListener('input', applyFilters);
}

document.addEventListener('DOMContentLoaded', init);
