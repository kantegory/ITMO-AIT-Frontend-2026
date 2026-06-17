<script setup>
import { spriteHref } from '@/composables/useSprite'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'

import { getAccounts } from '@/api/accounts'
import { getTransactions } from '@/api/transactions'
import { getDailyRates } from '@/api/rates'

import { useAuth } from '@/composables/useAuth'
import { useMoney } from '@/composables/useMoney'
import { useTheme } from '@/composables/useTheme'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const router = useRouter()
const { userId } = useAuth()
const { convertToRubles, formatRubles, setRates } = useMoney()
const { theme } = useTheme()

const accounts = ref([])
const transactions = ref([])

const usdRate = ref(90)
const usdPrev = ref(90)
const eurRate = ref(100)
const eurPrev = ref(100)

const incomeCanvas = ref(null)
const expensesCanvas = ref(null)

let incomeChart = null
let expensesChart = null

const totalBalance = computed(() => {
  return accounts.value.reduce((sum, account) => {
    return sum + convertToRubles(account.balance, account.currency)
  }, 0)
})

const totalIncome = computed(() => {
  return transactions.value.reduce((sum, transaction) => {
    if (transaction.type !== 'income') return sum
    return sum + convertToRubles(transaction.amount, transaction.currency || '₽')
  }, 0)
})

const totalExpense = computed(() => {
  return transactions.value.reduce((sum, transaction) => {
    if (transaction.type !== 'expense') return sum
    return sum + convertToRubles(transaction.amount, transaction.currency || '₽')
  }, 0)
})

const monthDiffText = computed(() => {
  const monthDifference = totalIncome.value - totalExpense.value
  const diffSign = monthDifference >= 0 ? '+' : ''

  return `${diffSign} ${monthDifference.toLocaleString('ru-RU')} ₽ за этот месяц`
})

const recentTransactions = computed(() => {
  return transactions.value.slice(-4).reverse()
})

const incomeData = computed(() => {
  const result = {}

  transactions.value.forEach((transaction) => {
    if (transaction.type !== 'income') return

    const category = transaction.category || 'Без категории'
    const amount = convertToRubles(transaction.amount, transaction.currency || '₽')

    result[category] = (result[category] || 0) + amount
  })

  return result
})

const expenseData = computed(() => {
  const result = {}

  transactions.value.forEach((transaction) => {
    if (transaction.type !== 'expense') return

    const category = transaction.category || 'Без категории'
    const amount = convertToRubles(transaction.amount, transaction.currency || '₽')

    result[category] = (result[category] || 0) + amount
  })

  return result
})

const usdTrend = computed(() => {
  if (usdRate.value > usdPrev.value) return 'up'
  if (usdRate.value < usdPrev.value) return 'down'
  return ''
})

const eurTrend = computed(() => {
  if (eurRate.value > eurPrev.value) return 'up'
  if (eurRate.value < eurPrev.value) return 'down'
  return ''
})

function makeChart(canvas, dataObject, colors) {
  if (!canvas) return null

  const sortedEntries = Object.entries(dataObject).sort((a, b) => b[1] - a[1])

  let labels = []
  let data = []

  if (sortedEntries.length === 0) {
    labels = ['Нет данных']
    data = [1]
    colors = ['#e9ecef']
  } else {
    const top3 = sortedEntries.slice(0, 3)
    const others = sortedEntries.slice(3)

    labels = top3.map((item) => item[0])
    data = top3.map((item) => item[1])

    if (others.length > 0) {
      const othersSum = others.reduce((sum, item) => sum + item[1], 0)

      labels.push('Прочее')
      data.push(othersSum)
    }
  }

  const clr =
    getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() === '#212529'
      ? '#212529'
      : '#f8f9fa'

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: clr,
            font: {
              size: 13,
              weight: 'bold',
            },
          },
        },
      },
    },
  })
}

function renderCharts() {
  if (incomeChart) {
    incomeChart.destroy()
    incomeChart = null
  }

  if (expensesChart) {
    expensesChart.destroy()
    expensesChart = null
  }

  incomeChart = makeChart(
    incomeCanvas.value,
    incomeData.value,
    ['#c5a059', '#d4ba80', '#e3d4ab', '#f6f3dc'],
  )

  expensesChart = makeChart(
    expensesCanvas.value,
    expenseData.value,
    ['#740707', '#a01c1c', '#cf4c4c', '#f1bcbc'],
  )
}

async function loadDashboardData() {
  try {
    try {
      const rates = await getDailyRates()

      usdRate.value = rates.USD.Value
      usdPrev.value = rates.USD.Previous

      eurRate.value = rates.EUR.Value
      eurPrev.value = rates.EUR.Previous

      setRates({
        usd: rates.USD.Value,
        eur: rates.EUR.Value,
      })
    } catch (error) {
      console.warn('Не удалось загрузить живой курс', error)
    }

    const [loadedAccounts, loadedTransactions] = await Promise.all([
      getAccounts(userId.value),
      getTransactions(userId.value),
    ])

    accounts.value = loadedAccounts
    transactions.value = loadedTransactions

    await nextTick()
    renderCharts()
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

watch(
  () => [incomeData.value, expenseData.value, theme.value],
  () => {
    nextTick(renderCharts)
  },
  { deep: true },
)

onMounted(() => {
  document.body.className = ''
  loadDashboardData()
})

onBeforeUnmount(() => {
  if (incomeChart) incomeChart.destroy()
  if (expensesChart) expensesChart.destroy()
})
</script>

<template>
  <AppHeader active="dashboard" nav-class="navbar navbar-expand-lg shadow-sm" />

  <main>
    <div class="container mt-4">
      <section class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Обзор финансов</h1>

        <div class="d-flex gap-3">
          <span
            class="badge shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 currency-badge"
            style="color: var(--text-main);"
          >
            <img src="https://flagcdn.com/us.svg" width="22" class="rounded-1 shadow-sm" alt="US" />

            <span class="d-flex align-items-center gap-1">
              <span id="usdRateDisplay" class="fw-bold">{{ usdRate.toFixed(2) }}</span>
              ₽
              <span id="usdTrend">
                <svg v-if="usdTrend === 'up'" width="16" height="16" class="text-success">
                  <use :href="spriteHref('icon-arrow-up')"></use>
                </svg>

                <svg v-if="usdTrend === 'down'" width="16" height="16" class="text-danger">
                  <use :href="spriteHref('icon-arrow-down')"></use>
                </svg>
              </span>
            </span>
          </span>

          <span
            class="badge shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 currency-badge"
            style="color: var(--text-main);"
          >
            <img src="https://flagcdn.com/eu.svg" width="22" class="rounded-1 shadow-sm" alt="EU" />

            <span class="d-flex align-items-center gap-1">
              <span id="eurRateDisplay" class="fw-bold">{{ eurRate.toFixed(2) }}</span>
              ₽
              <span id="eurTrend">
                <svg v-if="eurTrend === 'up'" width="16" height="16" class="text-success">
                  <use :href="spriteHref('icon-arrow-up')"></use>
                </svg>

                <svg v-if="eurTrend === 'down'" width="16" height="16" class="text-danger">
                  <use :href="spriteHref('icon-arrow-down')"></use>
                </svg>
              </span>
            </span>
          </span>
        </div>
      </section>

      <section class="row mb-4">
        <div class="col-lg-4 mb-4 mb-lg-0">
          <div
            class="card text-white shadow-sm h-100 border-0 rounded-4 d-flex flex-column justify-content-center align-items-center p-4 bg-custom"
          >
            <h2 class="h5 opacity-75 mb-2 fw-normal">Общий баланс</h2>

            <h1 id="totalBalance" class="display-6 fw-bold mb-0">
              {{ formatRubles(totalBalance) }}
            </h1>

            <span
              id="monthDiff"
              class="badge bg-white mt-3 rounded-pill px-3 py-2 fs-6 shadow-sm text-custom"
            >
              {{ monthDiffText }}
            </span>
          </div>
        </div>

        <figure class="col-lg-4 mb-4 mb-lg-0">
          <div class="card shadow-sm border-0 rounded-4 h-100 p-4">
            <div class="text-center mb-3">
              <figcaption class="text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Доходы
              </figcaption>

              <h2 id="totalIncome" class="fw-bolder mb-0">{{ formatRubles(totalIncome) }}</h2>
            </div>

            <div class="d-flex justify-content-center align-items-center chart-container">
              <canvas
                id="incomeChart"
                ref="incomeCanvas"
                role="img"
                aria-label="График распределения доходов по категориям"
              ></canvas>
            </div>
          </div>
        </figure>

        <figure class="col-lg-4">
          <div class="card shadow-sm border-0 rounded-4 h-100 p-4">
            <div class="text-center mb-3">
              <figcaption class="text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Расходы
              </figcaption>

              <h2 id="totalExpense" class="fw-bolder mb-0">{{ formatRubles(totalExpense) }}</h2>
            </div>

            <div class="d-flex justify-content-center align-items-center chart-container">
              <canvas
                id="expensesChart"
                ref="expensesCanvas"
                role="img"
                aria-label="График распределения расходов по категориям"
              ></canvas>
            </div>
          </div>
        </figure>
      </section>

      <section class="row">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm border-0 rounded-4 h-100">
            <div class="card-header border-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
              <h2 class="h5 mb-0">Последние операции</h2>

              <a
                href="transact.html"
                class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                @click.prevent="router.push({ name: 'transactions' })"
              >
                Смотреть все
              </a>
            </div>

            <div id="recentOps" class="card-body">
              <div
                v-for="transaction in recentTransactions"
                :key="transaction.id"
                class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
              >
                <div class="d-flex align-items-center gap-3">
                  <div>
                    <h2 class="h6 mb-0 fw-bold">{{ transaction.description || transaction.type }}</h2>

                    <small class="text-muted">
                      {{ transaction.date || 'Сегодня' }} • {{ transaction.category }}
                    </small>
                  </div>
                </div>

                <div
                  class="fw-bold"
                  :class="transaction.type === 'expense' ? 'text-danger' : 'text-success'"
                >
                  {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount }} ₽
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 mb-4">
          <div
            class="card shadow-sm border-0 rounded-4 h-100 d-flex flex-column justify-content-center align-items-center p-4 text-center"
          >
            <h2 class="h5 mb-2 fw-bold">Авто-импорт операций</h2>

            <p class="small text-muted mb-4">
              Подключите свой банк для автоматической загрузки транзакций и аналитики.
            </p>

            <button
              class="btn btn-custom w-100 rounded-pill py-2"
              data-bs-toggle="modal"
              data-bs-target="#addBankModal"
            >
              Настроить интеграцию
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>

  <div id="addBankModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg">
        <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
          <h5 class="modal-title fw-bold">Импорт операций</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>

        <div class="modal-body p-4">
          <p class="text-muted small mb-4">
            Настройте автоматическую синхронизацию или загрузите выписку вручную.
          </p>

          <form>
            <div class="mb-4">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Выберите банк
              </label>

              <select class="form-select border-0">
                <option>Тинькофф</option>
                <option>Сбербанк</option>
                <option>Альфа-Банк</option>
                <option>ВТБ</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                API Токен (Автоматически)
              </label>

              <input type="password" class="form-control border-0" placeholder="Вставьте ваш токен" />
            </div>

            <div class="d-flex align-items-center my-4">
              <hr class="flex-grow-1 text-muted opacity-25" />
              <span class="mx-3 text-muted small fw-bold text-uppercase letter-spacing-2">или</span>
              <hr class="flex-grow-1 text-muted opacity-25" />
            </div>

            <div class="mb-4">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Загрузить выписку (Вручную)
              </label>

              <input
                id="statementFile"
                class="form-control border-0 text-muted"
                type="file"
                accept=".csv, .xls, .xlsx"
              />

              <span class="form-text text-muted small mt-2">
                Поддерживаемые форматы: CSV или Excel.
              </span>
            </div>

            <button
              type="button"
              class="btn btn-custom w-100 py-3 rounded-pill fw-bold mt-2"
              data-bs-dismiss="modal"
            >
              Загрузить данные
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
