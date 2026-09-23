<template>
  <div v-if="!budgets.length" class="empty-state">Пока нет бюджетов для прогноза. Добавьте их в личном кабинете.</div>
  <div v-else class="row g-3">
    <div v-for="budget in budgets" :key="budget.id" class="col-12 col-md-6">
      <div :class="['forecast-card', getRemaining(budget) >= 0 ? 'forecast-good' : 'forecast-bad']">
        <div class="forecast-card-title">{{ budget.categoryName }}</div>
        <div class="forecast-card-status">{{ getRemaining(budget) >= 0 ? 'Лимит соблюдается' : 'Есть перерасход' }}</div>
        <div class="forecast-card-text">Потрачено: {{ formatCurrency(getSpent(budget.category)) }}</div>
        <div class="forecast-card-text">Лимит: {{ formatCurrency(budget.limit) }}</div>
        <div class="forecast-card-text fw-semibold mt-2">
          {{ getRemaining(budget) >= 0 ? `Остаток: ${formatCurrency(getRemaining(budget))}` : `Превышение: ${formatCurrency(Math.abs(getRemaining(budget)))}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  budgets: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  formatCurrency: { type: Function, required: true },
});

function getSpent(category) {
  return props.categories.find((item) => item.key === category)?.amount || 0;
}

function getRemaining(budget) {
  return Number(budget.limit || 0) - getSpent(budget.category);
}
</script>
