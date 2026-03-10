const reportPresets = {
  week: {
    spend: "₽ 18 900",
    average: "₽ 1 720",
    category: "Дом",
    forecast: "₽ 41 500",
    forecastText: "Остаток около ₽ 41 500",
    forecastDescription: "Если темп расходов сохранится, лимит бюджета не будет превышен.",
    spendLabels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    spendData: [2100, 1800, 3200, 2600, 2400, 3300, 3500],
    categoryLabels: ["Дом", "Еда", "Транспорт", "Подписки"],
    categoryData: [6500, 4900, 2800, 1600],
  },
  month: {
    spend: "₽ 73 450",
    average: "₽ 2 448",
    category: "Еда",
    forecast: "₽ 27 100",
    forecastText: "Остаток около ₽ 27 100",
    forecastDescription: "Есть небольшой запас, но категория «Еда» растёт быстрее плана.",
    spendLabels: ["1", "5", "10", "15", "20", "25", "30"],
    spendData: [6400, 9100, 8500, 11600, 10800, 12900, 14150],
    categoryLabels: ["Еда", "Дом", "Транспорт", "Подписки"],
    categoryData: [22400, 20600, 10400, 6700],
  },
  quarter: {
    spend: "₽ 201 800",
    average: "₽ 2 242",
    category: "Дом",
    forecast: "₽ 82 000",
    forecastText: "К концу квартала останется около ₽ 82 000",
    forecastDescription: "Текущая динамика стабильна, но план по жилью близок к верхней границе.",
    spendLabels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
    spendData: [48100, 52600, 73100, 0, 0, 0],
    categoryLabels: ["Дом", "Еда", "Транспорт", "Подписки"],
    categoryData: [68200, 54400, 33300, 14900],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggle();
  initPasswordStrength();
  initTransactionFilters();
  initDashboardModal();
  initReportCharts();
  initImportModal();
});


function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll("[data-password-toggle]");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement?.querySelector("[data-password-input]");

      if (!input) {
        return;
      }

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.innerHTML = isPassword ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });
  });
}

function initPasswordStrength() {
  const input = document.querySelector("[data-strength-input]");
  const bar = document.querySelector("[data-strength-bar]");
  const text = document.querySelector("[data-strength-text]");

  if (!input || !bar || !text) {
    return;
  }

  input.addEventListener("input", () => {
    const value = input.value.trim();
    let width = 12;
    let label = "Укажите пароль";
    let color = "#ef7e56";

    if (value.length >= 6) {
      width = 45;
      label = "Средний пароль";
      color = "#d29a2c";
    }

    if (value.length >= 10 && /\d/.test(value) && /[A-ZА-Я]/.test(value)) {
      width = 100;
      label = "Надёжный пароль";
      color = "#0f766e";
    }

    bar.style.width = `${width}%`;
    bar.style.backgroundColor = color;
    text.textContent = label;
  });
}

function initTransactionFilters() {
  const list = document.querySelector("[data-transaction-list]");

  if (!list) {
    return;
  }

const items = Array.from(list.querySelectorAll(".transaction-item"));
const searchInput = document.querySelector("[data-filter-search]");
const categoryInput = document.querySelector("[data-filter-category]");
const amountInput = document.querySelector("[data-filter-amount]");
const dateFromInput = document.querySelector("[data-filter-date-from]");
const dateToInput = document.querySelector("[data-filter-date-to]");
const countElement = document.querySelector("[data-transaction-count]");
const emptyState = document.querySelector("[data-empty-state]");
const resetButton = document.querySelector("[data-filter-reset]");

const applyFilters = () => {
  const searchValue = (searchInput?.value || "").trim().toLowerCase();
  const category = categoryInput?.value || "all";
  const amount = Number(amountInput?.value || 0);
  const dateFrom = dateFromInput?.value || "";
  const dateTo = dateToInput?.value || "";

  let visibleCount = 0;

  items.forEach((item) => {
    const itemCategory = item.dataset.category || "";
    const itemAmount = Number(item.dataset.amount || 0);
    const itemDate = item.dataset.date || "";
    const itemText = item.textContent?.toLowerCase() || "";

    const matchesSearch = !searchValue || itemText.includes(searchValue);
    const matchesCategory = category === "all" || itemCategory === category;
    const matchesAmount = !amount || itemAmount <= amount;
    const matchesFrom = !dateFrom || itemDate >= dateFrom;
    const matchesTo = !dateTo || itemDate <= dateTo;
    const isVisible = matchesSearch && matchesCategory && matchesAmount && matchesFrom && matchesTo;

    item.classList.toggle("d-none", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (countElement) {
    countElement.textContent = String(visibleCount);
  }

  emptyState?.classList.toggle("d-none", visibleCount !== 0);
};

[searchInput, categoryInput, amountInput, dateFromInput, dateToInput].forEach((element) => {
  element?.addEventListener("input", applyFilters);
  element?.addEventListener("change", applyFilters);
});

resetButton?.addEventListener("click", () => {
  if (searchInput) {
    searchInput.value = "";
  }

  if (categoryInput) {
    categoryInput.value = "all";
  }

  if (amountInput) {
    amountInput.value = "";
  }

  if (dateFromInput) {
    dateFromInput.value = "";
  }

  if (dateToInput) {
    dateToInput.value = "";
  }

  applyFilters();
});
}

function initDashboardModal() {
  const actionModal = document.getElementById("actionModal");

  if (actionModal) {
    actionModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      const title = trigger?.getAttribute("data-action-title") || "Быстрое действие";
      const text = trigger?.getAttribute("data-action-text") || "";
      const titleNode = actionModal.querySelector("[data-modal-title]");
      const textNode = actionModal.querySelector("[data-modal-text]");

      if (titleNode) {
        titleNode.textContent = title;
      }

      if (textNode) {
        textNode.textContent = text;
      }
    });
  }
}


