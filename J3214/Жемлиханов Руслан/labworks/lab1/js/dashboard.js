(() => {
  const App = (window.App = window.App || {});

  const renderConnections = (items) => {
    const list = document.getElementById('connectionsList');
    if (!list) return;

    list.innerHTML = items
      .map((item) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${item.name}
          <button class="btn btn-sm btn-outline-danger" data-delete-item data-entity="connection" data-id="${item.id}">Удалить</button>
        </li>
      `)
      .join('');
  };

  const renderVariables = (items) => {
    const list = document.getElementById('variablesList');
    if (!list) return;

    list.innerHTML = items
      .map((item) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>${item.key}</strong>: ${item.value}</span>
          <button class="btn btn-sm btn-outline-danger" data-delete-item data-entity="variable" data-id="${item.id}">Удалить</button>
        </li>
      `)
      .join('');
  };

  const initDashboardPage = async () => {
    const connectionForm = document.getElementById('addConnectionForm');
    const variableForm = document.getElementById('addVariableForm');
    const dashboardNotificationsList = document.getElementById('dashboardNotificationsList');
    const connectionsList = document.getElementById('connectionsList');
    const variablesList = document.getElementById('variablesList');

    if (!dashboardNotificationsList && !connectionsList && !variablesList) return;

    try {
      const notifications = await App.api.getNotifications();
      App.ui.renderNotifications(dashboardNotificationsList, 'dashboard', notifications);
    } catch {
      App.ui.renderNotifications(dashboardNotificationsList, 'dashboard');
    }

    const loadDashboardData = async () => {
      try {
        const [connections, variables] = await Promise.all([
          App.api.getConnections(),
          App.api.getVariables()
        ]);

        renderConnections(connections);
        renderVariables(variables);
      } catch (error) {
        App.ui.showToast(`Ошибка загрузки данных dashboard: ${error.message}`);
      }
    };

    await loadDashboardData();

    if (connectionForm) {
      connectionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('connectionName');
        const name = input.value.trim();
        if (!name) return;

        try {
          await App.api.createConnection({ name });
          input.value = '';
          bootstrap.Modal.getOrCreateInstance(document.getElementById('addConnectionModal')).hide();
          await loadDashboardData();
          App.ui.showToast('Соединение добавлено.');
        } catch (error) {
          App.ui.showToast(`Ошибка добавления: ${error.message}`);
        }
      });
    }

    if (variableForm) {
      variableForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const key = document.getElementById('varKey');
        const val = document.getElementById('varValue');
        if (!key.value.trim() || !val.value.trim()) return;

        try {
          await App.api.createVariable({
            key: key.value.trim(),
            value: val.value.trim()
          });
          key.value = '';
          val.value = '';
          bootstrap.Modal.getOrCreateInstance(document.getElementById('addVariableModal')).hide();
          await loadDashboardData();
          App.ui.showToast('Переменная добавлена.');
        } catch (error) {
          App.ui.showToast(`Ошибка добавления: ${error.message}`);
        }
      });
    }

    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-delete-item]');
      if (!btn) return;
      if (!window.confirm('Удалить элемент?')) return;

      const id = btn.dataset.id;
      const entity = btn.dataset.entity;

      try {
        if (entity === 'connection') {
          await App.api.deleteConnection(id);
        }
        if (entity === 'variable') {
          await App.api.deleteVariable(id);
        }
        await loadDashboardData();
        App.ui.showToast('Элемент удален.');
      } catch (error) {
        App.ui.showToast(`Ошибка удаления: ${error.message}`);
      }
    });
  };

  App.dashboard = {
    init: initDashboardPage
  };
})();
