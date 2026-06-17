(() => {
  let integrationModal, ruleModal;
  const getCurrency = () => window.TarelkaStorage.getCurrentUser()?.currency || 'EUR';
  const formatDateTime = (value) => value ? new Intl.DateTimeFormat('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(value)) : '—';

  function renderIntegrations() {
    const items = window.TarelkaStorage.getIntegrations();
    document.getElementById('integrationsGrid').innerHTML = items.map((item) => `<div class="col-12 col-md-6 col-xl-4"><article class="integration-card" aria-label="Интеграция ${window.TarelkaUI.escapeHtml(item.service)}"><div class="integration-card__top"><div class="d-flex gap-3"><div class="integration-card__icon"><i class="bi bi-${item.icon}" aria-hidden="true"></i></div><div><div class="integration-card__title">${item.service}</div><p class="integration-card__meta">${item.description}</p>${window.TarelkaUI.statusMarkup(item.connected ? 'connected' : 'disconnected')}</div></div></div><p class="small text-secondary mb-3">Последняя синхронизация: ${formatDateTime(item.lastSync)}</p><div class="d-flex gap-2 flex-wrap"><button class="btn btn-sm btn-outline-primary" type="button" data-connect-id="${item.id}" aria-label="${item.connected ? 'Настроить интеграцию' : 'Подключить интеграцию'} ${window.TarelkaUI.escapeHtml(item.service)}">${item.connected ? 'Настроить' : 'Подключить'}</button><button class="btn btn-sm btn-outline-secondary" type="button" data-toggle-id="${item.id}" aria-label="${item.connected ? 'Отключить интеграцию' : 'Включить интеграцию'} ${window.TarelkaUI.escapeHtml(item.service)}">${item.connected ? 'Отключить' : 'Включить'}</button></div></article></div>`).join('');
    window.TarelkaUI.fillSelect(document.getElementById('integrationService'), items.map((item) => ({ value: item.id, label: item.service })));
  }

  function renderImportHistory() {
    const items = window.TarelkaStorage.getImports();
    document.getElementById('importsHistory').innerHTML = items.length ? items.map((item) => `<article class="import-history-card" aria-label="Запись истории импорта"><div class="d-flex justify-content-between flex-wrap gap-2"><div><div class="fw-semibold">${item.sourceName}</div><div class="text-secondary small">${formatDateTime(item.importedAt)}</div></div><span class="rule-pill">${item.importedCount} записей</span></div><div class="small text-secondary mt-2">Формат: ${item.format}</div></article>`).join('') : `<div class="text-secondary">Импортов пока нет. Загрузите CSV, чтобы увидеть историю.</div>`;
  }

  function renderRules() {
    const rules = window.TarelkaStorage.getImportRules();
    document.getElementById('rulesCount').textContent = rules.length;
    document.getElementById('rulesTableBody').innerHTML = rules.map((rule) => `<tr><td>${rule.conditionType === 'keyword' ? `Описание содержит «${rule.keyword}»` : `Сумма больше ${window.TarelkaUI.formatCurrency(rule.threshold, getCurrency())}`}</td><td>${rule.actionType === 'category' ? `Категория → ${rule.actionValue}` : `Метка → ${rule.actionValue}`}</td><td><span class="rule-pill">${rule.conditionType === 'keyword' ? 'Ключевое слово' : 'Порог суммы'}</span></td><td class="text-end"><button class="btn btn-sm btn-outline-danger" type="button" data-rule-delete="${rule.id}" aria-label="Удалить правило импорта">Удалить</button></td></tr>`).join('');
  }

  function fillImportAccountOptions() { window.TarelkaUI.fillSelect(document.getElementById('importAccount'), window.TarelkaStorage.getAccounts().map((account) => ({ value: account.id, label: `${account.name} · ${account.currency}` }))); }
  function parseCsv(content) { const lines = content.trim().split(/\r?\n/); const headers = lines.shift().split(',').map((value) => value.trim()); return lines.map((line) => { const cells = line.split(',').map((value) => value.trim()); return headers.reduce((acc, header, index) => { acc[header] = cells[index] || ''; return acc; }, {}); }); }

  
  function bindEvents() {
    document.getElementById('openImportRuleModal').addEventListener('click', () => ruleModal.show());
    document.getElementById('openConnectModal').addEventListener('click', () => { document.getElementById('integrationForm').reset(); document.getElementById('integrationSync').value = new Date().toISOString().slice(0,16); integrationModal.show(); });
    document.addEventListener('click', async (event) => {
      const connectBtn = event.target.closest('[data-connect-id]');
      if (connectBtn) { const integration = window.TarelkaStorage.getIntegrations().find((item) => item.id === connectBtn.dataset.connectId); if (!integration) return; document.getElementById('integrationService').value = integration.id; document.getElementById('integrationToken').value = integration.tokenPreview ? 'demo_token' : ''; document.getElementById('integrationSync').value = integration.lastSync || new Date().toISOString().slice(0,16); integrationModal.show(); }
      const toggleBtn = event.target.closest('[data-toggle-id]');
      if (toggleBtn) {
        const integration = window.TarelkaStorage.getIntegrations().find((item) => item.id === toggleBtn.dataset.toggleId);
        if (!integration) return;
        try {
          await window.TarelkaStorage.toggleIntegration(integration.id, !integration.connected); renderIntegrations(); window.TarelkaUI.showToast(integration.connected ? `Сервис ${integration.service} отключён.` : `Сервис ${integration.service} активирован.`);
        } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
      }
      const deleteRuleBtn = event.target.closest('[data-rule-delete]');
      if (deleteRuleBtn) {
        try {
          await window.TarelkaStorage.deleteImportRule(deleteRuleBtn.dataset.ruleDelete); renderRules(); window.TarelkaUI.showToast('Правило импорта удалено.');
        } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
      }
    });

    document.getElementById('integrationForm').addEventListener('submit', async (event) => {
      event.preventDefault(); const id = document.getElementById('integrationService').value; const tokenValue = document.getElementById('integrationToken').value.trim(); const syncValue = document.getElementById('integrationSync').value || new Date().toISOString().slice(0,16);
      if (!id || !tokenValue) return window.TarelkaUI.showToast('Введите сервис и токен подключения.', 'danger');
      try {
        await window.TarelkaStorage.toggleIntegration(id, true, { tokenPreview: '••••••set', lastSync: syncValue }); integrationModal.hide(); renderIntegrations(); window.TarelkaUI.showToast('Подключение сервиса сохранено.');
      } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
    });

    document.getElementById('ruleConditionType').addEventListener('change', () => { const isKeyword = document.getElementById('ruleConditionType').value === 'keyword'; document.getElementById('ruleKeywordGroup').classList.toggle('d-none', !isKeyword); document.getElementById('ruleAmountGroup').classList.toggle('d-none', isKeyword); });
    document.getElementById('ruleForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = { conditionType: document.getElementById('ruleConditionType').value, keyword: document.getElementById('ruleKeyword').value.trim(), threshold: document.getElementById('ruleAmount').value, actionType: document.getElementById('ruleActionType').value, actionValue: document.getElementById('ruleActionValue').value.trim() };
      if (payload.conditionType === 'keyword' && !payload.keyword) return window.TarelkaUI.showToast('Введите ключевое слово для правила.', 'danger');
      if (payload.conditionType === 'amount' && Number(payload.threshold) <= 0) return window.TarelkaUI.showToast('Введите корректный порог суммы.', 'danger');
      if (!payload.actionValue) return window.TarelkaUI.showToast('Введите действие для правила.', 'danger');
      try {
        await window.TarelkaStorage.addImportRule(payload); document.getElementById('ruleForm').reset(); document.getElementById('ruleKeywordGroup').classList.remove('d-none'); document.getElementById('ruleAmountGroup').classList.add('d-none'); ruleModal.hide(); renderRules(); window.TarelkaUI.showToast('Новое правило импорта добавлено.');
      } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
    });

    document.getElementById('importForm').addEventListener('submit', async (event) => {
      event.preventDefault(); const file = document.getElementById('importFile').files[0]; const accountId = document.getElementById('importAccount').value; const format = document.getElementById('importFormat').value;
      if (!file) return window.TarelkaUI.showToast('Выберите CSV‑файл для импорта.', 'danger');
      if (!accountId) return window.TarelkaUI.showToast('Выберите счёт для импорта.', 'danger');
      try {
        const imported = await window.TarelkaStorage.importTransactions(parseCsv(await file.text()), accountId, format, file.name); renderImportHistory(); window.TarelkaUI.showToast(`Импортировано ${imported.length} записей.`);
      } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
    });

    document.getElementById('useSampleImportBtn').addEventListener('click', async () => {
      const accountId = document.getElementById('importAccount').value;
      if (!accountId) return window.TarelkaUI.showToast('Сначала выберите счёт для импорта.', 'warning');
      try {
        const imported = await window.TarelkaStorage.importTransactions(parseCsv(window.TarelkaData.sampleImportCsv), accountId, 'csv', 'sample-transactions.csv'); renderImportHistory(); window.TarelkaUI.showToast(`Тестовый CSV обработан: ${imported.length} записей добавлено.`);
      } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.dataset.page !== 'integrations') return;
    const user = await window.TarelkaStorage.initializeProtectedPage();
    if (!user) return;
    window.TarelkaUI.renderLayout();
    integrationModal = new bootstrap.Modal('#integrationModal');
    ruleModal = new bootstrap.Modal('#ruleModal');
    fillImportAccountOptions(); renderIntegrations(); renderImportHistory(); renderRules(); bindEvents();
  });
})();
