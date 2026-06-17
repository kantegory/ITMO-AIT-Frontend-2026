import {
  CATEGORY_LABELS,
  TYPE_LABELS,
  aggregateExpenseCategories,
  calculateForecast,
  collectPeriodKeys,
  currentMonthKey,
  formatCurrency,
  formatDate,
  formatMonthLabel,
  getBadgeClass,
  getCategoryLabel,
  getTypeLabel,
  toIsoDate,
} from '@/lib/finance';

export function useFinanceHelpers() {
  return {
    CATEGORY_LABELS,
    TYPE_LABELS,
    aggregateExpenseCategories,
    calculateForecast,
    collectPeriodKeys,
    currentMonthKey,
    formatCurrency,
    formatDate,
    formatMonthLabel,
    getBadgeClass,
    getCategoryLabel,
    getTypeLabel,
    toIsoDate,
  };
}
