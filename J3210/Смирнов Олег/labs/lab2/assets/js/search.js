let allItems = [];

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
    <div class="col-12" data-type="${item.type}">
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

function renderCards(items) {
  const list = document.getElementById('cardList');
  const count = document.getElementById('resultsCount');
  list.innerHTML = items.map(buildCard).join('');
  count.textContent = items.length;
}

function getActiveType() {
  const checked = document.querySelector('input[name="type"]:checked');
  return checked ? checked.value : 'all';
}

function applyFilters() {
  const type = getActiveType();
  const query = document.getElementById('searchInput').value.trim().toLowerCase();

  const filtered = allItems.filter(function (item) {
    const matchType = type === 'all' || item.type + 's' === type;
    const matchQuery = !query ||
      item.slug.toLowerCase().includes(query) ||
      item.task.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query);
    return matchType && matchQuery;
  });

  renderCards(filtered);
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

  // Pre-select radio and highlight nav from URL ?type=
  const typeParam = new URLSearchParams(window.location.search).get('type');
  if (typeParam === 'models' || typeParam === 'datasets') {
    const radio = document.getElementById(typeParam === 'models' ? 'typeModels' : 'typeDatasets');
    if (radio) radio.checked = true;
    const navEl = document.getElementById(typeParam === 'models' ? 'navModels' : 'navDatasets');
    if (navEl) navEl.classList.add('active');
  } else {
    document.getElementById('typeAll').checked = true;
  }

  applyFilters();

  document.querySelectorAll('input[name="type"]').forEach(function (radio) {
    radio.addEventListener('change', applyFilters);
  });

  document.getElementById('searchInput').addEventListener('input', applyFilters);
}

document.addEventListener('DOMContentLoaded', init);
