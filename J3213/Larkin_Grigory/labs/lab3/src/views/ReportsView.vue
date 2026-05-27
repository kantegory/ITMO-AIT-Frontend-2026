<script setup>
import { computed, onMounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import StatCard from '../components/StatCard.vue'
import { useTransactions } from '../composables/useTransactions'

const { transactions, loading, error, fetchTransactions } = useTransactions()
onMounted(fetchTransactions)

const CATEGORY_LABELS = {
  income: 'Доход', food: 'Еда', housing: 'Жильё',
  transport: 'Транспорт', entertainment: 'Развлечения', services: 'Сервисы'
}
const CATEGORY_BADGES = {
  income: 'bg-success', food: 'bg-warning text-dark', housing: 'bg-secondary',
  transport: 'bg-primary', entertainment: 'bg-info', services: 'bg-info'
}
const CATEGORY_COLORS = {
  income: '#198754', food: '#ffc107', housing: '#6c757d',
  transport: '#c0392b', entertainment: '#0dcaf0', services: '#0dcaf0'
}

const income = computed(() =>
  transactions.value.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
)
const expenses = computed(() =>
  transactions.value.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)
)
const net = computed(() => income.value + expenses.value)

const byCategory = computed(() => {
  const map = {}
  transactions.value.filter(t => t.amount < 0).forEach(t => {
    map[t.category] = (map[t.category] || 0) + Math.abs(t.amount)
  })
  const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
  return Object.entries(map).map(([cat, sum]) => ({
    cat,
    sum,
    pct: Math.round(sum / total * 100)
  }))
})

function fmt(n) { return n.toLocaleString('ru-RU') + ' ₽' }
</script>

<template>
  <AppNavbar />
  <main class="container my-4">
    <h1 class="h4 mb-4">Отчёты</h1>

    <div v-if="loading" class="text-muted">Загрузка...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <template v-else>
      <div class="row g-3 mb-4">
        <div class="col-sm-4"><StatCard label="Доходы" :value="'+' + fmt(income)" value-class="amount-plus" /></div>
        <div class="col-sm-4"><StatCard label="Расходы" :value="'−' + fmt(Math.abs(expenses))" value-class="amount-minus" /></div>
        <div class="col-sm-4"><StatCard label="Чистый итог" :value="fmt(net)" /></div>
      </div>

      <h2 class="h6 mb-3">Расходы по категориям</h2>
      <div class="card">
        <div class="card-body">
          <div v-if="byCategory.length === 0" class="text-muted">Нет данных о расходах</div>
          <div v-for="item in byCategory" :key="item.cat" class="mb-3">
            <div class="d-flex justify-content-between mb-1">
              <span class="badge" :class="CATEGORY_BADGES[item.cat]">{{ CATEGORY_LABELS[item.cat] }}</span>
              <span class="text-muted small">{{ item.sum.toLocaleString('ru-RU') }} ₽ ({{ item.pct }}%)</span>
            </div>
            <div class="progress" style="height:8px" role="progressbar"
                 :aria-valuenow="item.pct" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar" :style="{ width: item.pct + '%', backgroundColor: CATEGORY_COLORS[item.cat] }"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
