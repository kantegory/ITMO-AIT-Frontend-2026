const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const setText = (selector, value, root = document) => {
  const node = $(selector, root);
  if (node) node.textContent = value;
};

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
    forecastDescription: "Есть небольшой запас, но категория «Еда» растет быстрее плана.",
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
  initTransactionFilters();
  initModal("actionModal", { "[data-modal-title]": "data-action-title", "[data-modal-text]": "data-action-text" }, { "[data-modal-title]": "Быстрое действие", "[data-modal-text]": "" });
  initModal("importModal", { "[data-import-provider]": "data-provider" }, { "[data-import-provider]": "выбранный аккаунт" });
  initReportCharts();
});

function initPasswordToggle() {
  $$("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = $("[data-password-input]", button.parentElement);
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.innerHTML = isPassword ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });
  });
}

function initTransactionFilters() {
  const list = $("[data-transaction-list]");
  if (!list) return;

  const items = $$(".transaction-item", list);
  const fields = {
    search: $("[data-filter-search]"),
    category: $("[data-filter-category]"),
    amount: $("[data-filter-amount]"),
    from: $("[data-filter-date-from]"),
    to: $("[data-filter-date-to]"),
  };

  const applyFilters = () => {
    const state = {
      search: fields.search?.value.trim().toLowerCase() || "",
      category: fields.category?.value || "all",
      amount: Number(fields.amount?.value || 0),
      from: fields.from?.value || "",
      to: fields.to?.value || "",
    };

    const visibleCount = items.reduce((count, item) => {
      const matches =
        (!state.search || item.textContent.toLowerCase().includes(state.search)) &&
        (state.category === "all" || item.dataset.category === state.category) &&
        (!state.amount || Number(item.dataset.amount) <= state.amount) &&
        (!state.from || item.dataset.date >= state.from) &&
        (!state.to || item.dataset.date <= state.to);

      item.classList.toggle("d-none", !matches);
      return count + Number(matches);
    }, 0);

    setText("[data-transaction-count]", String(visibleCount));
    $("[data-empty-state]")?.classList.toggle("d-none", visibleCount !== 0);
  };

  Object.values(fields).forEach((field) => {
    field?.addEventListener("input", applyFilters);
    field?.addEventListener("change", applyFilters);
  });

  $("[data-filter-reset]")?.addEventListener("click", () => {
    if (fields.search) fields.search.value = "";
    if (fields.category) fields.category.value = "all";
    if (fields.amount) fields.amount.value = "";
    if (fields.from) fields.from.value = "";
    if (fields.to) fields.to.value = "";
    applyFilters();
  });

  applyFilters();
}

function initModal(id, bindings, defaults = {}) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.addEventListener("show.bs.modal", ({ relatedTarget }) => {
    Object.entries(bindings).forEach(([selector, attribute]) => {
      setText(selector, relatedTarget?.getAttribute(attribute) || defaults[selector] || "", modal);
    });
  });
}

function initReportCharts() {
  const spendCanvas = document.getElementById("spendChart");
  const categoryCanvas = document.getElementById("categoryChart");
  const switcher = $("[data-report-switcher]");

  if (!spendCanvas || !categoryCanvas || !switcher || typeof Chart === "undefined") return;

  const spendChart = new Chart(spendCanvas, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Расходы", data: [], fill: true, borderWidth: 3, borderColor: "#0f766e", backgroundColor: "rgba(15, 118, 110, 0.14)", tension: 0.35, pointBackgroundColor: "#ef7e56", pointRadius: 4 }] },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "rgba(24, 33, 38, 0.08)" } }, x: { grid: { display: false } } } },
  });

  const categoryChart = new Chart(categoryCanvas, {
    type: "doughnut",
    data: { labels: [], datasets: [{ data: [], borderWidth: 0, backgroundColor: ["#0f766e", "#ef7e56", "#4c84ff", "#9a6fdb"] }] },
    options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, usePointStyle: true } } }, cutout: "68%" },
  });

  const applyPreset = (period) => {
    const preset = reportPresets[period];
    if (!preset) return;

    spendChart.data.labels = preset.spendLabels;
    spendChart.data.datasets[0].data = preset.spendData;
    categoryChart.data.labels = preset.categoryLabels;
    categoryChart.data.datasets[0].data = preset.categoryData;
    spendChart.update();
    categoryChart.update();

    setText("[data-kpi-spend]", preset.spend);
    setText("[data-kpi-average]", preset.average);
    setText("[data-kpi-category]", preset.category);
    setText("[data-kpi-forecast]", preset.forecast);
    setText("[data-forecast-text]", preset.forecastText);
    setText("[data-forecast-description]", preset.forecastDescription);

    const breakdown = $("[data-category-breakdown]");
    if (breakdown) {
      breakdown.innerHTML = preset.categoryLabels
        .map((label, index) => `<div class="insight-row"><span>${label}</span><strong>₽ ${preset.categoryData[index].toLocaleString("ru-RU")}</strong></div>`)
        .join("");
    }
  };

  $$("[data-period]", switcher).forEach((button) => {
    button.addEventListener("click", () => {
      $$(".btn", switcher).forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applyPreset(button.dataset.period);
    });
  });

  applyPreset("week");
}
