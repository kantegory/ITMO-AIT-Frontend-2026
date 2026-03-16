'use strict';

var currentUser = null;
var TOKEN = 'mlp_3f9a2b7c1d8e4f5a6b0c9d2e7f1a4b8c';
var tokenVisible = false;

var USERS = [
  { email: 'admin@ml.pipe', pass: 'admin123', name: 'admin',       role: 'Admin' },
  { email: 'user@ml.pipe',  pass: 'user123',  name: 'ml_engineer', role: 'ML Engineer' }
];

var experiments = [];
var models      = [];
var artifacts   = [];
var openExpId   = null;

function switchForm(to) {
  document.getElementById('form-login').classList.toggle('d-none', to !== 'login');
  document.getElementById('form-register').classList.toggle('d-none', to !== 'register');
}

function fillDemo() {
  document.getElementById('li-email').value = 'admin' + '@' + 'ml.pipe';
  document.getElementById('li-pass').value  = 'admin123';
  doLogin();
}

function doLogin() {
  var email = document.getElementById('li-email').value.trim();
  var pass  = document.getElementById('li-pass').value;
  var err   = document.getElementById('li-err');
  var u = null;
  for (var i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email && USERS[i].pass === pass) { u = USERS[i]; break; }
  }
  if (!u) { err.textContent = 'Неверный email или пароль'; err.classList.remove('d-none'); return; }
  err.classList.add('d-none');
  currentUser = u;
  startApp();
}

function doRegister() {
  var name  = document.getElementById('re-name').value.trim();
  var email = document.getElementById('re-email').value.trim();
  var pass  = document.getElementById('re-pass').value;
  var role  = document.getElementById('re-role').value;
  var err   = document.getElementById('re-err');
  if (!name || !email || pass.length < 6) {
    err.textContent = 'Заполните все поля. Пароль минимум 6 символов.';
    err.classList.remove('d-none'); return;
  }
  for (var i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email) {
      err.textContent = 'Email уже занят.';
      err.classList.remove('d-none'); return;
    }
  }
  err.classList.add('d-none');
  var u = { email: email, pass: pass, name: name, role: role === 'admin' ? 'Admin' : 'ML Engineer' };
  USERS.push(u);
  currentUser = u;
  startApp();
}

function doLogout() {
  currentUser = null;
  document.getElementById('screen-app').classList.add('d-none');
  document.getElementById('screen-auth').style.display = '';
  switchForm('login');
}

function startApp() {
  document.getElementById('screen-auth').style.display = 'none';
  var app = document.getElementById('screen-app');
  app.classList.remove('d-none');
  app.style.display = 'flex';
  document.getElementById('sb-name').textContent = currentUser.name;
  document.getElementById('sb-role').textContent = currentUser.role;
  nav('dashboard', document.querySelector('.nav-link'));
}

function nav(view, el) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.add('d-none'); });
  document.querySelectorAll('.nav-link').forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('view-' + view);
  if (target) target.classList.remove('d-none');
  if (el) el.classList.add('active');
  var titles = {
    dashboard: 'Дашборд', experiments: 'Эксперименты',
    'exp-detail': 'Эксперимент', models: 'Model Registry',
    artifacts: 'Артефакт-стор', profile: 'Мой кабинет'
  };
  document.getElementById('tb-title').textContent = titles[view] || view;
  if (view === 'dashboard')   renderDashboard();
  if (view === 'experiments') renderExps(experiments);
  if (view === 'models')    { renderModels(); populateExpSelects(); }
  if (view === 'artifacts') { renderArtifacts(artifacts); populateExpSelects(); }
  if (view === 'profile')     renderProfile();
  return false;
}

function renderDashboard() {
  document.getElementById('kpi-exp').textContent    = experiments.length;
  document.getElementById('kpi-runs').textContent   = experiments.reduce(function(s, e) { return s + e.runs; }, 0);
  document.getElementById('kpi-models').textContent = models.length;
  document.getElementById('kpi-prod').textContent   = models.filter(function(m) { return m.stage === 'prod'; }).length;

  document.getElementById('dash-exp-list').innerHTML = experiments.slice(0, 4).map(function(e) {
    return '<tr><td><a href="#" onclick="openExp(' + e.id + ')">' + e.name + '</a></td>' +
           '<td>' + e.runs + '</td>' +
           '<td><span class="badge ' + (e.status === 'active' ? 'bg-success' : 'bg-secondary') + '">' +
           (e.status === 'active' ? 'Активен' : 'Архив') + '</span></td></tr>';
  }).join('');

  document.getElementById('dash-model-list').innerHTML = models.slice(0, 4).map(function(m) {
    var labels = { prod: 'Production', staging: 'Staging', dev: 'Development', arch: 'Archived' };
    var colors = { prod: 'bg-success', staging: 'bg-primary', dev: 'bg-warning', arch: 'bg-secondary' };
    return '<tr><td>' + m.name + '</td><td><code>' + m.ver + '</code></td>' +
           '<td><span class="badge ' + (colors[m.stage] || 'bg-secondary') + '">' + (labels[m.stage] || m.stage) + '</span></td></tr>';
  }).join('');
}

function renderExps(list) {
  var tbody = document.getElementById('exp-tbody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Нет данных</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(function(e) {
    var tags = e.tags.split(',').map(function(t) {
      return '<span class="badge bg-light text-dark border me-1">' + t.trim() + '</span>';
    }).join('');
    return '<tr>' +
      '<td><a href="#" onclick="openExp(' + e.id + ')">' + e.name + '</a></td>' +
      '<td>' + e.date + '</td><td>' + tags + '</td><td>' + e.runs + '</td>' +
      '<td><code>' + e.best + '</code></td>' +
      '<td><span class="badge ' + (e.status === 'active' ? 'bg-success' : 'bg-secondary') + '">' +
      (e.status === 'active' ? 'Активен' : 'Архив') + '</span></td>' +
      '<td><button class="btn btn-outline-primary btn-sm" onclick="openExp(' + e.id + ')">Открыть</button></td>' +
      '</tr>';
  }).join('');
}

function filterExps() {
  var name   = document.getElementById('f-name').value.toLowerCase();
  var from   = document.getElementById('f-date-from').value;
  var to     = document.getElementById('f-date-to').value;
  var metric = document.getElementById('f-metric').value.toLowerCase();
  var tag    = document.getElementById('f-tags').value.toLowerCase().trim();
  var list = experiments.filter(function(e) {
    if (name   && e.name.toLowerCase().indexOf(name) === -1) return false;
    if (from   && e.date < from) return false;
    if (to     && e.date > to)   return false;
    if (tag    && e.tags.toLowerCase().indexOf(tag) === -1) return false;
    if (metric) {
      var m = metric.match(/([a-z]+)([><=]+)([\d.]+)/);
      if (m) {
        var re = new RegExp(m[1] + '=([\\d.]+)');
        var res = e.best.match(re);
        if (res) {
          var val = parseFloat(res[1]);
          if (m[2] === '>'  && !(val >  +m[3])) return false;
          if (m[2] === '>=' && !(val >= +m[3])) return false;
          if (m[2] === '<'  && !(val <  +m[3])) return false;
        }
      } else if (e.best.toLowerCase().indexOf(metric) === -1) return false;
    }
    return true;
  });
  renderExps(list);
}

function clearFilters() {
  ['f-name', 'f-date-from', 'f-date-to', 'f-metric', 'f-tags'].forEach(function(id) {
    document.getElementById(id).value = '';
  });
  renderExps(experiments);
}

function addExp() {
  var name = document.getElementById('ne-name').value.trim();
  if (!name) return;
  experiments.unshift({
    id: Date.now(), name: name,
    date: new Date().toISOString().slice(0, 10),
    tags: document.getElementById('ne-tags').value || '',
    runs: 0, best: '—', status: 'active', owner: currentUser.name
  });
}

function openExp(id) {
  openExpId = id;
  var e = null;
  for (var i = 0; i < experiments.length; i++) { if (experiments[i].id === id) { e = experiments[i]; break; } }
  if (!e) return;
  var tags = e.tags.split(',').map(function(t) {
    return '<span class="badge bg-light text-dark border me-1">' + t.trim() + '</span>';
  }).join('');
  document.getElementById('exp-detail-header').innerHTML =
    '<h5 class="font-monospace">' + e.name + '</h5><div class="mb-2">' + tags + '</div>' +
    '<div class="d-flex gap-3"><div><strong>' + e.runs + '</strong> <span class="text-muted small">запусков</span></div>' +
    '<div><strong>' + e.best + '</strong> <span class="text-muted small">лучшая метрика</span></div>' +
    '<div><span class="badge ' + (e.status === 'active' ? 'bg-success' : 'bg-secondary') + '">' +
    (e.status === 'active' ? 'Активен' : 'Архив') + '</span></div></div>';
  expTab(document.querySelector('#exp-tabs .nav-link'), 'logs');
  document.querySelectorAll('.view').forEach(function(v) { v.classList.add('d-none'); });
  document.getElementById('view-exp-detail').classList.remove('d-none');
  document.getElementById('tb-title').textContent = 'Эксперимент';
}

function expTab(el, tab) {
  document.querySelectorAll('#exp-tabs .nav-link').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.add('d-none'); });
  if (el) el.classList.add('active');
  document.getElementById('tab-' + tab).classList.remove('d-none');
  var e = null;
  for (var i = 0; i < experiments.length; i++) { if (experiments[i].id === openExpId) { e = experiments[i]; break; } }
  if (!e) return;
  if (tab === 'logs')      renderLogs(e);
  if (tab === 'metrics')   renderMetrics();
  if (tab === 'artifacts') renderExpArtifacts(e);
  if (tab === 'viz')       renderViz();
}

function renderLogs(e) {
  document.getElementById('log-content').innerHTML = '';
  document.getElementById('tab-logs').innerHTML =
    '<pre class="bg-dark text-light p-3 rounded small">' +
    '[INFO]  Experiment <b>' + e.name + '</b> started\n' +
    '[INFO]  Loading dataset...\n' +
    '[INFO]  Feature engineering complete\n' +
    '[WARN]  Missing values detected — imputing\n' +
    '[INFO]  Training started\n' +
    '[OK]    Validation: ' + e.best + '\n' +
    '[OK]    Run completed successfully</pre>';
}

function renderMetrics() {
  document.getElementById('tab-metrics').innerHTML =
    '<div class="row g-3">' +
    ['accuracy:0.947', 'f1_score:0.931', 'precision:0.928', 'recall:0.934', 'roc_auc:0.971', 'log_loss:0.194'].map(function(m) {
      var parts = m.split(':');
      return '<div class="col-6 col-md-4 col-lg-3">' +
        '<div class="card p-3 text-center">' +
        '<div class="small text-muted text-uppercase">' + parts[0] + '</div>' +
        '<div class="fs-4 fw-bold font-monospace">' + parts[1] + '</div>' +
        '</div></div>';
    }).join('') + '</div>';
}

function renderExpArtifacts(e) {
  var list = artifacts.filter(function(a) { return a.expId === e.id; });
  document.getElementById('tab-artifacts').innerHTML = list.length ?
    '<table class="table table-sm table-bordered"><thead><tr><th>Файл</th><th>Тип</th><th>Размер</th><th></th></tr></thead><tbody>' +
    list.map(function(a) {
      return '<tr><td class="font-monospace">' + a.name + '</td><td>' + a.type + '</td><td>' + a.size + '</td>' +
             '<td><button class="btn btn-outline-secondary btn-sm">Скачать</button></td></tr>';
    }).join('') + '</tbody></table>'
    : '<p class="text-muted">Нет артефактов</p>';
}

function renderViz() {
  document.getElementById('tab-viz').innerHTML =
    '<div class="row g-3">' +
    '<div class="col-md-6"><div class="card p-3 text-center text-muted" style="height:180px;display:flex;align-items:center;justify-content:center;flex-direction:column"><i class="bi bi-graph-up-arrow fs-2"></i><div>ROC-кривая · AUC=0.971</div></div></div>' +
    '<div class="col-md-6"><div class="card p-3 text-center text-muted" style="height:180px;display:flex;align-items:center;justify-content:center;flex-direction:column"><i class="bi bi-grid-3x3 fs-2"></i><div>Матрица ошибок</div></div></div>' +
    '</div>';
}

function renderModels() {
  var labels = { prod: 'Production', staging: 'Staging', dev: 'Development', arch: 'Archived' };
  var colors = { prod: 'bg-success', staging: 'bg-primary', dev: 'bg-warning', arch: 'bg-secondary' };
  document.getElementById('models-tbody').innerHTML = models.map(function(m, i) {
    var actions = '';
    if (m.stage !== 'prod' && m.stage !== 'arch')
      actions += '<button class="btn btn-outline-primary btn-sm me-1" onclick="promoteModel(' + i + ')">↑ Promote</button>';
    if (!m.deployed && m.stage !== 'arch')
      actions += '<button class="btn btn-outline-success btn-sm me-1" onclick="prepDeploy(' + i + ')" data-bs-toggle="modal" data-bs-target="#m-deploy">Deploy</button>';
    if (m.stage !== 'arch')
      actions += '<button class="btn btn-outline-danger btn-sm" onclick="archiveModel(' + i + ')">Архив</button>';
    return '<tr>' +
      '<td><strong>' + m.name + '</strong></td><td><code>' + m.ver + '</code></td><td>' + m.fw + '</td>' +
      '<td><code class="small">' + m.metrics + '</code></td>' +
      '<td><span class="badge ' + (colors[m.stage] || 'bg-secondary') + '">' + (labels[m.stage] || m.stage) + '</span></td>' +
      '<td>' + (m.deployed ? '<span class="badge bg-success">Deployed</span>' : '<span class="badge bg-light text-dark border">—</span>') + '</td>' +
      '<td>' + actions + '</td></tr>';
  }).join('');
}

function registerModel() {
  var name = document.getElementById('rm-name').value.trim(); if (!name) return;
  models.push({
    id: Date.now(), name: name,
    ver: document.getElementById('rm-ver').value || 'v1.0',
    fw: document.getElementById('rm-fw').value,
    metrics: document.getElementById('rm-metrics').value || '—',
    stage: document.getElementById('rm-stage').value,
    deployed: false, expId: 0, owner: currentUser.name
  });
  renderModels();
}

function promoteModel(i) {
  var order = ['dev', 'staging', 'prod'];
  var idx = order.indexOf(models[i].stage);
  if (idx < order.length - 1) { models[i].stage = order[idx + 1]; renderModels(); }
}

function archiveModel(i) { models[i].stage = 'arch'; models[i].deployed = false; renderModels(); }

function prepDeploy(i) {
  document.getElementById('dep-model').value = models[i].name + ' ' + models[i].ver;
}

function deployDone() {
  var val = document.getElementById('dep-model').value;
  for (var i = 0; i < models.length; i++) {
    if ((models[i].name + ' ' + models[i].ver) === val) { models[i].deployed = true; models[i].stage = 'prod'; break; }
  }
  renderModels();
}

function artIcon(type) {
  return { model: 'bi-file-earmark-binary', dataset: 'bi-table', plot: 'bi-image', config: 'bi-file-earmark-code', other: 'bi-file-earmark' }[type] || 'bi-file-earmark';
}

function renderArtifacts(list) {
  var tbody = document.getElementById('art-tbody'); if (!tbody) return;
  tbody.innerHTML = list.map(function(a) {
    var expName = '';
    for (var i = 0; i < experiments.length; i++) { if (experiments[i].id === a.expId) { expName = experiments[i].name; break; } }
    return '<tr>' +
      '<td><i class="bi ' + artIcon(a.type) + ' me-1"></i><span class="font-monospace small">' + a.name + '</span></td>' +
      '<td><span class="badge bg-light text-dark border">' + a.type + '</span></td>' +
      '<td class="font-monospace small">' + a.size + '</td>' +
      '<td class="small">' + expName + '</td>' +
      '<td class="small">' + a.date + '</td>' +
      '<td><button class="btn btn-outline-secondary btn-sm me-1">Скачать</button>' +
      '<button class="btn btn-outline-danger btn-sm" onclick="deleteArtifact(' + a.id + ')">Удалить</button></td></tr>';
  }).join('') || '<tr><td colspan="6" class="text-center text-muted">Нет артефактов</td></tr>';
}

function filterArtifacts() {
  var q    = document.getElementById('art-search').value.toLowerCase();
  var type = document.getElementById('art-type').value;
  renderArtifacts(artifacts.filter(function(a) {
    return (!q || a.name.toLowerCase().indexOf(q) !== -1) && (!type || a.type === type);
  }));
}

function deleteArtifact(id) {
  artifacts = artifacts.filter(function(a) { return a.id !== id; });
  renderArtifacts(artifacts);
}

function previewFile(input) {
  var f = input.files[0];
  document.getElementById('ua-preview').textContent = f ? 'Выбран: ' + f.name + ' (' + (f.size / 1024 / 1024).toFixed(2) + ' MB)' : '';
}

function uploadArtifact() {
  var file  = document.getElementById('ua-file').files[0];
  var expId = parseInt(document.getElementById('ua-exp').value) || 0;
  var type  = document.getElementById('ua-type').value;
  if (!file) return;
  artifacts.unshift({
    id: Date.now(), name: file.name, type: type,
    size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
    expId: expId, date: new Date().toISOString().slice(0, 10), owner: currentUser.name
  });
}

function populateExpSelects() {
  ['rm-exp', 'ua-exp'].forEach(function(id) {
    var sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = experiments.map(function(e) { return '<option value="' + e.id + '">' + e.name + '</option>'; }).join('');
  });
}

function renderProfile() {
  document.getElementById('prof-uname').textContent = currentUser.name;
  document.getElementById('prof-email').textContent = currentUser.email;
  document.getElementById('prof-role').textContent  = currentUser.role;
  var myExps = experiments.filter(function(e) { return e.owner === currentUser.name; });
  document.getElementById('prof-exp-list').innerHTML = myExps.length ? myExps.map(function(e) {
    return '<tr><td><a href="#" onclick="openExp(' + e.id + ')">' + e.name + '</a></td>' +
      '<td>' + e.runs + '</td><td class="font-monospace small">' + e.best + '</td>' +
      '<td><span class="badge ' + (e.status === 'active' ? 'bg-success' : 'bg-secondary') + '">' + (e.status === 'active' ? 'Активен' : 'Архив') + '</span></td>' +
      '<td><button class="btn btn-outline-primary btn-sm" onclick="openExp(' + e.id + ')">Открыть</button></td></tr>';
  }).join('') : '<tr><td colspan="5" class="text-muted">Нет экспериментов</td></tr>';
  var myModels = models.filter(function(m) { return m.owner === currentUser.name; });
  var labels = { prod: 'Production', staging: 'Staging', dev: 'Development', arch: 'Archived' };
  var colors = { prod: 'bg-success', staging: 'bg-primary', dev: 'bg-warning', arch: 'bg-secondary' };
  document.getElementById('prof-model-list').innerHTML = myModels.length ? myModels.map(function(m) {
    return '<tr><td>' + m.name + '</td><td><code>' + m.ver + '</code></td>' +
      '<td><span class="badge ' + (colors[m.stage] || 'bg-secondary') + '">' + (labels[m.stage] || m.stage) + '</span></td></tr>';
  }).join('') : '<tr><td colspan="3" class="text-muted">Нет моделей</td></tr>';
  var myArts = artifacts.filter(function(a) { return a.owner === currentUser.name; });
  document.getElementById('prof-art-list').innerHTML = myArts.length ? myArts.map(function(a) {
    return '<tr><td class="font-monospace small"><i class="bi ' + artIcon(a.type) + ' me-1"></i>' + a.name + '</td>' +
      '<td><span class="badge bg-light text-dark border">' + a.type + '</span></td><td class="small">' + a.date + '</td></tr>';
  }).join('') : '<tr><td colspan="3" class="text-muted">Нет артефактов</td></tr>';
}

function prefillEdit() {
  document.getElementById('ep-name').value  = currentUser.name;
  document.getElementById('ep-email').value = currentUser.email;
}

function saveProfile() {
  var n = document.getElementById('ep-name').value.trim();
  var e = document.getElementById('ep-email').value.trim();
  if (n) currentUser.name  = n;
  if (e) currentUser.email = e;
  document.getElementById('sb-name').textContent = currentUser.name;
  renderProfile();
}

function toggleToken() {
  tokenVisible = !tokenVisible;
  document.getElementById('api-tok').textContent = tokenVisible ? TOKEN : 'mlp_••••••••••••••••••••••••••••';
  event.target.textContent = tokenVisible ? 'Скрыть' : 'Показать';
}

function copyToken() { if (navigator.clipboard) navigator.clipboard.writeText(TOKEN); }

document.addEventListener('DOMContentLoaded', function() {
  var el = document.getElementById('demo-cred');
  if (el) el.textContent = 'admin' + '@' + 'ml.pipe  /  admin123';
});