'use strict';

let currentUser = null;
const TOKEN = 'mlp_3f9a2b7c1d8e4f5a6b0c9d2e7f1a4b8c';
let tokenVisible = false;

const USERS = [
  { email:'admin@ml.pipe', pass:'admin123', name:'admin',       role:'Admin' },
  { email:'user@ml.pipe',  pass:'user123',  name:'ml_engineer', role:'ML Engineer' }
];

let experiments = [
  { id:1, name:'fraud-detection', date:'2025-03-01', tags:'xgboost,prod',          runs:42, best:'acc=0.947',  status:'active',   owner:'admin' },
  { id:2, name:'churn-model',     date:'2025-02-14', tags:'pytorch,classification', runs:31, best:'f1=0.881',   status:'active',   owner:'admin' },
  { id:3, name:'recommender',     date:'2025-01-20', tags:'tensorflow,embedding',   runs:19, best:'ndcg=0.732', status:'active',   owner:'ml_engineer' },
  { id:4, name:'nlp-classifier',  date:'2024-12-05', tags:'bert,nlp',               runs:8,  best:'loss=0.214', status:'archived', owner:'ml_engineer' }
];

let models = [
  { id:1, name:'fraud-detector',  ver:'v3.1', fw:'XGBoost',     metrics:'acc=0.947,f1=0.931', stage:'prod',    deployed:true,  expId:1, owner:'admin' },
  { id:2, name:'churn-predictor', ver:'v1.4', fw:'PyTorch',     metrics:'f1=0.881,roc=0.903', stage:'staging', deployed:false, expId:2, owner:'admin' },
  { id:3, name:'nlp-intent',      ver:'v2.0', fw:'HuggingFace', metrics:'acc=0.923,f1=0.911', stage:'prod',    deployed:true,  expId:4, owner:'ml_engineer' },
  { id:4, name:'recommender-cf',  ver:'v0.9', fw:'TensorFlow',  metrics:'ndcg=0.732,hr=0.61', stage:'dev',     deployed:false, expId:3, owner:'ml_engineer' }
];

let artifacts = [
  { id:1, name:'model.pkl',               type:'model',   size:'4.2 MB',  expId:1, date:'2025-03-02', owner:'admin' },
  { id:2, name:'confusion_matrix.png',    type:'plot',    size:'128 KB',  expId:1, date:'2025-03-02', owner:'admin' },
  { id:3, name:'feature_importance.json', type:'config',  size:'12 KB',   expId:1, date:'2025-03-02', owner:'admin' },
  { id:4, name:'train_dataset.csv',       type:'dataset', size:'82 MB',   expId:2, date:'2025-02-15', owner:'admin' },
  { id:5, name:'checkpoint.pt',           type:'model',   size:'312 MB',  expId:2, date:'2025-02-18', owner:'admin' },
  { id:6, name:'emb_weights.npy',         type:'model',   size:'56 MB',   expId:3, date:'2025-01-22', owner:'ml_engineer' },
  { id:7, name:'bert_config.json',        type:'config',  size:'4 KB',    expId:4, date:'2024-12-06', owner:'ml_engineer' }
];

let openExpId = null;

document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('demo-cred');
  if (el) el.textContent = 'admin' + '@' + 'ml.pipe  /  admin123';
});

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
  var emailEl = document.getElementById('li-email');
  var passEl  = document.getElementById('li-pass');
  var errEl   = document.getElementById('li-err');
  if (!emailEl || !passEl) return;

  var email = emailEl.value.trim();
  var pass  = passEl.value;

  var u = null;
  for (var i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email && USERS[i].pass === pass) { u = USERS[i]; break; }
  }

  if (!u) {
    errEl.textContent = 'Неверный email или пароль';
    errEl.classList.remove('d-none');
    return;
  }
  errEl.classList.add('d-none');
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
    err.classList.remove('d-none');
    return;
  }
  var exists = false;
  for (var i = 0; i < USERS.length; i++) { if (USERS[i].email === email) { exists = true; break; } }
  if (exists) { err.textContent = 'Email уже занят.'; err.classList.remove('d-none'); return; }

  err.classList.add('d-none');
  var u = { email: email, pass: pass, name: name, role: role === 'admin' ? 'Admin' : 'ML Engineer' };
  USERS.push(u);
  currentUser = u;
  startApp();
}

function doLogout() {
  currentUser = null;
  var app  = document.getElementById('screen-app');
  var auth = document.getElementById('screen-auth');
  app.style.display  = 'none';
  auth.style.display = '';
  switchForm('login');
}

function startApp() {
  var auth = document.getElementById('screen-auth');
  var app  = document.getElementById('screen-app');
  auth.style.display = 'none';
  app.style.display  = 'flex';
  app.classList.remove('d-none');
  document.getElementById('sb-name').textContent = currentUser.name;
  document.getElementById('sb-role').textContent = currentUser.role;
  nav('dashboard', document.querySelector('.nav-item'));
}

function nav(view, el) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.add('d-none'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('view-' + view);
  if (target) target.classList.remove('d-none');
  if (el) el.classList.add('active');
  var titles = { dashboard:'Дашборд', experiments:'Эксперименты', 'exp-detail':'Эксперимент', models:'Model Registry', artifacts:'Артефакт-стор', profile:'Мой кабинет' };
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
  document.getElementById('kpi-runs').textContent   = experiments.reduce(function(s,e){ return s+e.runs; }, 0);
  document.getElementById('kpi-models').textContent = models.length;
  document.getElementById('kpi-prod').textContent   = models.filter(function(m){ return m.stage==='prod'; }).length;

  document.getElementById('dash-exp-list').innerHTML = experiments.slice(0,4).map(function(e) {
    return '<tr><td><a href="#" class="acc-link" onclick="openExp('+e.id+')">' + e.name + '</a></td>' +
           '<td>' + e.runs + '</td>' +
           '<td><span class="badge-status ' + (e.status==='active'?'bs-ok':'bs-arch') + '">' + (e.status==='active'?'Активен':'Архив') + '</span></td></tr>';
  }).join('');

  document.getElementById('dash-model-list').innerHTML = models.slice(0,4).map(function(m) {
    var stageLabel = {prod:'Production',staging:'Staging',dev:'Development',arch:'Archived'}[m.stage];
    return '<tr><td>' + m.name + '</td><td class="mono">' + m.ver + '</td>' +
           '<td><span class="stage-' + m.stage + '">' + stageLabel + '</span></td></tr>';
  }).join('');
}

function renderExps(list) {
  var tbody = document.getElementById('exp-tbody');
  if (!tbody) return;
  if (!list.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:1.5rem">Нет результатов</td></tr>'; return; }
  tbody.innerHTML = list.map(function(e) {
    var tags = e.tags.split(',').map(function(t){ return '<span class="tag-chip">'+t.trim()+'</span>'; }).join('');
    return '<tr>' +
      '<td><a href="#" class="acc-link" onclick="openExp('+e.id+')">' + e.name + '</a></td>' +
      '<td class="mono" style="font-size:.8rem">' + e.date + '</td>' +
      '<td>' + tags + '</td>' +
      '<td>' + e.runs + '</td>' +
      '<td class="mono" style="font-size:.8rem">' + e.best + '</td>' +
      '<td><span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'">'+(e.status==='active'?'Активен':'Архив')+'</span></td>' +
      '<td><button class="btn-xs" onclick="openExp('+e.id+')">Открыть</button></td>' +
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
        var re  = new RegExp(m[1] + '=([\\d.]+)');
        var res = e.best.match(re);
        if (res) {
          var val = parseFloat(res[1]);
          if (m[2] === '>='  && !(val >= +m[3])) return false;
          if (m[2] === '>'   && !(val >  +m[3])) return false;
          if (m[2] === '<='  && !(val <= +m[3])) return false;
          if (m[2] === '<'   && !(val <  +m[3])) return false;
        }
      } else if (e.best.toLowerCase().indexOf(metric) === -1) return false;
    }
    return true;
  });
  renderExps(list);
}

function clearFilters() {
  ['f-name','f-date-from','f-date-to','f-metric','f-tags'].forEach(function(id){
    document.getElementById(id).value = '';
  });
  renderExps(experiments);
}

function addExp() {
  var name = document.getElementById('ne-name').value.trim();
  if (!name) return;
  var today = new Date().toISOString().slice(0,10);
  experiments.unshift({ id: Date.now(), name: name, date: today,
    tags: document.getElementById('ne-tags').value || '',
    runs: 0, best: '—', status: 'active', owner: currentUser.name });
}

function openExp(id) {
  openExpId = id;
  var e = null;
  for (var i = 0; i < experiments.length; i++) { if (experiments[i].id === id) { e = experiments[i]; break; } }
  if (!e) return;

  var tags = e.tags.split(',').map(function(t){ return '<span class="tag-chip">'+t.trim()+'</span>'; }).join('');
  document.getElementById('exp-detail-header').innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.75rem">' +
      '<div><h4 style="font-weight:700;font-family:JetBrains Mono,monospace;margin-bottom:.5rem">' + e.name + '</h4>' +
      '<div>' + tags + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:.8rem;color:var(--muted)">' + e.date + '</div>' +
      '<span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'" style="margin-top:.35rem;display:inline-block">'+(e.status==='active'?'Активен':'Архив')+'</span></div>' +
    '</div>' +
    '<div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.75rem">' +
      '<div class="kpi" style="padding:.6rem 1rem"><div class="kpi-v" style="font-size:1.3rem">' + e.runs + '</div><div class="kpi-l">Запусков</div></div>' +
      '<div class="kpi" style="padding:.6rem 1rem"><div class="kpi-v" style="font-size:1.1rem">' + e.best + '</div><div class="kpi-l">Лучшая метрика</div></div>' +
    '</div>';

  expTab(document.querySelector('.tab-item'), 'logs');
  document.querySelectorAll('.view').forEach(function(v){ v.classList.add('d-none'); });
  document.getElementById('view-exp-detail').classList.remove('d-none');
  document.getElementById('tb-title').textContent = 'Эксперимент';
}

function expTab(el, tab) {
  document.querySelectorAll('.tab-item').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.add('d-none'); });
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
  document.getElementById('log-content').innerHTML = [
    '<span class="log-info">[INFO]  2025-03-02 10:00:01</span>  Experiment <b>' + e.name + '</b> started',
    '<span class="log-info">[INFO]  2025-03-02 10:00:03</span>  Loading dataset: train_dataset.csv (82 MB)',
    '<span class="log-info">[INFO]  2025-03-02 10:00:18</span>  Feature engineering: 47 features selected',
    '<span class="log-warn">[WARN]  2025-03-02 10:00:19</span>  3 features have >5% missing values — imputing',
    '<span class="log-info">[INFO]  2025-03-02 10:00:20</span>  Train/val split 80/20 · seed=42',
    '<span class="log-info">[INFO]  2025-03-02 10:01:05</span>  Epoch  1/50 — loss: 0.6132',
    '<span class="log-info">[INFO]  2025-03-02 10:02:14</span>  Epoch 10/50 — loss: 0.3411',
    '<span class="log-info">[INFO]  2025-03-02 10:04:52</span>  Epoch 30/50 — loss: 0.2218',
    '<span class="log-info">[INFO]  2025-03-02 10:07:11</span>  Epoch 50/50 — loss: 0.1940',
    '<span class="log-ok">[OK]    2025-03-02 10:07:15</span>  Validation: acc=0.9470  f1=0.9310  precision=0.928  recall=0.934',
    '<span class="log-ok">[OK]    2025-03-02 10:07:16</span>  Model artifact saved → model.pkl (4.2 MB)',
    '<span class="log-ok">[OK]    2025-03-02 10:07:18</span>  Run completed successfully ✓'
  ].join('<br>');
}

function renderMetrics() {
  var metrics = [
    {name:'accuracy',  val:'0.9470', delta:'+0.012'},
    {name:'f1_score',  val:'0.9310', delta:'+0.008'},
    {name:'precision', val:'0.9280', delta:'+0.005'},
    {name:'recall',    val:'0.9340', delta:'+0.011'},
    {name:'roc_auc',   val:'0.9710', delta:'+0.003'},
    {name:'log_loss',  val:'0.1940', delta:'-0.021'}
  ];
  var bars = [38,52,61,73,81,87,91,93,94,94];
  document.getElementById('metrics-content').innerHTML =
    '<div class="metric-grid mb-4">' +
      metrics.map(function(m){
        return '<div class="metric-card">' +
          '<div class="metric-name">' + m.name + '</div>' +
          '<div class="metric-val">' + m.val + '</div>' +
          '<div class="metric-delta" style="color:var(--ok)">' + m.delta + ' vs prev</div></div>';
      }).join('') +
    '</div>' +
    '<div class="panel"><div class="phead">Training loss (50 эпох)</div>' +
    '<div class="mini-bar-wrap">' +
      bars.map(function(h){ return '<div class="mini-bar" style="height:'+h+'px;flex:1" title="loss '+(0.65-(h/100)*0.46).toFixed(3)+'"></div>'; }).join('') +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;margin-top:.35rem;font-size:.72rem;color:var(--muted)"><span>Эпоха 1</span><span>50</span></div></div>';
}

function renderExpArtifacts(e) {
  var list = artifacts.filter(function(a){ return a.expId === e.id; });
  document.getElementById('exp-artifacts-content').innerHTML = list.length ?
    '<table class="t"><thead><tr><th>Файл</th><th>Тип</th><th>Размер</th><th>Дата</th><th></th></tr></thead><tbody>' +
      list.map(function(a){
        return '<tr><td><i class="bi ' + artIcon(a.type) + ' art-icon"></i>' + a.name + '</td>' +
          '<td><span class="tag-chip">' + a.type + '</span></td>' +
          '<td class="mono" style="font-size:.8rem">' + a.size + '</td>' +
          '<td class="mono" style="font-size:.8rem">' + a.date + '</td>' +
          '<td><button class="btn-xs">Скачать</button></td></tr>';
      }).join('') + '</tbody></table>'
    : '<div style="color:var(--muted);font-size:.85rem">Нет артефактов для этого эксперимента</div>';
}

function renderViz() {
  var bars = [72,84,89,91,93,95,94,94,94];
  document.getElementById('viz-content').innerHTML =
    '<div class="row g-3">' +
      '<div class="col-md-6"><div class="panel"><div class="phead">ROC-кривая</div>' +
      '<div class="viz-placeholder"><i class="bi bi-graph-up-arrow" style="font-size:2rem"></i><span>AUC = 0.971 · TPR vs FPR</span></div></div></div>' +
      '<div class="col-md-6"><div class="panel"><div class="phead">Матрица ошибок</div>' +
      '<div class="viz-placeholder"><i class="bi bi-grid-3x3" style="font-size:2rem"></i><span>TP:892  FP:62  FN:58  TN:918</span></div></div></div>' +
      '<div class="col-12"><div class="panel"><div class="phead">Accuracy по эпохам</div>' +
      '<div class="mini-bar-wrap" style="height:100px">' +
        bars.map(function(h){ return '<div class="mini-bar" style="height:'+h+'px;flex:1"></div>'; }).join('') +
      '</div></div></div></div>';
}

function renderModels() {
  document.getElementById('models-tbody').innerHTML = models.map(function(m, i) {
    var stageLabel = {prod:'Production',staging:'Staging',dev:'Development',arch:'Archived'}[m.stage];
    var actions = '';
    if (m.stage !== 'prod' && m.stage !== 'arch') actions += '<button class="btn-xs me-1" onclick="promoteModel('+i+')">↑ Promote</button>';
    if (!m.deployed && m.stage !== 'arch') actions += '<button class="btn-xs me-1" onclick="prepDeploy('+i+')" data-bs-toggle="modal" data-bs-target="#m-deploy">Deploy</button>';
    if (m.stage !== 'arch') actions += '<button class="btn-xs danger" onclick="archiveModel('+i+')">Архив</button>';
    return '<tr>' +
      '<td style="font-weight:600">' + m.name + '</td>' +
      '<td class="mono">' + m.ver + '</td>' +
      '<td>' + m.fw + '</td>' +
      '<td class="mono" style="font-size:.8rem">' + m.metrics + '</td>' +
      '<td><span class="stage-' + m.stage + '">' + stageLabel + '</span></td>' +
      '<td><span class="dep-badge ' + (m.deployed?'dep-on':'dep-off') + '">' + (m.deployed?'Deployed':'—') + '</span></td>' +
      '<td style="white-space:nowrap">' + actions + '</td></tr>';
  }).join('');
}

function registerModel() {
  var name = document.getElementById('rm-name').value.trim(); if (!name) return;
  models.push({ id: Date.now(), name: name,
    ver: document.getElementById('rm-ver').value || 'v1.0',
    fw:  document.getElementById('rm-fw').value,
    metrics: document.getElementById('rm-metrics').value || '—',
    stage: document.getElementById('rm-stage').value,
    deployed: false, expId: 0, owner: currentUser.name });
  renderModels();
}

function promoteModel(i) {
  var order = ['dev','staging','prod'];
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
  var icons = { model:'bi-file-earmark-binary', dataset:'bi-table', plot:'bi-image', config:'bi-file-earmark-code', other:'bi-file-earmark' };
  return icons[type] || 'bi-file-earmark';
}

function renderArtifacts(list) {
  var tbody = document.getElementById('art-tbody');
  if (!tbody) return;
  tbody.innerHTML = list.map(function(a) {
    var expName = '';
    for (var i = 0; i < experiments.length; i++) { if (experiments[i].id === a.expId) { expName = experiments[i].name; break; } }
    return '<tr>' +
      '<td><i class="bi ' + artIcon(a.type) + ' art-icon"></i><span class="mono" style="font-size:.8rem">' + a.name + '</span></td>' +
      '<td><span class="tag-chip">' + a.type + '</span></td>' +
      '<td class="mono" style="font-size:.8rem">' + a.size + '</td>' +
      '<td class="mono" style="font-size:.8rem">' + expName + '</td>' +
      '<td class="mono" style="font-size:.8rem">' + a.date + '</td>' +
      '<td style="white-space:nowrap"><button class="btn-xs me-1">Скачать</button><button class="btn-xs danger" onclick="deleteArtifact('+a.id+')">Удалить</button></td>' +
      '</tr>';
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:1.5rem">Нет артефактов</td></tr>';
}

function filterArtifacts() {
  var q    = document.getElementById('art-search').value.toLowerCase();
  var type = document.getElementById('art-type').value;
  renderArtifacts(artifacts.filter(function(a){
    return (!q || a.name.toLowerCase().indexOf(q) !== -1) && (!type || a.type === type);
  }));
}

function deleteArtifact(id) {
  artifacts = artifacts.filter(function(a){ return a.id !== id; });
  renderArtifacts(artifacts);
}

function previewFile(input) {
  var f = input.files[0];
  document.getElementById('ua-preview').textContent = f ? 'Выбран: ' + f.name + ' (' + (f.size/1024/1024).toFixed(2) + ' MB)' : '';
}

function uploadArtifact() {
  var file  = document.getElementById('ua-file').files[0];
  var expId = parseInt(document.getElementById('ua-exp').value) || 0;
  var type  = document.getElementById('ua-type').value;
  if (!file) return;
  artifacts.unshift({ id: Date.now(), name: file.name, type: type,
    size: (file.size/1024/1024).toFixed(1) + ' MB', expId: expId,
    date: new Date().toISOString().slice(0,10), owner: currentUser.name });
}

function populateExpSelects() {
  ['rm-exp','ua-exp'].forEach(function(id) {
    var sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = experiments.map(function(e){ return '<option value="'+e.id+'">'+e.name+'</option>'; }).join('');
  });
}

function renderProfile() {
  document.getElementById('prof-uname').textContent = currentUser.name;
  document.getElementById('prof-email').textContent = currentUser.email;
  document.getElementById('prof-role').textContent  = currentUser.role;

  var myExps = experiments.filter(function(e){ return e.owner === currentUser.name; });
  document.getElementById('prof-exp-list').innerHTML = myExps.length ? myExps.map(function(e){
    return '<tr><td><a href="#" class="acc-link" onclick="openExp('+e.id+')">' + e.name + '</a></td>' +
      '<td>' + e.runs + '</td><td class="mono" style="font-size:.8rem">' + e.best + '</td>' +
      '<td><span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'">'+(e.status==='active'?'Активен':'Архив')+'</span></td>' +
      '<td><button class="btn-xs" onclick="openExp('+e.id+')">Открыть</button></td></tr>';
  }).join('') : '<tr><td colspan="5" style="color:var(--muted)">Нет экспериментов</td></tr>';

  var myModels = models.filter(function(m){ return m.owner === currentUser.name; });
  document.getElementById('prof-model-list').innerHTML = myModels.length ? myModels.map(function(m){
    var sl = {prod:'Production',staging:'Staging',dev:'Development',arch:'Archived'}[m.stage];
    return '<tr><td>' + m.name + '</td><td class="mono">' + m.ver + '</td><td><span class="stage-'+m.stage+'">'+sl+'</span></td></tr>';
  }).join('') : '<tr><td colspan="3" style="color:var(--muted)">Нет моделей</td></tr>';

  var myArts = artifacts.filter(function(a){ return a.owner === currentUser.name; });
  document.getElementById('prof-art-list').innerHTML = myArts.length ? myArts.map(function(a){
    return '<tr><td class="mono" style="font-size:.8rem"><i class="bi '+artIcon(a.type)+' art-icon"></i>' + a.name + '</td>' +
      '<td><span class="tag-chip">'+a.type+'</span></td><td class="mono" style="font-size:.8rem">'+a.date+'</td></tr>';
  }).join('') : '<tr><td colspan="3" style="color:var(--muted)">Нет артефактов</td></tr>';
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

function copyToken() {
  if (navigator.clipboard) navigator.clipboard.writeText(TOKEN);
}

document.head.insertAdjacentHTML('beforeend', '<style>.acc-link{color:var(--acc);text-decoration:none;}.acc-link:hover{text-decoration:underline;}</style>');