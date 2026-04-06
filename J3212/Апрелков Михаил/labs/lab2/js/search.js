function setupBudgetSlider() {
  const range = document.getElementById("budgetRange");
  const output = document.getElementById("budgetValue");
  if (!range || !output) return;
  const update = () => {
    output.textContent = range.value + " ₽";
  };
  update();
  range.addEventListener("input", update);
}

function setupCopyLink() {
  const btn = document.getElementById("copyRouteLinkBtn");
  const input = document.getElementById("shareRouteInput");
  if (!btn || !input) return;
  btn.addEventListener("click", function () {
    const text = input.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast("Ссылка скопирована"),
        () => showToast("Не удалось скопировать")
      );
    } else {
      showToast("Не удалось скопировать");
    }
  });
}

function bindSearchFormSubmitGuard() {
  const form = document.querySelector("[data-search-form]");
  if (!form || form.dataset.submitGuard === "true") return;
  form.dataset.submitGuard = "true";
  form.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();
    },
    true
  );
}

async function initSearchPage() {
  const grid = document.querySelector("[data-routes-grid]");
  if (!grid) return;
  bindSearchFormSubmitGuard();
  setupSaveButtons();
  try {
    const routes = await apiRequest("/routes");
    const user = getCurrentUser();
    const saved = user ? await getSavedRoutesForUser(user.id) : [];
    const savedByRouteId = new Set(saved.map((item) => String(item.routeId)));
    renderRoutes(grid, routes, savedByRouteId);
  } catch (error) {
    showToast("Не удалось загрузить маршруты");
  }
  setupSearchFilters();
}

function renderRoutes(grid, routes, savedByRouteId) {
  const html = routes
    .map((route, index) => {
      const isSaved = savedByRouteId.has(String(route.id));
      const saveClass = isSaved ? "btn-success" : "btn-outline-secondary";
      const saveText = isSaved ? "Сохранено" : "Сохранить";
      const durationGroup = getDurationGroup(route.durationDays);
      const typeLabel = route.type === "nature" ? "Природа" : "Город";
      return (
        '<div class="col-md-6 col-lg-4" data-route-card data-title="' +
        escapeAttr(route.title.toLowerCase()) +
        '" data-type="' +
        escapeAttr(route.type) +
        '" data-budget="' +
        Number(route.budget) +
        '" data-duration-group="' +
        durationGroup +
        '" data-duration-days="' +
        Number(route.durationDays) +
        '" data-route-id="' +
        route.id +
        '" data-original-index="' +
        index +
        '">' +
        '<div class="card tripatropa-card h-100">' +
        '<img src="' +
        escapeAttr(route.image) +
        '" class="card-img-top" alt="' +
        escapeAttr(route.title) +
        '" />' +
        '<div class="card-body">' +
        '<h5 class="card-title mb-1">' +
        escapeHtml(route.title) +
        "</h5>" +
        '<p class="card-text text-muted-sm mb-2">' +
        escapeHtml(route.description) +
        "</p>" +
        '<div class="mb-3 d-flex flex-wrap gap-2">' +
        '<span class="badge bg-primary-subtle text-primary">' +
        iconSprite("buildings", "me-1") +
        " " +
        escapeHtml(typeLabel) +
        "</span>" +
        '<span class="badge bg-success-subtle text-success">' +
        Number(route.durationDays) +
        " дня</span>" +
        '<span class="badge bg-secondary-subtle text-secondary">' +
        Number(route.budget).toLocaleString("ru-RU") +
        " ₽</span>" +
        "</div>" +
        '<div class="d-flex justify-content-between align-items-center mt-auto">' +
        '<a href="destination.html?id=' +
        route.id +
        '" class="btn btn-outline-primary btn-sm">Открыть</a>' +
        '<button type="button" class="btn btn-sm btn-save-route ' +
        saveClass +
        '" data-saved="' +
        (isSaved ? "true" : "false") +
        '" data-route-id="' +
        route.id +
        '">' +
        saveText +
        "</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");
  grid.innerHTML = html;
}

function getDurationGroup(days) {
  const value = Number(days);
  if (value <= 3) return "1-3";
  if (value <= 7) return "4-7";
  if (value <= 14) return "8-14";
  return "15+";
}

function setupSaveButtons() {
  const grid = document.querySelector("[data-routes-grid]");
  if (!grid || grid.dataset.saveBound === "true") return;
  grid.dataset.saveBound = "true";
  grid.addEventListener("click", async function (e) {
    const btn = e.target.closest(".btn-save-route");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      showToast("Войдите, чтобы сохранять маршруты");
      return;
    }
    const uid = Number(currentUser.id);
    if (!Number.isFinite(uid)) {
      showToast("Ошибка сессии — войдите снова");
      return;
    }
    const routeId = Number(btn.dataset.routeId);
    if (!Number.isFinite(routeId)) {
      showToast("Не удалось определить маршрут");
      return;
    }
    try {
      const isSaved = btn.getAttribute("data-saved") === "true";
      if (isSaved) {
        const savedItems = (await getSavedRoutesForUser(uid)).filter(function (item) {
          return Number(item.routeId) === routeId;
        });
        if (savedItems.length) {
          await apiRequest("/savedRoutes/" + savedItems[0].id, {
            method: "DELETE"
          });
        }
        btn.setAttribute("data-saved", "false");
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline-secondary");
        btn.textContent = "Сохранить";
        showToast("Маршрут удалён из сохранённых");
      } else {
        await apiRequest("/savedRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: uid,
            routeId: routeId
          })
        });
        btn.setAttribute("data-saved", "true");
        btn.classList.remove("btn-outline-secondary");
        btn.classList.add("btn-success");
        btn.textContent = "Сохранено";
        showToast("Маршрут сохранён");
      }
    } catch (error) {
      showToast("Ошибка сохранения маршрута");
    }
  });
}

function setupSearchFilters() {
  const form = document.querySelector("[data-search-form]");
  const grid = document.querySelector("[data-routes-grid]");
  if (!form || !grid) return;
  if (form.dataset.filtersBound === "true") return;
  form.dataset.filtersBound = "true";
  const destinationInput = document.getElementById("destinationInput");
  const typeSelect = document.getElementById("typeSelect");
  const budgetRange = document.getElementById("budgetRange");
  const durationSelect = document.getElementById("durationSelect");
  const sortSelect = document.getElementById("sortSelect");
  const countEl = document.getElementById("routesCount");
  const cards = Array.from(grid.querySelectorAll("[data-route-card]"));

  function applyFilters() {
    const query = destinationInput ? destinationInput.value.trim().toLowerCase() : "";
    const typeValue = typeSelect ? typeSelect.value : "any";
    const budgetMax = budgetRange ? Number(budgetRange.value) : Number.POSITIVE_INFINITY;
    const durationValue = durationSelect ? durationSelect.value : "any";
    let visibleCount = 0;
    cards.forEach((card) => {
      const title = (card.dataset.title || "").toLowerCase();
      const cardType = card.dataset.type || "city";
      const cardBudget = Number(card.dataset.budget || "0");
      const cardDurationGroup = card.dataset.durationGroup || "any";
      let visible = true;
      if (query && !title.includes(query)) visible = false;
      if (visible && typeValue !== "any" && cardType !== typeValue) visible = false;
      if (visible && cardBudget > budgetMax) visible = false;
      if (visible && durationValue !== "any" && cardDurationGroup !== durationValue) visible = false;
      card.style.display = visible ? "" : "none";
      if (visible) visibleCount += 1;
    });
    if (countEl) {
      countEl.textContent = visibleCount + " " + getRoutesWord(visibleCount);
    }
  }

  function sortCards() {
    if (!sortSelect) return;
    const mode = sortSelect.value;
    const sorted = [...cards].sort((a, b) => {
      if (mode === "price") {
        return Number(a.dataset.budget || "0") - Number(b.dataset.budget || "0");
      }
      if (mode === "duration") {
        return Number(a.dataset.durationDays || "0") - Number(b.dataset.durationDays || "0");
      }
      return Number(a.dataset.originalIndex || "0") - Number(b.dataset.originalIndex || "0");
    });
    sorted.forEach((card) => grid.appendChild(card));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sortCards();
    applyFilters();
  });
  if (destinationInput) destinationInput.addEventListener("input", applyFilters);
  if (typeSelect) typeSelect.addEventListener("change", applyFilters);
  if (budgetRange) budgetRange.addEventListener("input", applyFilters);
  if (durationSelect) durationSelect.addEventListener("change", applyFilters);
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortCards();
      applyFilters();
    });
  }
  sortCards();
  applyFilters();
}

function getRoutesWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "маршрут";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "маршрута";
  return "маршрутов";
}
