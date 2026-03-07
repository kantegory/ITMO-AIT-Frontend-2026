document.addEventListener("DOMContentLoaded", function () {
  setupBudgetSlider();
  setupSaveButtons();
  setupNoteSaving();
  setupCopyLink();
  setupSearchFilters();
});

function showToast(message) {
  const toastEl = document.getElementById("mainToast");
  if (!toastEl || typeof bootstrap === "undefined") return;

  const body = toastEl.querySelector(".toast-body");
  if (body) {
    body.textContent = message;
  }

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

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

function setupSaveButtons() {
  const buttons = document.querySelectorAll(".btn-save-route");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const saved = this.getAttribute("data-saved") === "true";
      if (saved) {
        this.setAttribute("data-saved", "false");
        this.classList.remove("btn-success");
        this.classList.add("btn-outline-secondary");
        this.textContent = "Сохранить";
        showToast("Маршрут удалён из сохранённых ");
      } else {
        this.setAttribute("data-saved", "true");
        this.classList.remove("btn-outline-secondary");
        this.classList.add("btn-success");
        this.textContent = "Сохранено";
        showToast("Маршрут сохранён ");
      }
    });
  });
}

function setupNoteSaving() {
  const btn = document.getElementById("saveNoteBtn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    showToast("Заметка сохранена ");
  });
}

function setupCopyLink() {
  const btn = document.getElementById("copyRouteLinkBtn");
  const input = document.getElementById("shareRouteInput");
  if (!btn || !input) return;

  btn.addEventListener("click", function () {
    const text = input.value;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast("Ссылка скопирована "),
        () => showToast("Не удалось скопировать ")
      );
    } else {
      showToast("Не удалось скопировать ");
    }
  });
}

function setupSearchFilters() {
  const form = document.querySelector("[data-search-form]");
  const grid = document.querySelector("[data-routes-grid]");
  if (!form || !grid) return;

  const destinationInput = document.getElementById("destinationInput");
  const typeSelect = document.getElementById("typeSelect");
  const budgetRange = document.getElementById("budgetRange");
  const durationSelect = document.getElementById("durationSelect");
  const sortSelect = document.getElementById("sortSelect");
  const countEl = document.getElementById("routesCount");

  const cards = Array.from(grid.querySelectorAll("[data-route-card]"));
  cards.forEach((card, index) => {
    if (!card.dataset.originalIndex) {
      card.dataset.originalIndex = String(index);
    }
  });

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

      if (query && !title.includes(query)) {
        visible = false;
      }

      if (visible && typeValue !== "any" && cardType !== typeValue) {
        visible = false;
      }

      if (visible && cardBudget > budgetMax) {
        visible = false;
      }

      if (visible && durationValue !== "any" && cardDurationGroup !== durationValue) {
        visible = false;
      }

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
        const aPrice = Number(a.dataset.budget || "0");
        const bPrice = Number(b.dataset.budget || "0");
        return aPrice - bPrice;
      }
      if (mode === "duration") {
        const aDur = Number(a.dataset.durationDays || "0");
        const bDur = Number(b.dataset.durationDays || "0");
        return aDur - bDur;
      }
      const aIndex = Number(a.dataset.originalIndex || "0");
      const bIndex = Number(b.dataset.originalIndex || "0");
      return aIndex - bIndex;
    });

    sorted.forEach((card) => grid.appendChild(card));
  }

  function getRoutesWord(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "маршрут";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "маршрута";
    return "маршрутов";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sortCards();
    applyFilters();
  });

  if (destinationInput) {
    destinationInput.addEventListener("input", applyFilters);
  }
  if (typeSelect) {
    typeSelect.addEventListener("change", applyFilters);
  }
  if (budgetRange) {
    budgetRange.addEventListener("input", applyFilters);
  }
  if (durationSelect) {
    durationSelect.addEventListener("change", applyFilters);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortCards();
      applyFilters();
    });
  }
  sortCards();
  applyFilters();
}


