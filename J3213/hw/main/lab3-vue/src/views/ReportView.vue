<script setup>
import { computed, onMounted } from 'vue'
import SummaryStat from '../components/SummaryStat.vue'
import ReportBars from '../components/ReportBars.vue'
import { useAuth } from '../composables/useAuth'
import { useTransactions } from '../composables/useTransactions'
import { formatMoney } from '../utils/format'

const { currentUser } = useAuth()
const { report, loadAll } = useTransactions()

onMounted(loadAll)

const chartRows = computed(() => {
  const max = report.value.categoriesTotals[0]?.total || 1
  return report.value.categoriesTotals.map((item) => ({
    ...item,
    percent: Math.round((item.total / max) * 100),
  }))
})
</script>

<template>
  <section class="container">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
      <div>
        <div class="badge-soft mb-2">
          <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-chart"></use></svg>
          Страница отчёта
        </div>
        <h1 class="section-title mb-2">Финансовая аналитика</h1>
        <p class="muted mb-0">Категории расходов, средний чек и прогноз остатка.</p>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <SummaryStat title="Средний расход"
                     :value="formatMoney(report.avgExpense, currentUser?.currency || 'RUB')"
                     delta="На одну расходную операцию" />
      </div>
      <div class="col-md-4">
        <SummaryStat title="Крупнейшая категория"
                     :value="report.topCategory"
                     delta="По суммарным расходам" />
      </div>
      <div class="col-md-4">
        <SummaryStat title="Прогноз остатка"
                     :value="formatMoney(report.forecast, currentUser?.currency || 'RUB')"
                     delta="Текущий баланс минус средний расход" />
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <section class="chart-card h-100">
          <h2 class="h4 mb-3">Распределение расходов по категориям</h2>
          <ReportBars :rows="chartRows" :format-money="formatMoney" :currency="currentUser?.currency || 'RUB'" />
        </section>
      </div>
      <div class="col-lg-5">
        <section class="chart-card h-100">
          <h2 class="h4 mb-3">Краткие выводы</h2>
          <div class="chart-list">
            <div class="d-flex justify-content-between gap-3">
              <span>Текущий совокупный баланс</span>
              <strong>{{ formatMoney(report.balance, currentUser?.currency || 'RUB') }}</strong>
            </div>
            <div class="d-flex justify-content-between gap-3">
              <span>Средняя расходная операция</span>
              <strong>{{ formatMoney(report.avgExpense, currentUser?.currency || 'RUB') }}</strong>
            </div>
            <div class="d-flex justify-content-between gap-3">
              <span>Самая затратная категория</span>
              <strong>{{ report.topCategory }}</strong>
            </div>
            <div v-for="row in chartRows.slice(0, 3)" :key="row.category" class="d-flex justify-content-between gap-3">
              <span>{{ row.category }}</span>
              <strong>{{ formatMoney(row.total, currentUser?.currency || 'RUB') }}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
