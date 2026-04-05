(function () {
  const state = {
    models: []
  };

  function formatNumber(value) {
    return new Intl.NumberFormat("ru-RU", { notation: "compact", compactDisplay: "short" }).format(value || 0);
  }

  function getFilters() {
    return {
      query: document.getElementById("searchInput").value.trim().toLowerCase(),
      task: document.getElementById("task").value,
      size: document.getElementById("size").value,
      framework: document.getElementById("framework").value,
      sort: document.getElementById("sortSelect").value
    };
  }

  function setMessage(text, type) {
    const message = document.getElementById("searchMessage");
    if (!message) return;

    if (!text) {
      message.className = "d-none";
      message.textContent = "";
      return;
    }

    message.className = `alert alert-${type} mb-3`;
    message.textContent = text;
  }

  function renderActiveChips(filters) {
    const chipBox = document.getElementById("activeChips");
    chipBox.innerHTML = "";

    const chips = [];
    if (filters.task !== "Любая") chips.push(filters.task);
    if (filters.framework !== "Любой") chips.push(filters.framework);
    if (filters.size !== "Любой") chips.push(filters.size);
    if (filters.query) chips.push(`Запрос: ${filters.query}`);

    if (!chips.length) {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = "Без фильтров";
      chipBox.appendChild(span);
      return;
    }

    chips.forEach(function (chipText) {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = chipText;
      chipBox.appendChild(span);
    });
  }

  function applyFilters() {
    const filters = getFilters();

    let filtered = state.models.filter(function (model) {
      const haystack = `${model.title} ${model.description} ${model.task} ${model.framework}`.toLowerCase();
      const byQuery = !filters.query || haystack.includes(filters.query);
      const byTask = filters.task === "Любая" || model.task === filters.task;
      const bySize = filters.size === "Любой" || model.size === filters.size;
      const byFramework = filters.framework === "Любой" || model.framework === filters.framework;
      return byQuery && byTask && bySize && byFramework;
    });

    if (filters.sort === "new") {
      filtered = filtered.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      filtered = filtered.sort(function (a, b) {
        return (b.downloads || 0) - (a.downloads || 0);
      });
    }

    renderActiveChips(filters);
    renderResults(filtered);
  }

  function renderResults(items) {
    const title = document.getElementById("resultsTitle");
    const list = document.getElementById("resultList");

    title.textContent = `Найдено ${items.length} результат(ов)`;
    list.innerHTML = "";

    if (!items.length) {
      list.innerHTML = '<div class="hub-card p-4"><p class="mb-0 muted">Ничего не найдено по выбранным фильтрам.</p></div>';
      return;
    }

    items.forEach(function (model) {
      const article = document.createElement("article");
      article.className = "hub-card result-card p-4 mb-3";

      const statusClass = model.status === "private" ? "status-private" : "status-public";
      const statusLabel = model.status === "private" ? "Private" : "Public";

      article.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap gap-2">
          <h3 class="h5 mb-1"><a href="model.html?id=${model.id}">${model.title}</a></h3>
          <span class="status-badge ${statusClass}">Model ${statusLabel}</span>
        </div>
        <p class="muted mb-2">${model.description}</p>
        <div class="mb-2">
          <span class="chip">${model.task}</span>
          <span class="chip">${model.framework}</span>
          <span class="chip">${model.size}</span>
        </div>
        <div class="muted">
          <small>${formatNumber(model.downloads)} загрузок</small>
          <small>${formatNumber(model.stars)} звёзд</small>
          <small>Воспроизводимость: ${model.reproducibility || 0}%</small>
        </div>
      `;

      list.appendChild(article);
    });
  }

  async function loadModels() {
    setMessage("", "info");

    try {
      state.models = await Api.get("/models");
      applyFilters();
    } catch (error) {
      if (error.status === 401) {
        Auth.clearSession();
        window.location.href = "authorization.html";
        return;
      }

      setMessage(error.message || "Не удалось загрузить модели", "danger");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!Auth.requireAuth()) return;
    Auth.renderAuthNav();

    document.getElementById("applyFiltersBtn").addEventListener("click", applyFilters);
    document.getElementById("sortSelect").addEventListener("change", applyFilters);
    document.getElementById("searchInput").addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        applyFilters();
      }
    });

    loadModels();
  });
})();
