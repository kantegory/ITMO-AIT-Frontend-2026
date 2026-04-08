requireAuth();

var params = new URLSearchParams(window.location.search);
var pipelineId = params.get('id') || '1';

var taskModal = null;

function openTask(id, name, start, duration, status) {
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalId').textContent = id;
  document.getElementById('modalStart').textContent = start;
  document.getElementById('modalDuration').textContent = duration;
  document.getElementById('modalStatus').textContent = status;
  if (!taskModal) taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
  taskModal.show();
}

function renderHeader(pipeline) {
  var statusClass = { success: 'bg-success', failed: 'bg-danger', running: 'bg-warning text-dark' };
  var badge = statusClass[pipeline.status] || 'bg-secondary';
  var label = pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1);

  document.getElementById('pipelineName').textContent = pipeline.name;
  document.getElementById('pipelineName2').textContent = pipeline.name;
  document.getElementById('pipelineInfo').innerHTML =
    'Schedule: <code>' + pipeline.schedule + '</code> &middot; Last Run: ' + pipeline.lastRun +
    ' &middot; <span class="badge ' + badge + '">' + label + '</span>';
  document.title = 'DataFlow — ' + pipeline.name;
}

function renderGraph(tasks) {
  var container = document.getElementById('graphContainer');
  container.innerHTML = '';

  var grouped = {};
  tasks.forEach(function (t) {
    if (!grouped[t.order]) grouped[t.order] = [];
    grouped[t.order].push(t);
  });

  var orders = Object.keys(grouped).sort(function (a, b) { return a - b; });

  orders.forEach(function (order, i) {
    var group = grouped[order];

    if (i > 0) {
      var arrow = document.createElement('div');
      arrow.className = 'dag-arrow';
      arrow.innerHTML = '&darr;';
      container.appendChild(arrow);
    }

    if (group.length === 1) {
      var t = group[0];
      var box = document.createElement('div');
      box.className = 'dag-box ' + t.status;
      box.innerHTML = '<i class="bi bi-' + t.icon + '"></i> ' + t.name;
      box.onclick = (function (task) {
        return function () { openTask(task.taskId, task.name, task.start, task.duration, task.status); };
      })(t);
      container.appendChild(box);
    } else {
      var row = document.createElement('div');
      row.className = 'd-flex gap-4';
      group.forEach(function (t) {
        var wrap = document.createElement('div');
        wrap.className = 'text-center';
        var box = document.createElement('div');
        box.className = 'dag-box ' + t.status;
        box.innerHTML = '<i class="bi bi-' + t.icon + '"></i> ' + t.name;
        box.onclick = (function (task) {
          return function () { openTask(task.taskId, task.name, task.start, task.duration, task.status); };
        })(t);
        wrap.appendChild(box);
        row.appendChild(wrap);
      });
      container.appendChild(row);
    }
  });
}

var LOG_CLASSES = { info: 'log-info', ok: 'log-ok', warn: 'log-warn', err: 'log-err' };

function renderLogs(logs) {
  var terminal = document.getElementById('logTerminal');
  terminal.innerHTML = '';
  logs.forEach(function (log) {
    var cls = LOG_CLASSES[log.level] || 'log-info';
    var line = '<span class="log-time">[' + log.time + ']</span> ' +
      '<span class="' + cls + '">' + log.level.toUpperCase() + '</span>  ' + log.message + '\n';
    terminal.innerHTML += line;
  });
}

function renderHistory(runs) {
  var tbody = document.getElementById('historyBody');
  tbody.innerHTML = '';
  var statusClass = { success: 'bg-success', failed: 'bg-danger', running: 'bg-warning text-dark' };

  runs.forEach(function (r) {
    var badge = statusClass[r.status] || 'bg-secondary';
    var label = r.status.charAt(0).toUpperCase() + r.status.slice(1);
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><code>' + r.runId + '</code></td>' +
      '<td>' + r.start + '</td>' +
      '<td>' + r.duration + '</td>' +
      '<td><span class="badge ' + badge + '">' + label + '</span></td>';
    tbody.appendChild(tr);
  });
}

Promise.all([
  api('/pipelines/' + pipelineId),
  api('/tasks?pipelineId=' + pipelineId + '&_sort=order'),
  api('/logs?pipelineId=' + pipelineId),
  api('/runs?pipelineId=' + pipelineId)
])
  .then(function (results) {
    renderHeader(results[0]);
    renderGraph(results[1]);
    renderLogs(results[2]);
    renderHistory(results[3]);
  })
  .catch(function () {
    document.getElementById('graphContainer').innerHTML =
      '<p class="text-danger">Failed to load pipeline data. Is json-server running?</p>';
  });
