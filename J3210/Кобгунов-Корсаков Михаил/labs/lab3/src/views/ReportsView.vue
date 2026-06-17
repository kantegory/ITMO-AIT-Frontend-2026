<script setup>
import { onMounted } from 'vue';
import ReportCharts from '../components/ReportCharts.vue';
import { useTransactions } from '../composables/useTransactions';

const { transactions, loading, error, loadTransactions } = useTransactions();

onMounted(() => {
  loadTransactions();
});
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4">Финансовые отчёты</h2>

    <div v-if="loading" class="alert alert-info">
      Загрузка отчётов...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <ReportCharts v-else :transactions="transactions" />

    <div class="card shadow-sm">
      <div class="card-header">
        <h3 class="fs-6 mb-0">Выводы и прогнозы</h3>
      </div>

      <div class="card-body">
        <div class="alert alert-warning" role="status" aria-live="polite">
          Категория «Развлечения» приближается к установленному лимиту.
        </div>

        <div class="alert alert-info mb-0" role="status" aria-live="polite">
          Если темп расходов сохранится, месячный бюджет останется в пределах нормы.
        </div>
      </div>
    </div>
  </div>
</template>
