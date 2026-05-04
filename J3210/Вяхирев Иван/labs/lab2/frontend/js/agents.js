let allAgents = [];

function checkAuth() {
  if (!localStorage.accessToken) window.location.href = "login.html";
  else document.getElementById('username').innerText = JSON.parse(localStorage.user).email;
}

function logout() { 
  localStorage.clear(); 
  window.location.href = "login.html"; 
}

async function loadAgents() {
  const response = await fetch('http://localhost:8000/api/agents');
  allAgents = await response.json();
  renderAgents(allAgents);
}

function renderAgents(agents) {
  const container = document.getElementById('agents-container');
  container.innerHTML = '';
  agents.forEach(agent => {
    const colorClass = agent.role === 'Attacker' ? 'text-danger' : 'text-info';
    const iconId = agent.role === 'Attacker' ? '#radioactive' : '#shield';
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100 border-0 shadow-sm text-center">
          <div class="card-body">
            <svg class="icon icon-lg ${colorClass} mb-3">
              <use href="assets/sprite.svg${iconId}"></use>
            </svg>
            <h6>${agent.name}</h6>
            <span class="badge ${agent.role === 'Attacker' ? 'bg-danger' : 'bg-info'}">${agent.role}</span>
            <p class="small text-muted mt-2">${agent.description}</p>
          </div>
        </div>
      </div>`;
  });
}

function applyFilters() {
  const role = document.getElementById('filterRole').value;
  const aggro = parseFloat(document.getElementById('filterAggro').value);
  const filtered = allAgents.filter(a => (role === 'Все' || a.role === role) && a.aggressiveness <= aggro);
  renderAgents(filtered);
}

async function handleCreateAgent(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  data.aggressiveness = parseFloat(data.aggressiveness);

  const response = await fetch('http://localhost:8000/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    event.target.reset();
    loadAgents();
  } else {
    const errorDetail = await response.json();
    alert("Ошибка: " + JSON.stringify(errorDetail.detail));
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  checkAuth(); 
  loadAgents(); 
});
