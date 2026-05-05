<script setup>
import { computed, onMounted, ref } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import { getTransactionsByUser } from '@/api/finance'

const authStore = useAuthStore()
const modalStore = useModalStore()

const userTransactions = ref([])
const selectedPeriod = ref('')

function formatMoney(value) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

function formatPeriodFromDate(dateISO) {
  const date = new Date(dateISO)
  const period = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  return period.charAt(0).toUpperCase() + period.slice(1).replace(' г.', '')
}

function getTransactionPeriod(transaction) {
  if (transaction.period && typeof transaction.period === 'string') {
    return transaction.period.replace(' г.', '')
  }
  return formatPeriodFromDate(transaction.date)
}

const periods = computed(() => {
  const periodByTime = {}

  userTransactions.value.forEach((transaction) => {
    const period = getTransactionPeriod(transaction)
    const time = new Date(transaction.date).getTime()
    if (!periodByTime[period] || time > periodByTime[period]) {
      periodByTime[period] = time
    }
  })

  return Object.keys(periodByTime).sort((a, b) => periodByTime[b] - periodByTime[a])
})

function getStatsByPeriod(period) {
  const rows = userTransactions.value.filter((item) => getTransactionPeriod(item) === period)

  const income = rows.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0)
  const expense = Math.abs(rows.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0))
  const categoryExpenses = {}

  rows.forEach((item) => {
    if (item.amount < 0) {
      categoryExpenses[item.category] = (categoryExpenses[item.category] || 0) + Math.abs(item.amount)
    }
  })

  const totalExpense = Object.values(categoryExpenses).reduce((sum, value) => sum + value, 0)
  return { income, expense, categoryExpenses, totalExpense }
}

const currentStats = computed(() => (selectedPeriod.value ? getStatsByPeriod(selectedPeriod.value) : null))

const efficiencyText = computed(() => {
  if (!currentStats.value) return '-'
  if (currentStats.value.income === 0 && currentStats.value.expense === 0) return 'Нет данных'
  if (currentStats.value.income === 0) return 'Только расходы'
  const efficiency = Math.round(((currentStats.value.income - currentStats.value.expense) / currentStats.value.income) * 100)
  return `${efficiency}%`
})

const sortedCategoryExpenses = computed(() => {
  if (!currentStats.value) return []
  return Object.entries(currentStats.value.categoryExpenses).sort((a, b) => b[1] - a[1])
})

const insightText = computed(() => {
  const current = currentStats.value
  if (!current) return 'Загрузка...'
  const selectedIndex = periods.value.indexOf(selectedPeriod.value)
  if (selectedIndex < 0 || selectedIndex === periods.value.length - 1) {
    return 'Недостаточно данных для сравнения с предыдущим месяцем.'
  }

  const previousPeriod = periods.value[selectedIndex + 1]
  const prevStats = getStatsByPeriod(previousPeriod)

  if (prevStats.expense === 0 && current.expense === 0) return 'В обоих периодах расходов нет.'
  if (prevStats.expense === 0) return 'В предыдущем месяце расходов не было. Вы отлично контролировали бюджет.'

  const delta = current.expense - prevStats.expense
  const deltaPercent = Math.round((Math.abs(delta) / prevStats.expense) * 100)

  if (delta === 0) return 'Ваши расходы не изменились относительно прошлого месяца.'
  if (delta > 0) return `Расходы выросли на ${deltaPercent}% относительно ${previousPeriod}.`
  return `Расходы снизились на ${deltaPercent}% относительно ${previousPeriod}.`
})

const chartData = computed(() =>
  periods.value
    .slice()
    .reverse()
    .map((period) => ({ period, expense: getStatsByPeriod(period).expense }))
)

const maxExpense = computed(() => Math.max(...chartData.value.map((item) => item.expense), 0))

async function initDashboardPage() {
  try {
    userTransactions.value = await getTransactionsByUser(authStore.user.id)
    selectedPeriod.value = periods.value[0] || ''
  } catch (error) {
    modalStore.openInfo('Ошибка', error.message)
  }
}

onMounted(() => {
  initDashboardPage()
})
</script>

<template>
  <BaseLayout>
    <main class="container mt-3">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 class="fw-bold mb-0">Аналитика расходов</h1>
        <div class="mt-2 mt-md-0">
          <label class="visually-hidden" for="dashboardPeriod">Период аналитики</label>
          <select id="dashboardPeriod" v-model="selectedPeriod" class="form-select border-primary" aria-label="Период аналитики">
            <option v-if="!periods.length">Нет данных</option>
            <option v-for="period in periods" v-else :key="period" :value="period">{{ period }}</option>
          </select>
        </div>
      </div>

      <div class="row g-3 mb-5">
        <div class="col-md-4">
          <div class="stat-card">
            <small class="fw-bold">ДОХОДЫ</small>
            <div id="dashboardIncome" class="fw-bold income-text mt-2">{{ formatMoney(currentStats?.income || 0) }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card">
            <small class="fw-bold">РАСХОДЫ</small>
            <div id="dashboardExpense" class="fw-bold expense-text mt-2">{{ formatMoney(currentStats?.expense || 0) }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card profit-balance-card">
            <small class="fw-bold">ЭФФЕКТИВНОСТЬ</small>
            <div id="dashboardEfficiency" class="fw-bold mt-2">{{ efficiencyText }}</div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-4">Расходы по категориям</h2>
              <div id="categoriesBreakdown" aria-live="polite">
                <p v-if="!sortedCategoryExpenses.length" class="text-muted mb-0">За выбранный период расходов нет.</p>
                <div v-for="([name, amount], index) in sortedCategoryExpenses" v-else :key="name" class="mb-4">
                  <div class="d-flex justify-content-between mb-1">
                    <span>{{ name }}</span>
                    <span class="fw-bold">{{ formatMoney(amount) }}</span>
                  </div>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      :class="['bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-primary', 'bg-secondary'][index % 6]"
                      :style="{ width: `${currentStats.totalExpense ? Math.round((amount / currentStats.totalExpense) * 100) : 0}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Сравнительная статистика</h2>
              <p id="dashboardInsight" class="mb-4 text-muted" aria-live="polite">{{ insightText }}</p>
              <div id="monthlyChart" aria-live="polite">
                <p v-if="!maxExpense" class="text-muted mb-0">Недостаточно данных для графика.</p>
                <div v-else class="d-flex align-items-end gap-2" style="height: 180px">
                  <div v-for="item in chartData" :key="item.period" class="d-flex flex-column align-items-center flex-fill">
                    <div
                      class="w-100 bg-primary rounded"
                      :style="{ height: `${Math.max(10, Math.round((item.expense / maxExpense) * 160))}px` }"
                    />
                    <small class="text-muted mt-2 text-center">{{ item.period.split(' ')[0] }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
