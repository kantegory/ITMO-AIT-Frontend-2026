(() => {
  const charts = {};
  const state = { period: 'week' };
  const getCurrency = () => window.TarelkaStorage.getCurrentUser()?.currency || 'EUR';
  const getPeriodLabel = (period) => ({ week: 'Последние 7 дней', month: 'Последний месяц', quarter: 'Последний квартал', year: 'Последний год' }[period]);

  function renderMetrics(data) {
    const currency = getCurrency();
    const metrics = [
      { title: 'Общий расход', value: window.TarelkaUI.formatCurrency(data.totalExpense, currency), meta: 'Сумма всех расходов за период', icon: 'arrow-down-right-circle' },
      { title: 'Общий доход', value: window.TarelkaUI.formatCurrency(data.totalIncome, currency), meta: 'Сумма поступлений за период', icon: 'arrow-up-right-circle' },
      { title: 'Крупнейшая категория', value: data.topCategory[0], meta: data.topCategory[1] ? window.TarelkaUI.formatCurrency(data.topCategory[1], currency) : 'Нет данных', icon: 'bookmark-star' },
      { title: 'Средний чек', value: window.TarelkaUI.formatCurrency(data.averageCheck, currency), meta: `${data.expenseCount} расходных операций`, icon: 'receipt' }
    ];
    document.getElementById('reportsMetrics').innerHTML = metrics.map((card) => `<div class="col-12 col-md-6 col-xl-3"><div class="card metric-card border-0 shadow-sm"><div class="card-body"><div class="d-flex justify-content-between gap-3"><div><div class="metric-card__title">${card.title}</div><div class="metric-card__value">${card.value}</div><p class="metric-card__meta">${card.meta}</p></div><div class="metric-card__icon"><i class="bi bi-${card.icon}" aria-hidden="true"></i></div></div></div></div></div>`).join('');
    document.getElementById('reportsPeriodLabel').textContent = getPeriodLabel(state.period);
    const previousDelta = data.totalIncome - data.totalExpense;
    const topCategoryText = data.topCategory[1] ? `В выбранном периоде больше всего средств ушло на категорию «${data.topCategory[0]}».` : 'Пока нет расходов в выбранном периоде.';
    const balanceText = previousDelta >= 0 ? `Доходы превышают расходы на ${window.TarelkaUI.formatCurrency(previousDelta, currency)}.` : `Расходы превышают доходы на ${window.TarelkaUI.formatCurrency(Math.abs(previousDelta), currency)}.`;
    const budgetRisk = data.budgetsProgress.filter((item) => item.limit && item.spent / item.limit >= 0.8).map((item) => item.category);
    const insights = [
      { title: 'Категории трат', text: topCategoryText },
      { title: 'Баланс периода', text: balanceText },
      { title: 'Риски по бюджетам', text: budgetRisk.length ? `Почти исчерпаны лимиты: ${budgetRisk.join(', ')}.` : 'Все бюджеты находятся в безопасной зоне.' }
    ];
    document.getElementById('reportsInsights').innerHTML = insights.map((item) => `<article class="insight-card" aria-label="${window.TarelkaUI.escapeHtml(item.title)}"><div class="insight-card__title">${item.title}</div><p class="insight-card__text">${item.text}</p></article>`).join('');
  }

  function buildOrUpdateChart(id, config) {
    if (charts[id]) { charts[id].data = config.data; charts[id].options = config.options; charts[id].update(); return charts[id]; }
    charts[id] = new Chart(document.getElementById(id), config);
    return charts[id];
  }

  function renderCharts(data) {
    buildOrUpdateChart('categoryChart', { type: 'doughnut', data: { labels: Object.keys(data.categoryTotals), datasets: [{ data: Object.values(data.categoryTotals) }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } });
    const monthlyEntries = Object.values(data.monthlyBuckets);
    buildOrUpdateChart('incomeExpenseChart', { type: 'bar', data: { labels: monthlyEntries.map((item) => item.label), datasets: [{ label: 'Доходы', data: monthlyEntries.map((item) => item.income) }, { label: 'Расходы', data: monthlyEntries.map((item) => item.expense) }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } });
    buildOrUpdateChart('trendChart', { type: 'line', data: { labels: Object.keys(data.trendMap), datasets: [{ label: 'Расходы', data: Object.values(data.trendMap), fill: false, tension: 0.35 }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
    buildOrUpdateChart('budgetsChart', { type: 'bar', data: { labels: data.budgetsProgress.map((item) => item.category), datasets: [{ label: 'Лимит', data: data.budgetsProgress.map((item) => item.limit) }, { label: 'Потрачено', data: data.budgetsProgress.map((item) => item.spent) }] }, options: { indexAxis: 'y', responsive: true, plugins: { legend: { position: 'bottom' } } } });
  }

  function renderAll() { const data = window.TarelkaStorage.getReportData(state.period); renderMetrics(data); renderCharts(data); }
  function bindPeriodButtons() { document.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => { state.period = button.dataset.period; document.querySelectorAll('[data-period]').forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); }); renderAll(); })); }
  document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.dataset.page !== 'reports') return;
    const user = await window.TarelkaStorage.initializeProtectedPage();
    if (!user) return;
    window.TarelkaUI.renderLayout();
    bindPeriodButtons();
    renderAll();
  });
})();
