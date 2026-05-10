import { computed } from "vue";
import {
  filterRange,
  getCategoryBreakdown,
  getDaysLeftInMonth,
  getReferenceDate,
  groupSpend,
  sumBy,
} from "@/utils/financeMetrics";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function buildReportPresets(transactions, accounts) {
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
      const periodLabel = period === "week" ? "Неделя" : period === "month" ? "Месяц" : "Квартал";

      return [
        period,
        {
          periodLabel,
          summary: leader
            ? `Сервис считает значения по данным API. Сейчас лидирует категория «${leader.name}», а расходы за период составили ${formatCurrency(spend)}.`
            : "Пока данных мало, но графики уже строятся по API.",
          spend: formatCurrency(spend),
          spendValue: spend,
          spendStatus: previousSpend ? `${delta >= 0 ? "+" : ""}${delta}% к прошлому периоду` : "Нет прошлых данных для сравнения",
          average: formatCurrency(average),
          averageStatus: current.length ? `${current.length} операций в выборке` : "Пока без операций",
          category: leader?.name || "Нет данных",
          categoryStatus: leader && spend ? `${Math.round((leader.amount / spend) * 100)}% всех расходов` : "Нет структуры расходов",
          forecast: formatCurrency(forecast),
          forecastValue: forecast,
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

export function useReports(transactions, accounts) {
  return {
    presets: computed(() => buildReportPresets(transactions.value, accounts.value)),
  };
}

