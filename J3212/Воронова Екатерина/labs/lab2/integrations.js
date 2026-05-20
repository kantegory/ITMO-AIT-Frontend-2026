document.addEventListener("DOMContentLoaded", async () => {
  const user = requireAuth();

  const userName = document.querySelector(".user-chip span");
  if (userName) {
    userName.textContent = user.name;
  }

  const integrations = await apiGet(`/integrations?userId=${user.id}`);
  const rules = await apiGet(`/rules?userId=${user.id}`);

  renderIntegrations(integrations);
  renderRules(rules);
});

function renderIntegrations(items) {
  const container = document.getElementById("integrationsContainer");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="col-md-6 col-xl-4">
      <div class="dashboard-card integration-card h-100">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">${item.name}</h5>
          <span class="status-badge ${item.connected ? "success" : "warning"}">
            ${item.connected ? "Подключено" : "Не подключено"}
          </span>
        </div>
        <p class="text-muted">${item.description}</p>
        <button
          class="btn ${item.connected ? "btn-outline-main" : "btn-main"} w-100"
          aria-label="${item.connected ? `Отключить интеграцию ${item.name}` : `Подключить интеграцию ${item.name}`}"
        >
          ${item.connected ? "Отключить" : "Подключить"}
        </button>
      </div>
    </div>
  `).join("");
}

function renderRules(items) {
  const container = document.getElementById("rulesContainer");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="rule-item">
      <div>
        <strong>${item.condition} → ${item.category}</strong>
        <p>${item.description}</p>
      </div>
      <button
        class="btn btn-sm btn-outline-main"
        aria-label="Изменить правило ${item.condition} → ${item.category}"
      >
        Изменить
      </button>
    </div>
  `).join("");
}