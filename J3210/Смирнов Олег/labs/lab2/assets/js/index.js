function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function buildPopularCard(item, isModel) {
  const href = isModel ? 'pages/data/model.html' : 'pages/data/dataset.html';
  const badge2 = isModel
    ? `<span class="badge badge-framework">${item.framework}</span>`
    : `<span class="badge badge-license">${item.license}</span>`;

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title"><a href="${href}">${item.slug}</a></h5>
          <p class="card-text small">${item.description}</p>
          <div class="d-flex flex-wrap gap-1 mb-3">
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

async function initIndex() {
  try {
    const [models, datasets] = await Promise.all([getModels(), getDatasets()]);

    const topModels = models.slice().sort((a, b) => b.stars - a.stars).slice(0, 3);
    const topDatasets = datasets.slice().sort((a, b) => b.stars - a.stars).slice(0, 3);

    const modelsGrid = document.getElementById('popularModelsGrid');
    const datasetsGrid = document.getElementById('popularDatasetsGrid');

    if (modelsGrid) modelsGrid.innerHTML = topModels.map(m => buildPopularCard(m, true)).join('');
    if (datasetsGrid) datasetsGrid.innerHTML = topDatasets.map(d => buildPopularCard(d, false)).join('');
  } catch {
    // сервер недоступен — секции остаются пустыми
  }
}

document.addEventListener('DOMContentLoaded', initIndex);
