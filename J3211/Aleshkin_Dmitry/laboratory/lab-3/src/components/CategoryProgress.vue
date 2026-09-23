<template>
  <div v-if="!categories.length" class="empty-state">Пока нет расходов по категориям. Добавьте транзакции на странице «Транзакции».</div>
  <div v-else>
    <div v-for="item in sortedCategories" :key="item.key" class="mb-3 forecast-row">
      <div class="d-flex justify-content-between">
        <label class="form-label mb-1 fw-semibold">{{ item.name }}</label>
        <small>{{ formatCurrency(item.amount) }}</small>
      </div>
      <div class="progress"><div class="progress-bar" :style="{ width: `${Math.min(getPercent(item), 100)}%` }">{{ getPercent(item) }}%</div></div>
      <small v-if="getBudget(item.key)" class="text-muted">Лимит: {{ formatCurrency(getBudget(item.key).limit) }}</small>
      <small v-else class="text-muted">Для этой категории лимит не задан</small>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  categories: { type: Array, default: () => [] },
  budgets: { type: Array, default: () => [] },
  formatCurrency: { type: Function, required: true },
});

const sortedCategories = computed(() => [...props.categories].sort((a, b) => a.name.localeCompare(b.name, 'ru')));

function getBudget(key) {
  return props.budgets.find((item) => item.category === key);
}

function getPercent(item) {
  const budget = getBudget(item.key);
  return budget?.limit > 0 ? Math.min(999, Math.round((item.amount / Number(budget.limit)) * 100)) : 0;
}
</script>
