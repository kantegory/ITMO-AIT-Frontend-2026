<template>
  <AppLayout title="Отчёты" subtitle="Аналитика доходов и расходов">
    <PageHeader
      kicker="Аналитика"
      title="Финансовые отчёты"
      description="Раздел показывает сводку по расходам, доходам, категориям и бюджетам."
    >
      <select v-model="period" class="form-select w-auto" aria-label="Период отчёта">
        <option value="week">Неделя</option>
        <option value="month">Месяц</option>
        <option value="quarter">Квартал</option>
        <option value="year">Год</option>
      </select>
    </PageHeader>

    <section class="row g-3 mb-4">
      <div class="col-md-6 col-xl-3">
        <StatCard label="Расходы" :value="formatMoney(report.totalExpense)" icon="arrow-down-right-circle" :hint="`${report.expenseCount} операций`" />
      </div>
      <div class="col-md-6 col-xl-3">
        <StatCard label="Доходы" :value="formatMoney(report.totalIncome)" icon="arrow-up-right-circle" hint="за выбранный период" />
      </div>
      <div class="col-md-6 col-xl-3">
        <StatCard label="Средний чек" :value="formatMoney(report.averageCheck)" icon="receipt" hint="по расходам" />
      </div>
      <div class="col-md-6 col-xl-3">
        <StatCard label="Топ-категория" :value="report.topCategory[0]" icon="bookmark-star" :hint="formatMoney(report.topCategory[1])" />
      </div>
    </section>

    <section class="row g-4">
      <div class="col-xl-7">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Расходы по категориям</h2>
            <div v-if="categoryRows.length" class="d-grid gap-3">
              <div v-for="row in categoryRows" :key="row.category">
                <div class="d-flex justify-content-between mb-1">
                  <strong>{{ row.category }}</strong>
                  <span>{{ formatMoney(row.amount) }}</span>
                </div>
                <div class="progress" role="progressbar" :aria-valuenow="row.percent" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar" :style="{ width: `${row.percent}%` }"></div>
                </div>
              </div>
            </div>
            <p v-else class="text-secondary mb-0">За выбранный период расходов нет.</p>
          </div>
        </div>
      </div>
      <div class="col-xl-5">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Исполнение бюджетов</h2>
            <div class="d-grid gap-3">
              <BudgetProgress v-for="budget in report.budgetsProgress" :key="budget.id" :budget="budget" :format-money="formatMoney" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import PageHeader from '../components/PageHeader.vue';
import StatCard from '../components/StatCard.vue';
import BudgetProgress from '../components/BudgetProgress.vue';
import { useFinance } from '../composables/useFinance';

const { syncData, getReportData, formatMoney } = useFinance();
const period = ref('month');
const report = computed(() => getReportData(period.value));
const categoryRows = computed(() => {
  const entries = Object.entries(report.value.categoryTotals).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;
  return entries.map(([category, amount]) => ({
    category,
    amount,
    percent: Math.round((amount / max) * 100)
  }));
});

onMounted(syncData);
</script>
