(() => {
  const App = (window.App = window.App || {});

  const badgeMap = {
    Success: 'success',
    Failed: 'danger',
    Running: 'primary',
    Queued: 'secondary',
    Paused: 'warning'
  };

  const createPipelineRows = (items) => {
    const body = document.getElementById('pipelinesTableBody');
    if (!body) return;

    if (!items.length) {
      body.innerHTML = '<tr><td colspan="7" class="text-center py-4">Ничего не найдено по выбранным фильтрам.</td></tr>';
      return;
    }

    body.innerHTML = items
      .map((p) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.description}</td>
          <td>${p.owner}</td>
          <td><span class="badge text-bg-${badgeMap[p.status] || 'secondary'}">${p.status}</span></td>
          <td>${p.lastRun}</td>
          <td>${p.nextRun}</td>
          <td><a href="pipeline-details.html?id=${p.id}" class="btn btn-sm btn-outline-primary">Open</a></td>
        </tr>
      `)
      .join('');
  };

  const initPipelinesPage = async () => {
    const form = document.getElementById('pipelineFilters');
    if (!form) return;

    let pipelines = [];
    try {
      pipelines = await App.api.getPipelines();
    } catch (error) {
      createPipelineRows([]);
      App.ui.showToast(`Не удалось загрузить пайплайны: ${error.message}`);
      return;
    }

    let sortedAsc = false;
    let filtered = [...pipelines];
    createPipelineRows(filtered);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const search = document.getElementById('searchName').value.trim().toLowerCase();
      const status = document.getElementById('statusFilter').value;
      const owner = document.getElementById('ownerFilter').value;
      const lastRun = document.getElementById('lastRunFilter').value;
      const onlyActive = document.getElementById('onlyActive').checked;

      filtered = pipelines.filter((p) => {
        const byName = p.name.toLowerCase().includes(search);
        const byStatus = status ? p.status === status : true;
        const byOwner = owner ? p.owner === owner : true;
        const byDate = lastRun ? p.lastRun.startsWith(lastRun) : true;
        const byActive = onlyActive ? p.active : true;
        return byName && byStatus && byOwner && byDate && byActive;
      });

      createPipelineRows(filtered);
      App.ui.showToast('Фильтры применены.');
    });

    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        filtered = [...pipelines];
        createPipelineRows(filtered);
        App.ui.showToast('Фильтры сброшены.');
      });
    }

    const sortBtn = document.getElementById('sortLastRun');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        filtered.sort((a, b) => {
          const first = new Date(a.lastRun.replace(' ', 'T'));
          const second = new Date(b.lastRun.replace(' ', 'T'));
          return sortedAsc ? first - second : second - first;
        });
        sortedAsc = !sortedAsc;
        createPipelineRows(filtered);
      });
    }
  };

  App.pipelines = {
    init: initPipelinesPage
  };
})();
