<template>
  <div role="list" aria-label="Список бюджетов">
    <div v-for="budget in budgets" :key="budget.id || budget.category" class="budget-item" role="listitem">
      <div class="d-flex justify-content-between gap-3">
        <strong>{{ budget.category }}</strong>
        <span>{{ formatCurrency(getSpentByCategory(budget.category, transactions)) }} / {{ formatCurrency(budget.limit) }}</span>
      </div>
      <div class="progress soft-progress mt-2">
        <div
          class="progress-bar"
          :class="{ 'warning-bar': getPercent(budget) >= 90 }"
          :style="{ width: `${getPercent(budget)}%` }"
          role="progressbar"
          :aria-label="`Использование бюджета ${budget.category}`"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="getPercent(budget)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from "@/utils/formatters";
import { getSpentByCategory } from "@/utils/financeMetrics";

const props = defineProps({
  budgets: {
    type: Array,
    required: true,
  },
  transactions: {
    type: Array,
    required: true,
  },
});

function getPercent(budget) {
  const spent = getSpentByCategory(budget.category, props.transactions);
  return Math.min(100, Math.round((spent / Number(budget.limit || 1)) * 100));
}
</script>

