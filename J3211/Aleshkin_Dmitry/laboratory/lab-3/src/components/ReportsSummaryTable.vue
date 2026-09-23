<template>
  <table class="table table-bordered mb-0">
    <tbody>
      <tr><th>Доходы</th><td>{{ formatCurrency(summary.income) }}</td></tr>
      <tr><th>Расходы</th><td>{{ formatCurrency(summary.expenses) }}</td></tr>
      <tr><th>Экономия</th><td>{{ formatCurrency(summary.savings) }}</td></tr>
      <tr><th>Текущий баланс</th><td>{{ formatCurrency(summary.totalBalance) }}</td></tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  summary: { type: Object, required: true },
  formatCurrency: { type: Function, required: true },
});
</script>
