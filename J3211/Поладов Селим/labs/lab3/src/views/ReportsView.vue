<template>
  <AppLayout title="Отчёты">
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="content-card">
          <h3>Расходы по категориям</h3>
          <CategoryDoughnut v-if="!loading" :data="categories" />
        </div>
      </div>
      <div class="col-md-8">
        <div class="content-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Динамика расходов</h3>
          </div>
          <MonthlyBars
            v-if="!loading"
            :labels="monthLabels"
            :expenses="expenseTotals"
            :incomes="incomeTotals"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="content-card">
          <h3>Топ категорий за период</h3>
          <ul class="list-unstyled mb-0">
            <li v-if="loading" class="text-center text-muted py-3">Загрузка...</li>
            <li
              v-for="([name, sum], i) in topCategories"
              :key="name"
              class="d-flex justify-content-between align-items-center py-2"
              :class="{ 'border-bottom': i < topCategories.length - 1 }"
            >
              <span>{{ name }}</span>
              <span class="fw-medium">{{ formatMoney(sum) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import CategoryDoughnut from '../components/CategoryDoughnut.vue'
import MonthlyBars from '../components/MonthlyBars.vue'
import { useReportsData } from '../composables/useReportsData.js'
import { useFormatters } from '../composables/useFormatters.js'

const { expenses, incomes, loading, load, groupByCategory, groupByMonth, buildMonths } = useReportsData(6)
const { formatMoney, formatMonth } = useFormatters()

const months = computed(buildMonths)
const monthLabels = computed(() => months.value.map(m => formatMonth(m.date)))
const expenseTotals = computed(() => groupByMonth(expenses.value, months.value))
const incomeTotals = computed(() => groupByMonth(incomes.value, months.value))
const categories = computed(() => groupByCategory(expenses.value))
const topCategories = computed(() =>
  Object.entries(categories.value).sort((a, b) => b[1] - a[1]).slice(0, 5)
)

onMounted(load)
</script>
