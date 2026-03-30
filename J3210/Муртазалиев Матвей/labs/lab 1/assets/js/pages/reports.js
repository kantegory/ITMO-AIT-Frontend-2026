import { ensureSession, getCollection } from "../auth.js";
import {
  $,
  $$,
  filterRange,
  formatDate,
  formatCurrency,
  getCategoryBreakdown,
  getDaysLeftInMonth,
  getReferenceDate,
  groupSpend,
  setText,
  sumBy,
} from "../utils.js";

export async function initReportsPage() {
  const session = await ensureSession();
  const [accounts, transactions] = await Promise.all([
    getCollection("accounts", session.user.id),
    getCollection("transactions", session.user.id),
  ]);

  const presets = buildReportPresets(transactions, accounts);
  initReportCharts(presets);
}

function initReportCharts(presets) {
  const spendCanvas = document.getElementById("spendChart");
  const categoryCanvas = document.getElementById("categoryChart");
  const switcher = $("[data-report-switcher]");

  if (!spendCanvas || !categoryCanvas || !switcher || typeof Chart === "undefined") return;

  const spendChart = new Chart(spendCanvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Расходы",
        data: [],
        fill: true,
        borderWidth: 3,
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.14)",
        tension: 0.35,
        pointBackgroundColor: "#ef7e56",
        pointRadius: 4,
      }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(24, 33, 38, 0.08)" } },
        x: { grid: { display: false } },
      },
    },
  });

  const categoryChart = new Chart(categoryCanvas, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{
        data: [],
        borderWidth: 0,
        backgroundColor: ["#0f766e", "#ef7e56", "#4c84ff", "#9a6fdb", "#6c757d"],
      }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 12, usePointStyle: true },
        },
      },
      cutout: "68%",
    },
  });

  const applyPreset = (period) => {
    const preset = presets[period];
    if (!preset) return;

    spendChart.data.labels = preset.spendLabels;
    spendChart.data.datasets[0].data = preset.spendData;
    categoryChart.data.labels = preset.categoryLabels;
    categoryChart.data.datasets[0].data = preset.categoryData;
    spendChart.update();
    categoryChart.update();

    setText("[data-report-summary]", preset.summary);
    setText("[data-kpi-spend]", preset.spend);
    setText("[data-kpi-spend-status]", preset.spendStatus);
    setText("[data-kpi-average]", preset.average);
    setText("[data-kpi-average-status]", preset.averageStatus);
    setText("[data-kpi-category]", preset.category);
    setText("[data-kpi-category-status]", preset.categoryStatus);
    setText("[data-kpi-forecast]", preset.forecast);
    setText("[data-kpi-forecast-status]", preset.forecastStatus);
    setText("[data-forecast-text]", preset.forecastText);
    setText("[data-forecast-description]", preset.forecastDescription);
    setText("[data-report-tip]", preset.tip);

    const breakdown = $("[data-category-breakdown]");
    if (breakdown) {
      breakdown.innerHTML = preset.categoryLabels
        .map((label, index) => `<div class="insight-row"><span>${label}</span><strong>${formatCurrency(preset.categoryData[index])}</strong></div>`)
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

function buildReportPresets(transactions, accounts) {
  const expenses = transactions
    .filter((item) => item.type === "expense")
    .map((item) => ({ ...item, amount: Number(item.amount) }));
  const balance = sumBy(accounts, "balance");
  const referenceDate = getReferenceDate(transactions);
  const periods = {
    week: {
      rangeDays: 7,
      bucketKey: (date) => formatDate(date),
      labelForDate: (date) => date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    },
    month: {
      rangeDays: 30,
      bucketKey: (date) => formatDate(date),
      labelForDate: (date) => date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    },
    quarter: {
      rangeDays: 90,
      bucketKey: (date) => `${date.getFullYear()}-${date.getMonth()}`,
      labelForDate: (date) => date.toLocaleDateString("ru-RU", { month: "short" }),
    },
  };

  return Object.fromEntries(
    Object.entries(periods).map(([period, config]) => {
      const current = filterRange(expenses, referenceDate, config.rangeDays);
      const previousReference = new Date(referenceDate);
      previousReference.setDate(previousReference.getDate() - config.rangeDays);
      const previous = filterRange(expenses, previousReference, config.rangeDays);
      const groupedSpend = groupSpend(current, config, referenceDate);
      const categories = getCategoryBreakdown(current);
      const leader = categories[0];
      const spend = current.reduce((total, item) => total + item.amount, 0);
      const average = current.length ? Math.round(spend / current.length) : 0;
      const previousSpend = previous.reduce((total, item) => total + item.amount, 0);
      const delta = previousSpend ? Math.round(((spend - previousSpend) / previousSpend) * 100) : 0;
      const monthExpenses = filterRange(expenses, referenceDate, 30);
      const averagePerDay = monthExpenses.reduce((sum, item) => sum + item.amount, 0) / 30;
      const forecast = Math.round(balance - averagePerDay * getDaysLeftInMonth(referenceDate));

      return [
        period,
        {
          summary: leader
            ? `Сервис считает значения по данным API. Сейчас лидирует категория «${leader.name}», а расходы за период составили ${formatCurrency(spend)}.`
            : "Пока данных мало, но графики уже строятся по API.",
          spend: formatCurrency(spend),
          spendStatus: previousSpend ? `${delta >= 0 ? "+" : ""}${delta}% к прошлому периоду` : "Нет прошлых данных для сравнения",
          average: formatCurrency(average),
          averageStatus: current.length ? `${current.length} операций в выборке` : "Пока без операций",
          category: leader?.name || "Нет данных",
          categoryStatus: leader && spend ? `${Math.round((leader.amount / spend) * 100)}% всех расходов` : "Нет структуры расходов",
          forecast: formatCurrency(forecast),
          forecastStatus: forecast >= 0 ? "Без дефицита" : "Есть риск уйти в минус",
          forecastText: `Остаток около ${formatCurrency(forecast)}`,
          forecastDescription: forecast >= 0
            ? "Если текущий темп расходов сохранится, баланс останется положительным."
            : "Если ничего не менять, к концу месяца баланс может просесть.",
          spendLabels: groupedSpend.labels,
          spendData: groupedSpend.values,
          categoryLabels: categories.map((item) => item.name),
          categoryData: categories.map((item) => item.amount),
          tip: leader
            ? `Больше всего сейчас съедает категория «${leader.name}». Ее стоит проверить первой.`
            : "После появления новых трат здесь появится подсказка по самой дорогой категории.",
        },
      ];
    }),
  );
}
