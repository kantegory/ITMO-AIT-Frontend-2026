(() => {
  const App = (window.App = window.App || {});

  const badgeMap = {
    Success: 'success',
    Failed: 'danger',
    Running: 'primary',
    Queued: 'secondary',
    Paused: 'warning'
  };

  const taskBadgeMap = {
    success: 'success',
    failed: 'danger',
    running: 'primary',
    queued: 'secondary',
    paused: 'warning'
  };

  const setTaskActive = (graph, card) => {
    graph.querySelectorAll('[data-task-card]').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    card.classList.add('active');
    card.setAttribute('aria-pressed', 'true');
  };

  const renderGraph = (graphRows = []) => {
    const graphEl = document.getElementById('pipelineGraphContent');
    if (!graphEl) return;

    graphEl.setAttribute('aria-busy', 'true');
    graphEl.innerHTML = graphRows
      .map((row, rowIndex) => {
        const rowHtml = row
          .map((task, taskIndex) => {
            const arrow = taskIndex < row.length - 1 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : '';
            const badgeClass = taskBadgeMap[task.status?.toLowerCase()] || 'secondary';
            return `
              <article class="task-card pipeline-graph__task" data-task-card role="button" tabindex="0" aria-pressed="false" aria-label="Задача ${task.name}, статус ${task.status}">
                <h3>${task.name}</h3>
                <span class="badge text-bg-${badgeClass}">${task.status}</span>
              </article>
              ${arrow}
            `;
          })
          .join('');
        return `<div class="dag-flow${rowIndex ? ' mt-3' : ''}">${rowHtml}</div>`;
      })
      .join('');
    graphEl.setAttribute('aria-busy', 'false');
  };

  const renderLogs = (logs = []) => {
    const logsEl = document.getElementById('pipelineLogsContent');
    if (!logsEl) return;

    logsEl.setAttribute('aria-busy', 'true');
    logsEl.innerHTML = logs
      .map((line) => {
        const isError = line.includes('ERROR');
        return `<p class="${isError ? 'text-body' : ''}">${line}</p>`;
      })
      .join('');
    logsEl.setAttribute('aria-busy', 'false');
  };

  const renderHistory = (runs = []) => {
    const body = document.getElementById('pipelineHistoryBody');
    if (!body) return;

    body.setAttribute('aria-busy', 'true');
    body.innerHTML = runs
      .map((run) => `
        <tr>
          <td>${run.runId}</td>
          <td>${run.startTime}</td>
          <td>${run.endTime}</td>
          <td>${run.duration}</td>
          <td><span class="badge text-bg-${badgeMap[run.status] || 'secondary'}">${run.status}</span></td>
          <td>${run.triggeredBy}</td>
        </tr>
      `)
      .join('');
    body.setAttribute('aria-busy', 'false');
  };

  const bindTaskSelection = () => {
    const graph = document.getElementById('pipelineGraphContent');
    if (!graph) return;

    graph.addEventListener('click', (event) => {
      const card = event.target.closest('[data-task-card]');
      if (!card) return;
      setTaskActive(graph, card);
    });

    graph.addEventListener('keydown', (event) => {
      const card = event.target.closest('[data-task-card]');
      if (!card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setTaskActive(graph, card);
    });
  };

  const initPipelineDetailsPage = async () => {
    const runBtn = document.getElementById('confirmRunNow');
    const retryBtn = document.getElementById('confirmRetry');
    const titleEl = document.getElementById('pipelineTitle');
    if (!titleEl) return;

    const params = new URLSearchParams(window.location.search);
    const pipelineId = Number(params.get('id')) || 1;

    try {
      const details = await App.api.getPipelineDetails(pipelineId);

      const pageHeading = document.getElementById('pipelinePageHeading');
      const descriptionEl = document.getElementById('pipelineDescription');
      const ownerEl = document.getElementById('pipelineOwner');
      const scheduleEl = document.getElementById('pipelineSchedule');
      const lastRunEl = document.getElementById('pipelineLastRun');
      const statusEl = document.getElementById('pipelineStatus');
      const runNowNameEl = document.getElementById('runNowDagName');

      if (pageHeading) pageHeading.textContent = `${details.name} details`;
      titleEl.textContent = details.name;
      if (descriptionEl) descriptionEl.textContent = details.description;
      if (ownerEl) ownerEl.textContent = details.owner;
      if (scheduleEl) scheduleEl.textContent = details.schedule;
      if (lastRunEl) lastRunEl.textContent = details.lastRun;
      if (statusEl) {
        statusEl.textContent = details.status;
        statusEl.className = `badge text-bg-${badgeMap[details.status] || 'secondary'}`;
      }
      if (runNowNameEl) runNowNameEl.textContent = details.name;

      renderGraph(details.graph);
      renderLogs(details.logs);
      renderHistory(details.runHistory);
      bindTaskSelection();
    } catch (error) {
      App.ui.showToast(`Ошибка загрузки pipeline details: ${error.message}`);
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('runNowModal')).hide();
        App.ui.showToast('DAG запущен вручную.');
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('retryModal')).hide();
        App.ui.showToast('Повтор failed задач инициирован.');
      });
    }
  };

  App.pipelineDetails = {
    init: initPipelineDetailsPage
  };
})();
