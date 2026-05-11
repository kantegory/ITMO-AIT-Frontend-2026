<script setup>
const props = defineProps({
  budget: { type: Object, required: true },
  formatMoney: { type: Function, required: true },
  currency: { type: String, default: 'RUB' },
})

const progress = Math.min(100, Math.round((Number(props.budget.spent) / Number(props.budget.limit || 1)) * 100))
const progressClass = progress > 90 ? 'bg-danger' : progress > 70 ? 'bg-warning' : 'bg-success'
</script>

<template>
  <div class="chart-bar-wrap">
    <div class="chart-bar-meta">
      <span>{{ budget.category }}</span>
      <span>{{ formatMoney(budget.spent, currency) }} / {{ formatMoney(budget.limit, currency) }}</span>
    </div>
    <div class="progress" role="progressbar"
         :aria-label="`Прогресс бюджета ${budget.category}`"
         :aria-valuenow="progress"
         aria-valuemin="0"
         aria-valuemax="100">
      <div class="progress-bar" :class="progressClass" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>
