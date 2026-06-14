<script setup>
defineProps({
  rows: { type: Array, required: true },
  currency: { type: String, default: 'RUB' },
  formatMoney: { type: Function, required: true },
})
</script>

<template>
  <div class="chart-list">
    <div v-for="row in rows" :key="row.category" class="chart-bar-wrap">
      <div class="chart-bar-meta">
        <span>{{ row.category }}</span>
        <span>{{ formatMoney(row.total, currency) }}</span>
      </div>
      <div class="chart-bar" aria-hidden="true">
        <div class="chart-bar-fill" :style="{ width: `${row.percent}%` }"></div>
      </div>
    </div>
  </div>
</template>
