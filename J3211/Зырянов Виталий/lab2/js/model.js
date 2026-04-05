(function () {
  function formatNumber(value) {
    return new Intl.NumberFormat("ru-RU", { notation: "compact", compactDisplay: "short" }).format(value || 0);
  }

  function setMessage(text, type) {
    const message = document.getElementById("modelMessage");
    if (!message) return;

    if (!text) {
      message.className = "d-none";
      message.textContent = "";
      return;
    }

    message.className = `alert alert-${type} mb-4`;
    message.textContent = text;
  }

  function getModelIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id") || 1);
    return Number.isFinite(id) && id > 0 ? id : 1;
  }

  function renderFiles(files) {
    const list = document.getElementById("modelFiles");
    list.innerHTML = "";

    (files || []).forEach(function (file) {
      const li = document.createElement("li");
      li.className = "list-group-item px-0 d-flex justify-content-between";
      li.innerHTML = `<span>${file.name}</span><strong>${file.size}</strong>`;
      list.appendChild(li);
    });
  }

  function renderReproducibility(steps) {
    const container = document.getElementById("modelReproducibility");
    container.innerHTML = "";

    if (!steps || !steps.length) {
      container.innerHTML = '<p class="mb-0 muted">Данные по воспроизводимости пока не добавлены.</p>';
      return;
    }

    steps.forEach(function (step, index) {
      const block = document.createElement("div");
      block.className = "timeline-item";
      block.innerHTML = `
        <strong>${index + 1}. ${step.title}</strong>
        <p class="mb-0 muted">${step.description}</p>
      `;
      container.appendChild(block);
    });
  }

  function renderDiscussions(items) {
    const container = document.getElementById("modelDiscussions");
    container.innerHTML = "";

    if (!items || !items.length) {
      container.innerHTML = '<p class="mb-0 muted">Обсуждений пока нет.</p>';
      return;
    }

    items.forEach(function (entry) {
      const block = document.createElement("div");
      block.className = "timeline-item";
      block.innerHTML = `
        <strong>${entry.author}</strong>
        <p class="mb-1">${entry.text}</p>
        <div class="muted">
          <small>${entry.timeAgo}</small>
          <small>${entry.replies || 0} ответов</small>
        </div>
      `;
      container.appendChild(block);
    });
  }

  async function loadModel() {
    setMessage("", "info");

    try {
      const modelId = getModelIdFromUrl();
      const model = await Api.get(`/models/${modelId}`);

      document.getElementById("modelTitle").textContent = model.title;
      document.getElementById("modelDescription").textContent = model.description;
      document.getElementById("modelTask").textContent = model.task;
      document.getElementById("modelFramework").textContent = model.framework;
      document.getElementById("modelLongDescription").textContent = model.description;
      document.getElementById("modelBenchmark").textContent = model.benchmark || "-";
      document.getElementById("modelMetricName").textContent = model.metricName || "-";
      document.getElementById("modelMetricScore").textContent = model.metricScore ?? "-";
      document.getElementById("modelMetricDate").textContent = model.createdAt || "-";
      document.getElementById("modelUsageSnippet").textContent = model.usageSnippet || "Код не добавлен";

      document.getElementById("modelStars").textContent = formatNumber(model.stars);
      document.getElementById("modelForks").textContent = formatNumber(model.forks);
      document.getElementById("modelThreads").textContent = formatNumber(model.threads);

      renderFiles(model.files || []);
      renderReproducibility(model.reproducibilitySteps || []);
      renderDiscussions(model.discussions || []);
    } catch (error) {
      if (error.status === 401) {
        Auth.clearSession();
        window.location.href = "authorization.html";
        return;
      }

      if (error.status === 404) {
        setMessage("Модель не найдена", "warning");
        return;
      }

      setMessage(error.message || "Не удалось загрузить модель", "danger");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!Auth.requireAuth()) return;
    Auth.renderAuthNav();
    loadModel();
  });
})();
