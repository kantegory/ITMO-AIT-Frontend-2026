requireAuth();

var STATUS_CLASSES = {
  success: 'bg-success',
  failed: 'bg-danger',
  running: 'bg-warning text-dark'
};

function renderPipelines(pipelines) {
  var tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  pipelines.forEach(function (p) {
    var badgeClass = STATUS_CLASSES[p.status] || 'bg-secondary';
    var label = p.status.charAt(0).toUpperCase() + p.status.slice(1);

    var tr = document.createElement('tr');
    tr.setAttribute('data-status', p.status);
    tr.innerHTML =
      '<td><a href="pipeline-detail.html?id=' + p.id + '" class="pipeline-name">' + p.name + '</a></td>' +
      '<td><code>' + p.schedule + '</code></td>' +
      '<td>' + p.lastRun + '</td>' +
      '<td><span class="badge ' + badgeClass + '">' + label + '</span></td>' +
      '<td>' +
        '<button type="button" class="btn btn-sm btn-outline-success" aria-label="Trigger run for ' + p.name + '"><i class="bi bi-play-fill" aria-hidden="true"></i></button> ' +
        '<button type="button" class="btn btn-sm btn-outline-secondary" aria-label="Pause ' + p.name + '"><i class="bi bi-pause-fill" aria-hidden="true"></i></button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function setupSearch() {
  document.getElementById('searchInput').addEventListener('input', function () {
    var query = this.value.toLowerCase();
    var rows = document.querySelectorAll('tbody tr');
    rows.forEach(function (row) {
      var name = row.querySelector('.pipeline-name').textContent.toLowerCase();
      row.style.display = name.indexOf(query) !== -1 ? '' : 'none';
    });
  });
}

function setupFilters() {
  var buttons = document.querySelectorAll('[data-filter]');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      var filter = this.getAttribute('data-filter');
      var rows = document.querySelectorAll('tbody tr');
      rows.forEach(function (row) {
        if (filter === 'all' || row.getAttribute('data-status') === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

api('/pipelines')
  .then(function (pipelines) {
    renderPipelines(pipelines);
    setupSearch();
    setupFilters();
  })
  .catch(function (err) {
    document.querySelector('tbody').innerHTML =
      '<tr><td colspan="5" class="text-center text-danger p-4">Failed to load pipelines. Is json-server running?</td></tr>';
  });
