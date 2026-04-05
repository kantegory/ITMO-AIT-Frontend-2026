(function () {
  function formatNumber(value) {
    return new Intl.NumberFormat("ru-RU", { notation: "compact", compactDisplay: "short" }).format(value || 0);
  }

  function setMessage(text, type) {
    const message = document.getElementById("profileMessage");
    if (!message) return;

    if (!text) {
      message.className = "d-none";
      message.textContent = "";
      return;
    }

    message.className = `alert alert-${type} mb-4`;
    message.textContent = text;
  }

  function renderModels(models) {
    const body = document.getElementById("modelsTableBody");
    body.innerHTML = "";

    if (!models.length) {
      body.innerHTML = '<tr><td colspan="4" class="muted">Пока нет загруженных моделей</td></tr>';
      return;
    }

    models.forEach(function (model) {
      const tr = document.createElement("tr");
      const statusClass = model.status === "private" ? "status-private" : "status-public";
      const statusLabel = model.status === "private" ? "Private" : "Public";

      tr.innerHTML = `
        <td><a href="model.html?id=${model.id}">${model.title}</a></td>
        <td>${model.task}</td>
        <td>${model.framework}</td>
        <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      `;
      body.appendChild(tr);
    });
  }

  function renderDatasets(datasets) {
    const body = document.getElementById("datasetsTableBody");
    body.innerHTML = "";

    if (!datasets.length) {
      body.innerHTML = '<tr><td colspan="3" class="muted">Пока нет загруженных датасетов</td></tr>';
      return;
    }

    datasets.forEach(function (dataset) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dataset.title}</td>
        <td>${dataset.type}</td>
        <td>${dataset.size}</td>
      `;
      body.appendChild(tr);
    });
  }

  function renderSubscriptions(subscriptions) {
    const list = document.getElementById("subscriptionsList");
    list.innerHTML = "";

    if (!subscriptions.length) {
      list.innerHTML = '<li class="list-group-item px-0 muted">Подписок пока нет</li>';
      return;
    }

    subscriptions.forEach(function (subscription) {
      const li = document.createElement("li");
      li.className = "list-group-item px-0 profile-subscription-item";
      li.innerHTML = `
        <span class="profile-subscription-name">${subscription.name}</span>
        <span class="profile-subscription-note muted">(${subscription.note || "без описания"})</span>
      `;
      list.appendChild(li);
    });
  }

  async function loadProfile() {
    setMessage("", "info");

    try {
      const [user, models, datasets, subscriptions] = await Promise.all([
        Api.get("/me"),
        Api.get("/my/models"),
        Api.get("/my/datasets"),
        Api.get("/my/subscriptions")
      ]);

      document.getElementById("profileFullName").textContent = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
      document.getElementById("profileRole").textContent = user.role || "Роль не указана";
      document.getElementById("profileRepos").textContent = `${user.publicRepos || 0} публичных репозиториев`;
      document.getElementById("profileStars").textContent = `${formatNumber(user.stars)} звёзд`;
      document.getElementById("profileBio").textContent = user.bio || "Описание пользователя не заполнено";

      document.getElementById("metricModels").textContent = models.length;
      document.getElementById("metricDatasets").textContent = datasets.length;

      renderModels(models);
      renderDatasets(datasets);
      renderSubscriptions(subscriptions);
    } catch (error) {
      if (error.status === 401) {
        Auth.clearSession();
        window.location.href = "authorization.html";
        return;
      }

      setMessage(error.message || "Не удалось загрузить профиль", "danger");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!Auth.requireAuth()) return;
    Auth.renderAuthNav();
    loadProfile();
  });
})();
