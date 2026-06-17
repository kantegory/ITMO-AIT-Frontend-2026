(() => {
  const STORAGE_REGISTERED_USER = 'floworchestrator_registered_user';
  const STORAGE_CURRENT_USER = 'floworchestrator_current_user';

  const readStorage = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  };

  const showToast = (message) => {
    const toastEl = document.getElementById('actionToast');
    const body = document.getElementById('toastBody');
    if (!toastEl || !body || !window.bootstrap) return;
    body.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  };

  const notificationsFeed = [
    { severity: 'critical', text: 'Pipeline daily_sales_etl failed' },
    { severity: 'warning', text: 'SLA missed for customer_sync' },
    { severity: 'warning', text: 'Worker capacity is near limit' },
    { severity: 'info', text: 'Connection restored' }
  ];

  const severityBadgeClass = (severity) => {
    if (severity === 'critical') return 'danger';
    if (severity === 'warning') return 'warning';
    return 'success';
  };

  const severityLabel = (severity) => {
    if (severity === 'critical') return 'Critical';
    if (severity === 'warning') return 'Warning';
    return 'Info';
  };

  const renderNotifications = (listEl, mode) => {
    if (!listEl) return;
    listEl.innerHTML = notificationsFeed.map((item) => {
      const badge = `<span class="badge text-bg-${severityBadgeClass(item.severity)}">${severityLabel(item.severity)}</span>`;
      if (mode === 'dashboard') {
        return `<li class="list-group-item d-flex align-items-center gap-2 small">${badge}<span>${item.text}</span></li>`;
      }
      return `<li class="list-group-item" data-severity="${item.severity}">${badge} ${item.text}</li>`;
    }).join('');
  };

  const initCurrentUserUI = () => {
    const currentUser = readStorage(STORAGE_CURRENT_USER);
    if (!currentUser || !currentUser.name) return;

    document.querySelectorAll('[data-current-user-name]').forEach((el) => {
      el.textContent = currentUser.name;
    });

    document.querySelectorAll('[data-current-user-greeting]').forEach((el) => {
      el.textContent = currentUser.name.split(' ')[0];
    });
  };

  const initLoginPage = () => {
    const loginButton = document.getElementById('loginButton');
    const loginField = document.getElementById('loginField');
    if (!loginButton || !loginField) return;

    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      const loginValue = loginField.value.trim();
      if (!loginValue) {
        loginField.focus();
        return;
      }

      const registered = readStorage(STORAGE_REGISTERED_USER);
      const loginLower = loginValue.toLowerCase();
      const registeredEmail = (registered?.email || '').toLowerCase();
      const registeredName = (registered?.name || '').toLowerCase();
      const looksLikeEmail = loginValue.includes('@');
      const nameFromLogin = looksLikeEmail ? loginValue.split('@')[0] : loginValue;
      const resolvedName =
        loginLower === registeredEmail || loginLower === registeredName
          ? (registered?.name || nameFromLogin)
          : nameFromLogin;

      const user = {
        name: resolvedName,
        email: looksLikeEmail ? loginValue : (registered?.email || ''),
        team: registered?.team || ''
      };

      writeStorage(STORAGE_CURRENT_USER, user);
      window.location.href = 'dashboard.html';
    });
  };

  const initPasswordToggle = () => {
    document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const isPassword = target.type === 'password';
        target.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? 'Скрыть' : 'Показать';
      });
    });
  };

  const initRegisterValidation = () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const regPassword = document.getElementById('regPassword');
      const confirmPassword = document.getElementById('confirmPassword');
      const regPasswordError = document.getElementById('regPasswordError');
      const confirmPasswordError = document.getElementById('confirmPasswordError');

      regPasswordError.textContent = '';
      confirmPasswordError.textContent = '';

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      let valid = true;
      if (regPassword.value.length < 6) {
        regPassword.classList.add('is-invalid');
        regPasswordError.textContent = 'Пароль должен быть не менее 6 символов.';
        valid = false;
      } else {
        regPassword.classList.remove('is-invalid');
      }

      if (regPassword.value !== confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        confirmPasswordError.textContent = 'Пароли не совпадают.';
        valid = false;
      } else {
        confirmPassword.classList.remove('is-invalid');
      }

      if (valid) {
        const user = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          team: document.getElementById('team').value.trim()
        };
        writeStorage(STORAGE_REGISTERED_USER, user);
        writeStorage(STORAGE_CURRENT_USER, user);

        showToast('Регистрация успешно выполнена. Можно войти в систему.');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 900);
      }
    });
  };

  const createPipelineRows = (items) => {
    const body = document.getElementById('pipelinesTableBody');
    if (!body) return;

    if (!items.length) {
      body.innerHTML = '<tr><td colspan="7" class="text-center py-4">Ничего не найдено по выбранным фильтрам.</td></tr>';
      return;
    }

    body.innerHTML = items.map((p) => {
      const badgeMap = {
        Success: 'success',
        Failed: 'danger',
        Running: 'primary',
        Queued: 'secondary',
        Paused: 'warning'
      };
      return `
        <tr>
          <td>${p.name}</td>
          <td>${p.description}</td>
          <td>${p.owner}</td>
          <td><span class="badge text-bg-${badgeMap[p.status] || 'secondary'}">${p.status}</span></td>
          <td>${p.lastRun}</td>
          <td>${p.nextRun}</td>
          <td><a href="pipeline-details.html" class="btn btn-sm btn-outline-primary">Open</a></td>
        </tr>
      `;
    }).join('');
  };

  const initPipelinesPage = () => {
    const form = document.getElementById('pipelineFilters');
    if (!form) return;

    const pipelines = [
      { name: 'daily_sales_etl', description: 'Daily sales extraction and loading', owner: 'Data Team', status: 'Success', lastRun: '2026-03-14 08:00', nextRun: '2026-03-15 08:00', active: true },
      { name: 'customer_sync', description: 'Sync customer profile changes', owner: 'Analytics Team', status: 'Failed', lastRun: '2026-03-14 07:30', nextRun: '2026-03-14 13:30', active: true },
      { name: 'inventory_update', description: 'Update stock snapshots per region', owner: 'Platform Team', status: 'Running', lastRun: '2026-03-14 09:10', nextRun: '2026-03-14 10:10', active: true },
      { name: 'marketing_report_build', description: 'Build campaign performance mart', owner: 'Data Team', status: 'Queued', lastRun: '2026-03-13 23:00', nextRun: '2026-03-14 10:30', active: true },
      { name: 'fraud_detection_batch', description: 'Batch scoring for suspicious events', owner: 'Ivan Petrov', status: 'Paused', lastRun: '2026-03-13 04:15', nextRun: '2026-03-14 11:00', active: false }
    ];

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
      showToast('Фильтры применены.');
    });

    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        filtered = [...pipelines];
        createPipelineRows(filtered);
        showToast('Фильтры сброшены.');
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

  const initDashboardPage = () => {
    const connectionForm = document.getElementById('addConnectionForm');
    const variableForm = document.getElementById('addVariableForm');
    const dashboardNotificationsList = document.getElementById('dashboardNotificationsList');

    renderNotifications(dashboardNotificationsList, 'dashboard');

    if (connectionForm) {
      connectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('connectionName');
        if (!input.value.trim()) return;
        const list = document.getElementById('connectionsList');
        list.insertAdjacentHTML('beforeend', `<li class="list-group-item d-flex justify-content-between align-items-center">${input.value.trim()} <button class="btn btn-sm btn-outline-primary" data-delete-item>Удалить</button></li>`);
        input.value = '';
        bootstrap.Modal.getOrCreateInstance(document.getElementById('addConnectionModal')).hide();
        showToast('Соединение добавлено.');
      });
    }

    if (variableForm) {
      variableForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = document.getElementById('varKey');
        const val = document.getElementById('varValue');
        if (!key.value.trim() || !val.value.trim()) return;
        const list = document.getElementById('variablesList');
        list.insertAdjacentHTML('beforeend', `<li class="list-group-item d-flex justify-content-between align-items-center"><span><strong>${key.value.trim()}</strong>: ${val.value.trim()}</span><button class="btn btn-sm btn-outline-primary" data-delete-item>Удалить</button></li>`);
        key.value = '';
        val.value = '';
        bootstrap.Modal.getOrCreateInstance(document.getElementById('addVariableModal')).hide();
        showToast('Переменная добавлена.');
      });
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-delete-item]');
      if (!btn) return;
      const row = btn.closest('li');
      if (!row) return;
      if (window.confirm('Удалить элемент?')) {
        row.remove();
        showToast('Элемент удален.');
      }
    });
  };

  const initPipelineDetailsPage = () => {
    const runBtn = document.getElementById('confirmRunNow');
    const retryBtn = document.getElementById('confirmRetry');

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('runNowModal')).hide();
        showToast('DAG запущен вручную.');
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('retryModal')).hide();
        showToast('Повтор failed задач инициирован.');
      });
    }

    document.querySelectorAll('[data-task-card]').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('[data-task-card]').forEach((item) => item.classList.remove('active'));
        card.classList.add('active');
      });
    });
  };

  const initMonitoringPage = () => {
    const severityFilter = document.getElementById('severityFilter');
    const notificationsList = document.getElementById('notificationsList');
    const markReadBtn = document.getElementById('markRead');

    renderNotifications(notificationsList, 'monitoring');

    const notifications = document.querySelectorAll('#notificationsList .list-group-item');

    if (severityFilter) {
      severityFilter.addEventListener('change', () => {
        const value = severityFilter.value;
        notifications.forEach((n) => {
          n.classList.toggle('hidden', value !== 'all' && n.dataset.severity !== value);
        });
      });
    }

    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        notifications.forEach((n) => n.classList.add('read'));
        showToast('Уведомления помечены как прочитанные.');
      });
    }

    const bars = document.querySelectorAll('[data-resource-bar]');
    if (bars.length) {
      setInterval(() => {
        bars.forEach((bar) => {
          const next = Math.floor(Math.random() * 71) + 20;
          bar.style.width = `${next}%`;
          bar.textContent = `${next}%`;
        });
      }, 3500);
    }
  };

  const initLogoutConfirm = () => {
    document.addEventListener('click', (e) => {
      const logoutLink = e.target.closest('[data-logout]');
      if (!logoutLink) return;
      if (!window.confirm('Выйти из аккаунта?')) {
        e.preventDefault();
        return;
      }
      localStorage.removeItem(STORAGE_CURRENT_USER);
    });
  };

  initCurrentUserUI();
  initPasswordToggle();
  initLoginPage();
  initRegisterValidation();
  initPipelinesPage();
  initDashboardPage();
  initPipelineDetailsPage();
  initMonitoringPage();
  initLogoutConfirm();
})();
