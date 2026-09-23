<template>
  <main class="container">
    <DemoBanner :is-demo="finance.isDemo.value" />

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h1>Отчёты</h1>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-lg-5">
        <div class="info-box h-100">
          <h2>Сводка</h2>
          <ReportsSummaryTable
            :summary="finance.summary.value"
            :format-currency="finance.formatCurrency"
          />
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <div class="info-box h-100">
          <h2>Прогноз по лимитам</h2>
          <ForecastCards
            :budgets="finance.budgets.value"
            :categories="finance.expensesByCategory.value"
            :format-currency="finance.formatCurrency"
          />
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-lg-6">
        <div class="info-box h-100">
          <h2>Прогресс по категориям</h2>
          <CategoryProgress
            :categories="finance.expensesByCategory.value"
            :budgets="finance.budgets.value"
            :format-currency="finance.formatCurrency"
          />
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <FlowChart
          v-if="finance.flowByDay.value && finance.flowByDay.value.labels"
          :flow="finance.flowByDay.value"
        />
        <div v-else class="info-box h-100">
          Недостаточно данных для графика.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import CategoryProgress from '../components/CategoryProgress.vue';
import DemoBanner from '../components/DemoBanner.vue';
import FlowChart from '../components/FlowChart.vue';
import ForecastCards from '../components/ForecastCards.vue';
import ReportsSummaryTable from '../components/ReportsSummaryTable.vue';
import { useFinanceManager } from '../composables/useFinanceManager.js';

const finance = useFinanceManager();
</script>