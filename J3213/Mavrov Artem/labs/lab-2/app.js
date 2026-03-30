'use strict';

var currentUser = null;
var experiments = [];
var models      = [];
var artifacts   = [];
var openExpId   = null;
var tokenVisible = false;

document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('demo-cred');
  if (el) el.textContent = 'admin' + '@' + 'ml.pipe  /  admin123';

  if (getToken()) {
    showLoader(true);
    API.me()
      .then(function(user) {
        currentUser = user;
        startApp();
      })
      .catch(function() {
        setToken(null);
        showLoader(false);
      });
  }
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
  var email = document.getElementById('li-email').value.trim();
  var pass  = document.getElementById('li-pass').value;
  var err   = document.getElementById('li-err');

  if (!email || !pass) {
    err.textContent = 'Введите email и пароль';
    err.classList.remove('d-none'); return;
  }

  var btn = document.querySelector('#form-login .btn-accent');
  btn.textContent = 'Вход...';
  btn.disabled = true;

  API.login(email, pass)
    .then(function(user) {
      err.classList.add('d-none');
      currentUser = user;
      startApp();
    })
    .catch(function(e) {
      err.textContent = e.message || 'Ошибка входа';
      err.classList.remove('d-none');
    })
    .finally(function() {
      btn.textContent = 'Войти';
      btn.disabled = false;
    });
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

  var btn = document.querySelector('#form-register .btn-accent');
  btn.textContent = 'Создание...';
  btn.disabled = true;

  API.register(name, email, pass, role)
    .then(function(user) {
      err.classList.add('d-none');
      currentUser = user;
      startApp();
    })
    .catch(function(e) {
      err.textContent = e.message || 'Ошибка регистрации';
      err.classList.remove('d-none');
    })
    .finally(function() {
      btn.textContent = 'Создать аккаунт';
      btn.disabled = false;
    });
}

function doLogout() {
  API.logout().finally(function() {
    currentUser = null;
    experiments = []; models = []; artifacts = [];
    document.getElementById('screen-app').classList.add('d-none');
    document.getElementById('screen-app').style.display = '';
    document.getElementById('screen-auth').style.display = '';
    switchForm('login');
  });
}

function startApp() {
  showLoader(false);
  document.getElementById('screen-auth').style.display = 'none';
  var app = document.getElementById('screen-app');
  app.classList.remove('d-none');
  app.style.display = 'flex';
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

  var titles = {
    dashboard: 'Дашборд', experiments: 'Эксперименты',
    'exp-detail': 'Эксперимент', models: 'Model Registry',
    artifacts: 'Артефакт-стор', profile: 'Мой кабинет'
  };
  document.getElementById('tb-title').textContent = titles[view] || view;

  if (view === 'dashboard')   loadDashboard();
  if (view === 'experiments') loadExperiments();
  if (view === 'models')      loadModels();
  if (view === 'artifacts')   loadArtifacts();
  if (view === 'profile')     loadProfile();
  return false;
}

function loadDashboard() {
  showLoader(true);
  Promise.all([API.getExperiments(), API.getModels()])
    .then(function(results) {
      experiments = results[0];
      models      = results[1];
      renderDashboard();
    })
    .catch(function(e) { showApiError(e.message); })
    .finally(function() { showLoader(false); });
}

function renderDashboard() {
  document.getElementById('kpi-exp').textContent    = experiments.length;
  document.getElementById('kpi-runs').textContent   = experiments.reduce(function(s,e){return s+e.runs;},0);
  document.getElementById('kpi-models').textContent = models.length;
  document.getElementById('kpi-prod').textContent   = models.filter(function(m){return m.stage==='prod';}).length;

  document.getElementById('dash-exp-list').innerHTML = experiments.slice(0,4).map(function(e){
    return '<tr><td><a href="#" class="acc-link" onclick="openExp('+e.id+')">'+e.name+'</a></td>' +
           '<td>'+e.runs+'</td>' +
           '<td><span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'">'+
           (e.status==='active'?'Активен':'Архив')+'</span></td></tr>';
  }).join('');

  document.getElementById('dash-model-list').innerHTML = models.slice(0,4).map(function(m){
    var sl = {prod:'Production',staging:'Staging',dev:'Development',arch:'Archived'}[m.stage];
    return '<tr><td>'+m.name+'</td><td class="mono">'+m.ver+'</td>' +
           '<td><span class="stage-'+m.stage+'">'+sl+'</span></td></tr>';
  }).join('');
}

function loadExperiments() {
  showLoader(true);
  API.getExperiments()
    .then(function(data) {
      experiments = data;
      renderExps(experiments);
    })
    .catch(function(e) { showApiError(e.message); })
    .finally(function() { showLoader(false); });
}

function renderExps(list) {
  var tbody = document.getElementById('exp-tbody'); if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted)">Нет данных</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(function(e){
    var tags = e.tags.split(',').map(function(t){return '<span class="tag-chip">'+t.trim()+'</span>';}).join('');
    return '<tr>' +
      '<td><a href="#" class="acc-link" onclick="openExp('+e.id+')">'+e.name+'</a></td>' +
      '<td class="mono" style="font-size:.8rem">'+e.date+'</td>' +
      '<td>'+tags+'</td><td>'+e.runs+'</td>' +
      '<td class="mono" style="font-size:.8rem">'+e.best+'</td>' +
      '<td><span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'">'+
      (e.status==='active'?'Активен':'Архив')+'</span></td>' +
      '<td><button class="btn-xs" onclick="openExp('+e.id+')">Открыть</button></td></tr>';
  }).join('');
}

function filterExps() {
  var name   = document.getElementById('f-name').value.toLowerCase();
  var from   = document.getElementById('f-date-from').value;
  var to     = document.getElementById('f-date-to').value;
  var metric = document.getElementById('f-metric').value.toLowerCase();
  var tag    = document.getElementById('f-tags').value.toLowerCase().trim();
  var list = experiments.filter(function(e){
    if (name   && e.name.toLowerCase().indexOf(name)===-1) return false;
    if (from   && e.date < from) return false;
    if (to     && e.date > to)   return false;
    if (tag    && e.tags.toLowerCase().indexOf(tag)===-1) return false;
    if (metric) {
      var m = metric.match(/([a-z]+)([><=]+)([\d.]+)/);
      if (m) {
        var re = new RegExp(m[1]+'=([\\d.]+)');
        var res = e.best.match(re);
        if (res) {
          var val = parseFloat(res[1]);
          if (m[2]==='>'  && !(val >  +m[3])) return false;
          if (m[2]==='>=' && !(val >= +m[3])) return false;
          if (m[2]==='<'  && !(val <  +m[3])) return false;
        }
      } else if (e.best.toLowerCase().indexOf(metric)===-1) return false;
    }
    return true;
  });
  renderExps(list);
}

function clearFilters() {
  ['f-name','f-date-from','f-date-to','f-metric','f-tags'].forEach(function(id){
    document.getElementById(id).value='';
  });
  renderExps(experiments);
}

function addExp() {
  var name = document.getElementById('ne-name').value.trim(); if (!name) return;
  var payload = {
    name: name,
    date: new Date().toISOString().slice(0,10),
    tags: document.getElementById('ne-tags').value || '',
    runs: 0, best: '—', status: 'active', owner: currentUser.name
  };
  showLoader(true);
  API.createExperiment(payload)
    .then(function(created) {
      experiments.unshift(created);
      renderExps(experiments);
    })
    .catch(function(e){ showApiError(e.message); })
    .finally(function(){ showLoader(false); });
}

function openExp(id) {
  openExpId = id;
  var e = experiments.find(function(x){return x.id===id;});
  if (!e) return;
  var tags = e.tags.split(',').map(function(t){return '<span class="tag-chip">'+t.trim()+'</span>';}).join('');
  document.getElementById('exp-detail-header').innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.75rem">' +
    '<div><h4 style="font-weight:700;font-family:monospace;margin-bottom:.5rem">'+e.name+'</h4>' +
    '<div>'+tags+'</div></div>' +
    '<div style="text-align:right"><div style="font-size:.8rem;color:var(--muted)">'+e.date+'</div>' +
    '<span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'" style="display:inline-block;margin-top:.35rem">'+
    (e.status==='active'?'Активен':'Архив')+'</span></div></div>' +
    '<div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.75rem">' +
    '<div class="kpi" style="padding:.6rem 1rem"><div class="kpi-v" style="font-size:1.3rem">'+e.runs+'</div><div class="kpi-l">Запусков</div></div>' +
    '<div class="kpi" style="padding:.6rem 1rem"><div class="kpi-v" style="font-size:1.1rem">'+e.best+'</div><div class="kpi-l">Лучшая метрика</div></div>' +
    '</div>';

  expTab(document.querySelector('.tab-item'), 'logs');
  document.querySelectorAll('.view').forEach(function(v){v.classList.add('d-none');});
  document.getElementById('view-exp-detail').classList.remove('d-none');
  document.getElementById('tb-title').textContent = 'Эксперимент';
}

function expTab(el, tab) {
  document.querySelectorAll('.tab-item').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.add('d-none');});
  if (el) el.classList.add('active');
  document.getElementById('tab-'+tab).classList.remove('d-none');
  var e = experiments.find(function(x){return x.id===openExpId;});
  if (!e) return;
  if (tab==='logs')      renderLogs(e);
  if (tab==='metrics')   renderMetrics();
  if (tab==='artifacts') loadExpArtifacts(e);
  if (tab==='viz')       renderViz();
}

function renderLogs(e) {
  document.getElementById('log-content').innerHTML = '';
  document.getElementById('tab-logs').innerHTML =
    '<div class="log-box">' +
    '<span class="log-info">[INFO]  2025-03-02 10:00:01</span>  Experiment <b>'+e.name+'</b> started<br>' +
    '<span class="log-info">[INFO]  2025-03-02 10:00:03</span>  Loading dataset: train_dataset.csv (82 MB)<br>' +
    '<span class="log-info">[INFO]  2025-03-02 10:00:18</span>  Feature engineering: 47 features<br>' +
    '<span class="log-warn">[WARN]  2025-03-02 10:00:19</span>  Missing values — imputing<br>' +
    '<span class="log-info">[INFO]  2025-03-02 10:01:05</span>  Epoch  1/50 — loss: 0.6132<br>' +
    '<span class="log-info">[INFO]  2025-03-02 10:04:52</span>  Epoch 30/50 — loss: 0.2218<br>' +
    '<span class="log-info">[INFO]  2025-03-02 10:07:11</span>  Epoch 50/50 — loss: 0.1940<br>' +
    '<span class="log-ok">[OK]    2025-03-02 10:07:15</span>  Validation: '+e.best+'<br>' +
    '<span class="log-ok">[OK]    2025-03-02 10:07:18</span>  Run completed successfully ✓' +
    '</div>';
}

function renderMetrics() {
  var metrics = [
    {name:'accuracy',val:'0.9470',delta:'+0.012'},
    {name:'f1_score',val:'0.9310',delta:'+0.008'},
    {name:'precision',val:'0.9280',delta:'+0.005'},
    {name:'recall',val:'0.9340',delta:'+0.011'},
    {name:'roc_auc',val:'0.9710',delta:'+0.003'},
    {name:'log_loss',val:'0.1940',delta:'-0.021'}
  ];
  var bars = [38,52,61,73,81,87,91,93,94,94];
  document.getElementById('metrics-content').innerHTML =
    '<div class="metric-grid mb-4">'+
    metrics.map(function(m){
      return '<div class="metric-card"><div class="metric-name">'+m.name+'</div>' +
        '<div class="metric-val">'+m.val+'</div>' +
        '<div class="metric-delta">'+m.delta+' vs prev</div></div>';
    }).join('')+
    '</div><div class="panel"><div class="phead">Training loss (50 эпох)</div>' +
    '<div class="mini-bar-wrap">'+
    bars.map(function(h){return '<div class="mini-bar" style="height:'+h+'px;flex:1"></div>';}).join('')+
    '</div><div style="display:flex;justify-content:space-between;margin-top:.35rem;font-size:.72rem;color:var(--muted)"><span>Эпоха 1</span><span>50</span></div></div>';
}

function loadExpArtifacts(e) {
  document.getElementById('exp-artifacts-content').innerHTML = '<div class="text-muted small">Загрузка...</div>';
  API.getArtifacts()
    .then(function(all) {
      var list = all.filter(function(a){return a.expId===e.id;});
      document.getElementById('exp-artifacts-content').innerHTML = list.length ?
        '<table class="t"><thead><tr><th>Файл</th><th>Тип</th><th>Размер</th><th>Дата</th><th></th></tr></thead><tbody>' +
        list.map(function(a){
          return '<tr><td><i class="bi '+artIcon(a.type)+' art-icon"></i>'+a.name+'</td>' +
            '<td><span class="tag-chip">'+a.type+'</span></td>' +
            '<td class="mono" style="font-size:.8rem">'+a.size+'</td>' +
            '<td class="mono" style="font-size:.8rem">'+a.date+'</td>' +
            '<td><button class="btn-xs">Скачать</button></td></tr>';
        }).join('')+'</tbody></table>'
        : '<div style="color:var(--muted);font-size:.85rem">Нет артефактов для этого эксперимента</div>';
    })
    .catch(function(err){ showApiError(err.message); });
}

function renderViz() {
  var bars = [72,84,89,91,93,95,94,94,94];
  document.getElementById('viz-content').innerHTML =
    '<div class="row g-3">' +
    '<div class="col-md-6"><div class="panel"><div class="phead">ROC-кривая</div>' +
    '<div class="viz-placeholder"><i class="bi bi-graph-up-arrow" style="font-size:2rem"></i><span>AUC = 0.971</span></div></div></div>' +
    '<div class="col-md-6"><div class="panel"><div class="phead">Матрица ошибок</div>' +
    '<div class="viz-placeholder"><i class="bi bi-grid-3x3" style="font-size:2rem"></i><span>TP:892 FP:62 FN:58 TN:918</span></div></div></div>' +
    '<div class="col-12"><div class="panel"><div class="phead">Accuracy по эпохам</div>' +
    '<div class="mini-bar-wrap" style="height:100px">'+
    bars.map(function(h){return '<div class="mini-bar" style="height:'+h+'px;flex:1"></div>';}).join('')+
    '</div></div></div></div>';
}

function loadModels() {
  showLoader(true);
  API.getModels()
    .then(function(data){ models = data; renderModels(); })
    .catch(function(e){ showApiError(e.message); })
    .finally(function(){ showLoader(false); });
}

function renderModels() {
  var stageLabel = {prod:'Production',staging:'Staging',dev:'Development',arch:'Archived'};
  document.getElementById('models-tbody').innerHTML = models.map(function(m,i){
    var actions = '';
    if (m.stage!=='prod'&&m.stage!=='arch') actions+='<button class="btn-xs me-1" onclick="promoteModel('+m.id+')">↑ Promote</button>';
    if (!m.deployed&&m.stage!=='arch') actions+='<button class="btn-xs me-1" onclick="prepDeploy('+i+')" data-bs-toggle="modal" data-bs-target="#m-deploy">Deploy</button>';
    if (m.stage!=='arch') actions+='<button class="btn-xs danger" onclick="archiveModel('+m.id+')">Архив</button>';
    return '<tr>' +
      '<td style="font-weight:600">'+m.name+'</td><td class="mono">'+m.ver+'</td><td>'+m.fw+'</td>' +
      '<td class="mono" style="font-size:.8rem">'+m.metrics+'</td>' +
      '<td><span class="stage-'+m.stage+'">'+(stageLabel[m.stage]||m.stage)+'</span></td>' +
      '<td><span class="dep-badge '+(m.deployed?'dep-on':'dep-off')+'">'+(m.deployed?'Deployed':'—')+'</span></td>' +
      '<td>'+actions+'</td></tr>';
  }).join('');
}

function registerModel() {
  var name = document.getElementById('rm-name').value.trim(); if (!name) return;
  var payload = {
    name: name, ver: document.getElementById('rm-ver').value||'v1.0',
    fw: document.getElementById('rm-fw').value,
    metrics: document.getElementById('rm-metrics').value||'—',
    stage: document.getElementById('rm-stage').value,
    deployed: false, expId: 0, owner: currentUser.name
  };
  showLoader(true);
  API.createModel(payload)
    .then(function(m){ models.push(m); renderModels(); })
    .catch(function(e){ showApiError(e.message); })
    .finally(function(){ showLoader(false); });
}

function promoteModel(id) {
  var order = ['dev','staging','prod'];
  var m = models.find(function(x){return x.id===id;}); if (!m) return;
  var idx = order.indexOf(m.stage);
  if (idx >= order.length-1) return;
  var newStage = order[idx+1];
  API.updateModel(id, { stage: newStage })
    .then(function(updated){
      var i = models.findIndex(function(x){return x.id===id;});
      if (i!==-1) models[i] = updated;
      renderModels();
    })
    .catch(function(e){ showApiError(e.message); });
}

function archiveModel(id) {
  API.updateModel(id, { stage:'arch', deployed:false })
    .then(function(updated){
      var i = models.findIndex(function(x){return x.id===id;});
      if (i!==-1) models[i] = updated;
      renderModels();
    })
    .catch(function(e){ showApiError(e.message); });
}

function prepDeploy(i) {
  document.getElementById('dep-model').value = models[i].name+' '+models[i].ver;
}

function deployDone() {
  var val = document.getElementById('dep-model').value;
  var m = models.find(function(x){return (x.name+' '+x.ver)===val;}); if (!m) return;
  API.updateModel(m.id, { deployed:true, stage:'prod' })
    .then(function(updated){
      var i = models.findIndex(function(x){return x.id===m.id;});
      if (i!==-1) models[i] = updated;
      renderModels();
    })
    .catch(function(e){ showApiError(e.message); });
}

function artIcon(type) {
  return {model:'bi-file-earmark-binary',dataset:'bi-table',plot:'bi-image',config:'bi-file-earmark-code',other:'bi-file-earmark'}[type]||'bi-file-earmark';
}

function loadArtifacts() {
  showLoader(true);
  Promise.all([API.getArtifacts(), API.getExperiments()])
    .then(function(res){ artifacts = res[0]; experiments = res[1]; renderArtifacts(artifacts); })
    .catch(function(e){ showApiError(e.message); })
    .finally(function(){ showLoader(false); });
}

function renderArtifacts(list) {
  var tbody = document.getElementById('art-tbody'); if (!tbody) return;
  tbody.innerHTML = list.map(function(a){
    var expName = '';
    var exp = experiments.find(function(e){return e.id===a.expId;});
    if (exp) expName = exp.name;
    return '<tr>' +
      '<td><i class="bi '+artIcon(a.type)+' art-icon"></i><span class="mono" style="font-size:.8rem">'+a.name+'</span></td>' +
      '<td><span class="tag-chip">'+a.type+'</span></td>' +
      '<td class="mono" style="font-size:.8rem">'+a.size+'</td>' +
      '<td class="mono" style="font-size:.8rem">'+expName+'</td>' +
      '<td class="mono" style="font-size:.8rem">'+a.date+'</td>' +
      '<td style="white-space:nowrap">' +
      '<button class="btn-xs me-1">Скачать</button>' +
      '<button class="btn-xs danger" onclick="deleteArtifact('+a.id+')">Удалить</button>' +
      '</td></tr>';
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted)">Нет артефактов</td></tr>';
}

function filterArtifacts() {
  var q    = document.getElementById('art-search').value.toLowerCase();
  var type = document.getElementById('art-type').value;
  renderArtifacts(artifacts.filter(function(a){
    return (!q||a.name.toLowerCase().indexOf(q)!==-1) && (!type||a.type===type);
  }));
}

function deleteArtifact(id) {
  API.deleteArtifact(id)
    .then(function(){
      artifacts = artifacts.filter(function(a){return a.id!==id;});
      renderArtifacts(artifacts);
    })
    .catch(function(e){ showApiError(e.message); });
}

function previewFile(input) {
  var f = input.files[0];
  document.getElementById('ua-preview').textContent = f ? 'Выбран: '+f.name+' ('+(f.size/1024/1024).toFixed(2)+' MB)' : '';
}

function uploadArtifact() {
  var file  = document.getElementById('ua-file').files[0];
  var expId = parseInt(document.getElementById('ua-exp').value)||0;
  var type  = document.getElementById('ua-type').value;
  if (!file) return;
  var payload = {
    name: file.name, type: type,
    size: (file.size/1024/1024).toFixed(1)+' MB',
    expId: expId, date: new Date().toISOString().slice(0,10),
    owner: currentUser.name
  };
  showLoader(true);
  API.createArtifact(payload)
    .then(function(a){ artifacts.unshift(a); renderArtifacts(artifacts); })
    .catch(function(e){ showApiError(e.message); })
    .finally(function(){ showLoader(false); });
}

function populateExpSelects() {
  ['rm-exp','ua-exp'].forEach(function(id){
    var sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = experiments.map(function(e){
      return '<option value="'+e.id+'">'+e.name+'</option>';
    }).join('');
  });
}

function loadProfile() {
  showLoader(true);
  Promise.all([API.getExperiments(), API.getModels(), API.getArtifacts()])
    .then(function(res){
      experiments = res[0]; models = res[1]; artifacts = res[2];
      renderProfile();
    })
    .catch(function(e){ showApiError(e.message); })
    .finally(function(){ showLoader(false); });
}

function renderProfile() {
  document.getElementById('prof-uname').textContent = currentUser.name;
  document.getElementById('prof-email').textContent = currentUser.email;
  document.getElementById('prof-role').textContent  = currentUser.role;

  var myExps = experiments.filter(function(e){return e.owner===currentUser.name;});
  document.getElementById('prof-exp-list').innerHTML = myExps.length ? myExps.map(function(e){
    return '<tr><td><a href="#" class="acc-link" onclick="openExp('+e.id+')">'+e.name+'</a></td>' +
      '<td>'+e.runs+'</td><td class="mono" style="font-size:.8rem">'+e.best+'</td>' +
      '<td><span class="badge-status '+(e.status==='active'?'bs-ok':'bs-arch')+'">'+
      (e.status==='active'?'Активен':'Архив')+'</span></td>' +
      '<td><button class="btn-xs" onclick="openExp('+e.id+')">Открыть</button></td></tr>';
  }).join('') : '<tr><td colspan="5" style="color:var(--muted)">Нет экспериментов</td></tr>';

  var stageLabel = {prod:'Production',staging:'Staging',dev:'Development',arch:'Archived'};
  var myModels = models.filter(function(m){return m.owner===currentUser.name;});
  document.getElementById('prof-model-list').innerHTML = myModels.length ? myModels.map(function(m){
    return '<tr><td>'+m.name+'</td><td class="mono">'+m.ver+'</td>' +
      '<td><span class="stage-'+m.stage+'">'+(stageLabel[m.stage]||m.stage)+'</span></td></tr>';
  }).join('') : '<tr><td colspan="3" style="color:var(--muted)">Нет моделей</td></tr>';

  var myArts = artifacts.filter(function(a){return a.owner===currentUser.name;});
  document.getElementById('prof-art-list').innerHTML = myArts.length ? myArts.map(function(a){
    return '<tr><td class="mono" style="font-size:.8rem"><i class="bi '+artIcon(a.type)+' art-icon"></i>'+a.name+'</td>' +
      '<td><span class="tag-chip">'+a.type+'</span></td>' +
      '<td class="mono" style="font-size:.8rem">'+a.date+'</td></tr>';
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

var _fullToken = 'mlp_3f9a2b7c1d8e4f5a6b0c9d2e7f1a4b8c';
function toggleToken() {
  tokenVisible = !tokenVisible;
  document.getElementById('api-tok').textContent = tokenVisible ? getToken()||_fullToken : 'mlp_••••••••••••••••••••••••••••';
  event.target.textContent = tokenVisible ? 'Скрыть' : 'Показать';
}
function copyToken() { if (navigator.clipboard) navigator.clipboard.writeText(getToken()||_fullToken); }