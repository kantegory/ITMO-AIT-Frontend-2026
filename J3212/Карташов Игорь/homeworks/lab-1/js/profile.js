requireAuth();

var userId = getSession();

function renderProfile(user) {
  var initials = (user.firstName || '').charAt(0) + (user.lastName || '').charAt(0);
  document.getElementById('profileInitials').textContent = initials;
  document.getElementById('profileName').textContent = user.firstName + ' ' + user.lastName;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileRole').textContent = user.role;
  document.getElementById('profileTeam').textContent = user.team || '—';
  document.getElementById('profileTimezone').textContent = user.timezone || '—';
  document.getElementById('profileSince').textContent = user.memberSince || '—';
}

function renderStats(pipelines, runs) {
  document.getElementById('statDags').textContent = pipelines.length;
  document.getElementById('statRuns').textContent = runs.length;

  var successful = runs.filter(function (r) { return r.status === 'success'; }).length;
  var rate = runs.length > 0 ? ((successful / runs.length) * 100).toFixed(1) + '%' : '—';
  document.getElementById('statRate').textContent = rate;

  document.getElementById('statAvg').textContent = '3m 44s';
}

function renderConnections(connections) {
  var container = document.getElementById('connectionsList');
  container.innerHTML = '';

  connections.forEach(function (c) {
    var statusClass = c.status === 'Active' ? 'bg-success' : 'bg-warning text-dark';
    var div = document.createElement('div');
    div.className = 'connection-item mb-3';
    div.innerHTML =
      '<i class="bi bi-' + c.icon + ' text-' + c.iconColor + ' fs-5"></i>' +
      '<div class="flex-grow-1">' +
        '<strong>' + c.name + '</strong><br>' +
        '<small class="text-muted">' + c.type + ' — ' + c.host + '</small>' +
      '</div>' +
      '<span class="badge ' + statusClass + '">' + c.status + '</span>';
    container.appendChild(div);
  });
}

Promise.all([
  api('/users/' + userId),
  api('/pipelines'),
  api('/runs'),
  api('/connections?userId=' + userId)
])
  .then(function (results) {
    renderProfile(results[0]);
    renderStats(results[1], results[2]);
    renderConnections(results[3]);
  })
  .catch(function () {
    document.getElementById('profileName').textContent = 'Error loading profile';
  });
