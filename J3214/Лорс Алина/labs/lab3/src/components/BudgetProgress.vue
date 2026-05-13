<template>
  <article class="budget-row">
    <div class="d-flex justify-content-between gap-3 mb-2">
      <div>
        <strong>{{ budget.category }}</strong>
        <div class="small text-secondary">{{ formatMoney(budget.spent) }} из {{ formatMoney(budget.limit) }}</div>
      </div>
      <span class="badge rounded-pill" :class="percent >= 90 ? 'text-bg-danger' : 'text-bg-light'">{{ percent }}%</span>
    </div>
    <div class="progress" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar" :style="{ width: `${Math.min(percent, 100)}%` }"></div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  budget: {
    type: Object,
    required: true
  },
  formatMoney: {
    type: Function,
    required: true
  }
});

const percent = computed(() => props.budget.limit ? Math.round((Number(props.budget.spent) / Number(props.budget.limit)) * 100) : 0);
</script>
