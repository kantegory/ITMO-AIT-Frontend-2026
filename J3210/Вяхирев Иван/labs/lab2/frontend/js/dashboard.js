function checkAuth() {
  if (!localStorage.accessToken) {
    window.location.href = "login.html";
  } else {
    const user = JSON.parse(localStorage.user);
    document.getElementById('username').innerText = user.email;
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function loadSimulations() {
  try {
    const response = await fetch('http://localhost:8000/api/simulations');
    if (!response.ok) throw new Error("Ошибка API");
    const sims = await response.json();
    const container = document.getElementById('simulations-container');
    container.innerHTML = '';

    sims.forEach(sim => {
      container.innerHTML += `
        <div class="col-md-4 mb-3">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-dark text-white">
              ${sim.name} <span class="badge bg-secondary float-end">${sim.status}</span>
            </div>
            <div class="card-body d-flex flex-column">
              <p class="mb-1"><strong>Blue Team:</strong> ${sim.blue_team_name}</p>
              <p class="mb-2"><strong>Red Team:</strong> ${sim.red_team_name}</p>
              <p class="small text-muted flex-grow-1">${sim.description}</p>
              <a href="main-chat.html" class="btn btn-primary w-100 mt-2">Войти в симуляцию</a>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
  }
}

async function createSimulation(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://localhost:8000/api/simulations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      location.reload();
    } else {
      const err = await response.json();
      alert("Ошибка создания: " + JSON.stringify(err.detail));
    }
  } catch (error) {
    alert("Ошибка сети. Убедитесь, что backend запущен.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadSimulations();
});
