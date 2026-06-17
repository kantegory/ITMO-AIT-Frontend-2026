const RUB_FORMATTER = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const TRANSACTION_DATA = [
  {
    id: 1,
    date: "2026-03-29",
    title: "Продукты (Перекресток)",
    category: "groceries",
    categoryLabel: "Продукты",
    type: "expense",
    typeLabel: "Расход",
    account: "Карта Alfa",
    amount: 3280,
  },
  {
    id: 2,
    date: "2026-03-28",
    title: "Зарплата за март",
    category: "salary",
    categoryLabel: "Доход",
    type: "income",
    typeLabel: "Доход",
    account: "Счет Tinkoff",
    amount: 96300,
  },
  {
    id: 3,
    date: "2026-03-27",
    title: "Подписка на музыку",
    category: "subscriptions",
    categoryLabel: "Подписки",
    type: "expense",
    typeLabel: "Расход",
    account: "Карта Alfa",
    amount: 269,
  },
  {
    id: 4,
    date: "2026-03-27",
    title: "Такси до университета",
    category: "transport",
    categoryLabel: "Транспорт",
    type: "expense",
    typeLabel: "Расход",
    account: "Карта Alfa",
    amount: 540,
  },
  {
    id: 5,
    date: "2026-03-25",
    title: "Перевод на накопительный счет",
    category: "savings",
    categoryLabel: "Накопления",
    type: "transfer",
    typeLabel: "Перевод",
    account: "Счет Tinkoff",
    amount: 7000,
  },
  {
    id: 6,
    date: "2026-03-24",
    title: "Кафе после пар",
    category: "food",
    categoryLabel: "Кафе",
    type: "expense",
    typeLabel: "Расход",
    account: "Карта Alfa",
    amount: 760,
  },
  {
    id: 7,
    date: "2026-03-22",
    title: "Фриланс: лендинг",
    category: "freelance",
    categoryLabel: "Фриланс",
    type: "income",
    typeLabel: "Доход",
    account: "Счет Tinkoff",
    amount: 18000,
  },
  {
    id: 8,
    date: "2026-03-21",
    title: "Оплата интернета",
    category: "utilities",
    categoryLabel: "Коммунальные",
    type: "expense",
    typeLabel: "Расход",
    account: "Карта Alfa",
    amount: 750,
  },
  {
    id: 9,
    date: "2026-03-18",
    title: "Стипендия",
    category: "scholarship",
    categoryLabel: "Доход",
    type: "income",
    typeLabel: "Доход",
    account: "Счет Tinkoff",
    amount: 4300,
  },
  {
    id: 10,
    date: "2026-03-17",
    title: "Подарок на день рождения",
    category: "gifts",
    categoryLabel: "Подарки",
    type: "expense",
    typeLabel: "Расход",
    account: "Карта Alfa",
    amount: 2900,
  },
];

const REPORT_DATA = {
  "2026-01": {
    spent: 43520,
    income: 108700,
    forecast: 40100,
    categories: [
      { key: "Жилье", value: 11800 },
      { key: "Продукты", value: 9200 },
      { key: "Транспорт", value: 5100 },
      { key: "Образование", value: 7700 },
      { key: "Прочее", value: 9720 },
    ],
  },
  "2026-02": {
    spent: 47200,
    income: 114000,
    forecast: 43800,
    categories: [
      { key: "Жилье", value: 11800 },
      { key: "Продукты", value: 10400 },
      { key: "Транспорт", value: 5600 },
      { key: "Подписки", value: 1250 },
      { key: "Прочее", value: 18150 },
    ],
  },
  "2026-03": {
    spent: 45690,
    income: 118600,
    forecast: 42700,
    categories: [
      { key: "Жилье", value: 11800 },
      { key: "Продукты", value: 11300 },
      { key: "Транспорт", value: 4980 },
      { key: "Кафе", value: 6320 },
      { key: "Прочее", value: 11290 },
    ],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  updateCopyrightYear();
  initAuthForms();
  initDashboardQuickTransaction();
  initTransactionsSearchPage();
  initReportsPage();
  initIntegrationsPage();
});

function updateCopyrightYear() {
  const yearNodes = document.querySelectorAll("[data-current-year]");
  const year = String(new Date().getFullYear());
  yearNodes.forEach((node) => {
    node.textContent = year;
  });
}

function initAuthForms() {
  const forms = document.querySelectorAll("form[data-auth-form]");
  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    const confirmField = form.querySelector("#confirmPassword");
    const passwordField = form.querySelector("#password");
    const syncPasswordsValidity = () => {
      if (!confirmField || !passwordField) {
        return;
      }

      const match = confirmField.value.trim() === passwordField.value.trim();
      confirmField.setCustomValidity(match ? "" : "Пароли не совпадают");
    };

    if (confirmField && passwordField) {
      confirmField.addEventListener("input", syncPasswordsValidity);
      passwordField.addEventListener("input", syncPasswordsValidity);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      syncPasswordsValidity();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      form.classList.add("was-validated");
      showInlineMessage(form, "success", "Данные приняты. Это демо-режим без отправки на сервер.");
      form.reset();
      form.classList.remove("was-validated");
    });
  });
}

function showInlineMessage(form, type, text) {
  const container = form.querySelector("[data-form-message]");
  if (!container) {
    return;
  }

  container.className = type === "success" ? "alert alert-success mt-3" : "alert alert-danger mt-3";
  container.textContent = text;
  container.classList.remove("d-none");
}

function initDashboardQuickTransaction() {
  const form = document.querySelector("#quickTransactionForm");
  const tableBody = document.querySelector("#recentTransactionsBody");

  if (!form || !tableBody) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const title = form.querySelector("#quickTitle").value.trim();
    const amountValue = Number(form.querySelector("#quickAmount").value);
    const categoryField = form.querySelector("#quickCategory");
    const categoryLabel = categoryField.options[categoryField.selectedIndex].text;

    const newRow = document.createElement("tr");
    const today = new Date().toISOString().slice(0, 10);
    newRow.innerHTML = `
      <td data-label="Дата">${formatDate(today)}</td>
      <td data-label="Описание">${escapeHtml(title)}</td>
      <td data-label="Категория"><span class="badge-soft badge-soft-expense">${escapeHtml(categoryLabel)}</span></td>
      <td data-label="Сумма">-${RUB_FORMATTER.format(amountValue)}</td>
    `;

    tableBody.prepend(newRow);
    form.reset();
    form.classList.remove("was-validated");

    const modalElement = document.querySelector("#quickTransactionModal");
    if (modalElement) {
      const instance = window.bootstrap?.Modal.getInstance(modalElement);
      instance?.hide();
    }
  });
}

function initTransactionsSearchPage() {
  const pageRoot = document.querySelector("[data-page='transactions']");
  if (!pageRoot) {
    return;
  }

  const form = document.querySelector("#transactionFilters");
  const tableBody = document.querySelector("#transactionsTableBody");
  const statsCount = document.querySelector("#statsCount");
  const statsIncome = document.querySelector("#statsIncome");
  const statsExpense = document.querySelector("#statsExpense");
  const resetButton = document.querySelector("#resetFilters");

  if (!form || !tableBody || !statsCount || !statsIncome || !statsExpense || !resetButton) {
    return;
  }

  const fields = {
    query: form.querySelector("#filterQuery"),
    category: form.querySelector("#filterCategory"),
    minAmount: form.querySelector("#filterMinAmount"),
    maxAmount: form.querySelector("#filterMaxAmount"),
    fromDate: form.querySelector("#filterFromDate"),
    toDate: form.querySelector("#filterToDate"),
  };

  restoreFilters(fields);
  renderTransactions(TRANSACTION_DATA, tableBody, statsCount, statsIncome, statsExpense);
  applyAndRender();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyAndRender();
  });

  form.addEventListener("input", applyAndRender);
  form.addEventListener("change", applyAndRender);

  resetButton.addEventListener("click", () => {
    form.reset();
    saveFilters(fields);
    applyAndRender();
  });

  function applyAndRender() {
    const filtered = TRANSACTION_DATA.filter((item) => {
      const query = fields.query.value.trim().toLowerCase();
      const selectedCategory = fields.category.value;
      const minAmount = Number(fields.minAmount.value) || 0;
      const maxAmount = Number(fields.maxAmount.value) || Number.POSITIVE_INFINITY;
      const fromDate = fields.fromDate.value || "0000-00-00";
      const toDate = fields.toDate.value || "9999-12-31";

      const matchesQuery = !query || item.title.toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesAmount = item.amount >= minAmount && item.amount <= maxAmount;
      const matchesDate = item.date >= fromDate && item.date <= toDate;

      return matchesQuery && matchesCategory && matchesAmount && matchesDate;
    });

    saveFilters(fields);
    renderTransactions(filtered, tableBody, statsCount, statsIncome, statsExpense);
  }
}

function renderTransactions(data, tableBody, statsCount, statsIncome, statsExpense) {
  tableBody.innerHTML = "";

  if (!data.length) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="7" class="py-4 text-center text-muted-custom">По выбранным фильтрам ничего не найдено.</td>';
    tableBody.appendChild(row);
  } else {
    const rows = data.map((item) => {
      const badgeClass = getBadgeClass(item.type);
      return `
        <tr>
          <td data-label="Дата">${formatDate(item.date)}</td>
          <td data-label="Описание" class="text-clamp">${escapeHtml(item.title)}</td>
          <td data-label="Категория">${escapeHtml(item.categoryLabel)}</td>
          <td data-label="Тип"><span class="badge-soft ${badgeClass}">${escapeHtml(item.typeLabel)}</span></td>
          <td data-label="Счет">${escapeHtml(item.account)}</td>
          <td data-label="Сумма">${item.type === "expense" ? "-" : ""}${RUB_FORMATTER.format(item.amount)}</td>
          <td data-label="ID">#${item.id}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows.join("");
  }

  const income = data
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);
  const expense = data
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  statsCount.textContent = String(data.length);
  statsIncome.textContent = RUB_FORMATTER.format(income);
  statsExpense.textContent = RUB_FORMATTER.format(expense);
}

function initReportsPage() {
  const reportRoot = document.querySelector("[data-page='report']");
  if (!reportRoot) {
    return;
  }

  const select = document.querySelector("#reportPeriod");
  const spentNode = document.querySelector("#reportSpent");
  const incomeNode = document.querySelector("#reportIncome");
  const forecastNode = document.querySelector("#reportForecast");
  const chartNode = document.querySelector("#reportChart");

  if (!select || !spentNode || !incomeNode || !forecastNode || !chartNode) {
    return;
  }

  update(select.value);
  select.addEventListener("change", () => update(select.value));

  function update(period) {
    const entry = REPORT_DATA[period];
    if (!entry) {
      return;
    }

    spentNode.textContent = RUB_FORMATTER.format(entry.spent);
    incomeNode.textContent = RUB_FORMATTER.format(entry.income);
    forecastNode.textContent = RUB_FORMATTER.format(entry.forecast);

    const maxValue = Math.max(...entry.categories.map((item) => item.value));

    chartNode.innerHTML = entry.categories
      .map((item) => {
        const width = Math.max(8, Math.round((item.value / maxValue) * 100));
        return `
          <div class="report-bar-row">
            <span>${escapeHtml(item.key)}</span>
            <div class="report-bar-wrap" role="img" aria-label="${escapeHtml(item.key)}: ${item.value}">
              <span class="report-bar" style="width: ${width}%"></span>
            </div>
            <span class="report-value">${RUB_FORMATTER.format(item.value)}</span>
          </div>
        `;
      })
      .join("");
  }
}

function initIntegrationsPage() {
  const integrationsRoot = document.querySelector("[data-page='integrations']");
  if (!integrationsRoot) {
    return;
  }

  const providerInput = document.querySelector("#providerName");
  const form = document.querySelector("#connectProviderForm");
  const cards = document.querySelectorAll("[data-provider-card]");

  cards.forEach((card) => {
    const button = card.querySelector(".js-connect-btn");
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      if (providerInput) {
        providerInput.value = card.dataset.providerCard || "";
      }
    });
  });

  if (!form || !providerInput) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const provider = providerInput.value.trim();
    const card = Array.from(cards).find((item) => item.dataset.providerCard === provider);

    if (card) {
      const statusNode = card.querySelector(".integration-status");
      const button = card.querySelector(".js-connect-btn");
      if (statusNode) {
        statusNode.textContent = "Статус: подключено";
      }
      if (button) {
        button.textContent = "Управлять";
      }
    }

    const modalElement = document.querySelector("#connectProviderModal");
    const instance = window.bootstrap?.Modal.getInstance(modalElement);
    instance?.hide();

    form.reset();
    form.classList.remove("was-validated");
  });
}

function getBadgeClass(type) {
  if (type === "income") {
    return "badge-soft-income";
  }

  if (type === "transfer") {
    return "badge-soft-transfer";
  }

  return "badge-soft-expense";
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function saveFilters(fields) {
  const payload = {
    query: fields.query.value,
    category: fields.category.value,
    minAmount: fields.minAmount.value,
    maxAmount: fields.maxAmount.value,
    fromDate: fields.fromDate.value,
    toDate: fields.toDate.value,
  };

  try {
    localStorage.setItem("lab1-transactions-filters", JSON.stringify(payload));
  } catch {
    /* Ignore write errors in strict/private browser modes. */
  }
}

function restoreFilters(fields) {
  let raw = null;

  try {
    raw = localStorage.getItem("lab1-transactions-filters");
  } catch {
    return;
  }

  if (!raw) {
    return;
  }

  try {
    const payload = JSON.parse(raw);
    fields.query.value = payload.query || "";
    fields.category.value = payload.category || "";
    fields.minAmount.value = payload.minAmount || "";
    fields.maxAmount.value = payload.maxAmount || "";
    fields.fromDate.value = payload.fromDate || "";
    fields.toDate.value = payload.toDate || "";
  } catch {
    try {
      localStorage.removeItem("lab1-transactions-filters");
    } catch {
      /* Ignore read/write errors in strict/private browser modes. */
    }
  }
}

function escapeHtml(raw) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(raw).replace(/[&<>"']/g, (symbol) => map[symbol]);
}
