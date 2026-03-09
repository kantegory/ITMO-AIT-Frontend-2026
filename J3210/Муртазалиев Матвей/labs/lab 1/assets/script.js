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


