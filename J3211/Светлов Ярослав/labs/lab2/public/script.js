const $ = selector => document.querySelector(selector);
const SESSION_KEY = 'nexus_lab2_session';
let session = null;
let chart = null;
let routeVersion = 0;
let nextMessage = '';
try {
  const saved = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (saved?.accessToken && saved?.user?.id) session = saved;
} catch {
  localStorage.removeItem(SESSION_KEY);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function message(text, type = 'danger') {
  $('#message').textContent = text;
  $('#message').className = `alert alert-${type}`;
  $('#message').hidden = !text;
}

function clearSession() {
  session = null;
  localStorage.removeItem(SESSION_KEY);
  document.querySelectorAll('form').forEach(form => form.reset());
}

function handleError(error) {
  if (error.status === 401 && session) {
    clearSession();
    nextMessage = 'Сессия истекла. Войдите снова.';
    location.hash = '#login';
  } else {
    message(error.message);
  }
}

async function api(url, method = 'GET', body, authenticated = true) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (authenticated && session) headers.Authorization = `Bearer ${session.accessToken}`;
  let response;
  try {
    response = await fetch(url, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    throw new Error('Сервер недоступен. Проверьте, что запущена команда npm start, и повторите действие.');
  }
  const data = await response.json();
  if (!response.ok) {
    const translations = {
      'Email already exists': 'Этот email уже зарегистрирован.',
      'Cannot find user': 'Неверный email или пароль.',
      'Incorrect password': 'Неверный email или пароль.',
      'Email format is invalid': 'Проверьте формат email.',
      'Password is too short': 'Пароль слишком короткий.'
    };
    const fallback = response.status === 403 ? 'Недостаточно прав для этого действия.' : 'Не удалось выполнить запрос.';
    const error = new Error(translations[data] || (typeof data === 'string' && /[а-яА-Я]/.test(data) ? data : fallback));
    error.status = response.status;
    throw error;
  }
  return data;
}

function experimentLink(experiment) {
  return `<a href="#experiment/${encodeURIComponent(experiment.id)}">${escapeHtml(experiment.name)}</a>`;
}

function experimentsTable(experiments) {
  if (!experiments.length) return '<p>Эксперименты не найдены.</p>';
  return `<div class="table-responsive"><table class="table table-striped">
    <thead><tr><th>Эксперимент</th><th>Дата</th><th>Тег</th><th>Accuracy</th><th>Latency, мс</th></tr></thead>
    <tbody>${experiments.map(item => `<tr>
      <td>${experimentLink(item)}<br><small>${escapeHtml(item.id)}</small></td>
      <td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.tag)}</td>
      <td>${item.accuracy}</td><td>${item.latencyMs}</td>
    </tr>`).join('')}</tbody></table></div>`;
}

function artifactsList(artifacts) {
  if (!artifacts.length) return '<p>Артефактов пока нет.</p>';
  return `<ul>${artifacts.map(item => `<li>
    <a class="artifact-link" href="${escapeHtml(item.url)}" download>${escapeHtml(item.name)}</a>
    <small>(${item.size} байт)</small>
  </li>`).join('')}</ul>`;
}

function modelsTable(models, editable = false) {
  if (!models.length) return '<p>Моделей пока нет.</p>';
  return `<div class="table-responsive"><table class="table table-striped">
    <thead><tr><th>Модель</th><th>Версия</th><th>Эксперимент и артефакты</th><th>Статус</th></tr></thead>
    <tbody>${models.map(model => `<tr>
      <td>${escapeHtml(model.name)}${model.userId === session.user.id ? '' : '<br><small>Другой пользователь</small>'}</td>
      <td>${escapeHtml(model.version)}</td>
      <td>${experimentLink({ id: model.linkedExperimentId, name: model.linkedExperimentId })}</td>
      <td>${editable && model.userId === session.user.id ? `
        <form data-model-id="${escapeHtml(model.id)}" class="d-flex gap-2">
          <select class="form-select form-select-sm" name="stage" aria-label="Статус ${escapeHtml(model.name)} ${escapeHtml(model.version)}">
            ${['Staging', 'Production', 'Archived'].map(stage => `<option${stage === model.stage ? ' selected' : ''}>${stage}</option>`).join('')}
          </select>
          <button class="btn btn-sm btn-outline-primary" type="submit">Сохранить</button>
        </form>` : escapeHtml(model.stage)}
      </td>
    </tr>`).join('')}</tbody></table></div>`;
}

function renderDashboard([experiments, models]) {
  const artifacts = experiments.flatMap(item => item.artifacts);
  $('#dashboard-content').innerHTML = `
    <p><strong>${escapeHtml(session.user.name)}</strong> · ${escapeHtml(session.user.email)}</p>
    <p>Эксперименты: ${experiments.length} · Версии моделей: ${models.length} · Артефакты: ${artifacts.length}</p>
    <h2 class="h5 mt-4">Мои эксперименты</h2>${experimentsTable(experiments)}
    <h2 class="h5 mt-4">Мои модели</h2>${modelsTable(models)}
    <h2 class="h5 mt-4">Мои артефакты</h2>${artifactsList(artifacts)}`;
}

function renderExperiment(experiment) {
  const metrics = experiment.metrics;
  $('#experiment-content').innerHTML = `
    <h1 class="h3">${escapeHtml(experiment.name)}</h1>
    <p>${escapeHtml(experiment.id)} · ${escapeHtml(experiment.date)} · ${escapeHtml(experiment.tag)}</p>
    <p>${escapeHtml(experiment.description)}</p>
    <p>Accuracy: ${experiment.accuracy} · Loss: ${experiment.finalLoss} · Latency: ${experiment.latencyMs} мс</p>
    <h2 class="h5">Метрики</h2>
    <div class="chart-container mb-3"><canvas id="metrics-chart" aria-label="Accuracy и loss по эпохам" role="img"></canvas></div>
    <div class="table-responsive"><table class="table table-sm">
      <thead><tr><th>Эпоха</th><th>Accuracy</th><th>Loss</th></tr></thead>
      <tbody>${metrics.labels.map((label, i) => `<tr><td>${escapeHtml(label)}</td><td>${metrics.accuracy[i]}</td><td>${metrics.loss[i]}</td></tr>`).join('')}</tbody>
    </table></div>
    <h2 class="h5 mt-4">Артефакты</h2>${artifactsList(experiment.artifacts)}
    <h2 class="h5 mt-4">Логи</h2><pre>${escapeHtml(experiment.logs.join('\n'))}</pre>`;
  chart = new Chart($('#metrics-chart'), {
    type: 'line',
    data: {
      labels: metrics.labels,
      datasets: [
        { label: 'Accuracy', data: metrics.accuracy, borderColor: '#0d6efd', yAxisID: 'accuracy' },
        { label: 'Loss', data: metrics.loss, borderColor: '#b02a37', yAxisID: 'loss' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      scales: { accuracy: { min: 0, max: 1 }, loss: { position: 'right', min: 0, grid: { drawOnChartArea: false } } }
    }
  });
}

function renderModels([models, experiments]) {
  $('#models-list').innerHTML = modelsTable(models, true);
  $('#model-experiment').innerHTML = '<option value="">Выберите эксперимент</option>' + experiments.map(item =>
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('');
  $('#model-form').hidden = !experiments.length;
  $('#model-hint').hidden = experiments.length > 0;
}

function searchUrl() {
  const params = new URLSearchParams({ _sort: 'date', _order: 'desc' });
  for (const [key, value] of new FormData($('#search-form'))) {
    if (value.trim()) params.set(key, value.trim());
  }
  return `/experiments?${params}`;
}

async function loadRoute() {
  const version = ++routeVersion;
  const [requestedPage, experimentId] = location.hash.slice(1).split('/');
  let page = requestedPage || (session ? 'dashboard' : 'login');
  const isPublic = ['login', 'register'].includes(page);
  if (!session && !isPublic) { location.hash = '#login'; return; }
  if (session && isPublic) { location.hash = '#dashboard'; return; }
  if (!['login', 'register', 'dashboard', 'search', 'experiment', 'models'].includes(page)) page = 'not-found';
  document.querySelectorAll('main > section').forEach(section => { section.hidden = section.id !== page; });
  $('#navigation').hidden = !session;
  document.querySelectorAll('#navigation a').forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  message(nextMessage);
  nextMessage = '';
  if (chart) { chart.destroy(); chart = null; }
  for (const id of ['dashboard-content', 'search-results', 'experiment-content', 'models-list']) $(`#${id}`).innerHTML = '';
  $('#model-form').hidden = true;
  $('#model-hint').hidden = true;
  const needsData = ['dashboard', 'search', 'experiment', 'models'].includes(page);
  $('#loading').hidden = !needsData;
  try {
    let data;
    if (page === 'dashboard') data = await Promise.all([
      api(`/experiments?userId=${session.user.id}&_sort=date&_order=desc`),
      api(`/models?userId=${session.user.id}`)
    ]);
    if (page === 'search') data = await api(searchUrl());
    if (page === 'experiment') {
      if (!experimentId) throw new Error('Эксперимент не выбран. Откройте его из поиска.');
      data = await api(`/experiments/${encodeURIComponent(experimentId)}`);
    }
    if (page === 'models') data = await Promise.all([
      api('/models?_sort=name,version&_order=asc,desc'), api(`/experiments?userId=${session.user.id}`)
    ]);
    if (version !== routeVersion) return;
    if (page === 'dashboard') renderDashboard(data);
    if (page === 'search') $('#search-results').innerHTML = `<p role="status">Найдено: ${data.length}</p>${experimentsTable(data)}`;
    if (page === 'experiment') renderExperiment(data);
    if (page === 'models') renderModels(data);
  } catch (error) {
    if (version === routeVersion) handleError(error);
  } finally {
    if (version === routeVersion) $('#loading').hidden = true;
  }
}

async function submit(event, action) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled) return;
  button.disabled = true;
  message('');
  try { await action(Object.fromEntries(new FormData(form))); }
  catch (error) { handleError(error); }
  finally { button.disabled = false; }
}

for (const kind of ['login', 'register']) {
  $(`#${kind}-form`).addEventListener('submit', event => submit(event, async data => {
    session = await api(`/${kind}`, 'POST', data, false);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    event.target.reset();
    location.hash = '#dashboard';
  }));
}
$('#logout').addEventListener('click', () => {
  ++routeVersion;
  clearSession();
  location.hash = '#login';
});
$('#search-form').addEventListener('submit', event => submit(event, loadRoute));
$('#reset-search').addEventListener('click', () => {
  $('#search-form').reset();
  loadRoute();
});
$('#model-form').addEventListener('submit', event => submit(event, async data => {
  await api('/models', 'POST', { ...data, userId: session.user.id });
  event.target.reset();
  await loadRoute();
  message('Версия добавлена со статусом Staging.', 'success');
}));
$('#models-list').addEventListener('submit', event => submit(event, async data => {
  await api(`/models/${event.target.dataset.modelId}`, 'PATCH', data);
  await loadRoute();
  message('Статус сохранён.', 'success');
}));
window.addEventListener('hashchange', loadRoute);

async function start() {
  if (session) {
    try { session.user = await api(`/users/${session.user.id}`); }
    catch (error) {
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        clearSession();
        nextMessage = 'Сессия истекла. Войдите снова.';
      } else nextMessage = error.message;
    }
  }
  await loadRoute();
}
start();
