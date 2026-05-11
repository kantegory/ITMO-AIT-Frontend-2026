<template>
  <BaseLayout>
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h2 class="section-title mb-2">Личный кабинет пользователя</h2>
        <p class="section-subtitle mb-0">
          Счета, транзакции, бюджеты и поиск операций по категории, сумме и дате.
        </p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <RouterLink class="btn btn-primary rounded-pill" to="/reports">Открыть отчёт</RouterLink>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-xl-4">
        <div class="account-card">
          <small>{{ financeStore.mainAccount?.title || 'Основной счёт' }}</small>
          <div class="h2 fw-bold mt-3 mb-1">
            {{ formatMoney(financeStore.mainAccount?.balance || 0) }}
          </div>
          <small>{{ financeStore.mainAccount?.number || 'Карта • **** 0000' }}</small>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="metric-card">
          <div class="metric-label">Сбережения</div>
          <div class="metric-value">{{ formatMoney(financeStore.savingsAccount?.balance || 0) }}</div>
          <p class="text-secondary mb-0 mt-2">Накопительный счёт и резерв</p>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="metric-card">
          <div class="metric-label">Расходы за месяц</div>
          <div class="metric-value">{{ formatMoney(monthExpenses) }}</div>
          <p class="text-secondary mb-0 mt-2">Текущие расходы пользователя</p>
        </div>
      </div>
    </div>


    <div class="row g-4 mb-4">
      <div class="col-lg-6">
        <div class="page-card h-100">
          <h3 class="h5 fw-bold mb-3">Новая транзакция</h3>
          <form class="row g-3" @submit.prevent="submitTransaction">
            <div class="col-12">
              <label class="form-label" for="txDescription">Описание</label>
              <input
                id="txDescription"
                v-model.trim="transactionForm.description"
                class="form-control rounded-4"
                type="text"
                placeholder="Например, Супермаркет"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="txCategory">Категория</label>
              <select id="txCategory" v-model="transactionForm.category" class="form-select rounded-4">
                <option v-for="category in transactionCategoryOptions" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="txType">Тип</label>
              <select id="txType" v-model="transactionForm.type" class="form-select rounded-4">
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="txAmount">Сумма</label>
              <input
                id="txAmount"
                v-model.number="transactionForm.amount"
                class="form-control rounded-4"
                type="number"
                inputmode="numeric"
                placeholder="1200"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="txDate">Дата</label>
              <input id="txDate" v-model="transactionForm.date" class="form-control rounded-4" type="date" :max="todayDate" required />
            </div>
            <div class="col-12">
              <button class="btn btn-primary rounded-pill px-4" type="submit">Добавить транзакцию</button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="page-card h-100">
          <h3 class="h5 fw-bold mb-3">Краткая сводка</h3>
          <div class="quick-grid">
            <div class="metric-list-item">
              <div class="metric-label">Всего операций</div>
              <div class="metric-value">{{ summaryTransactions.length }}</div>
            </div>
            <div class="metric-list-item">
              <div class="metric-label">Доходных операций</div>
              <div class="metric-value">
                {{ incomeTransactions.length }}
              </div>
            </div>
            <div class="metric-list-item">
              <div class="metric-label">Расходных операций</div>
              <div class="metric-value">
                {{ expenseTransactions.length }}
              </div>
            </div>
            <div class="metric-list-item">
              <div class="metric-label">Последняя операция</div>
              <div class="fw-semibold mt-2">
                {{ summaryTransactions[0]?.description || 'Нет данных' }}
              </div>
              <div class="text-secondary small">{{ summaryTransactions[0]?.date || '—' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="page-card">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label class="form-label" for="accountOperationAmount">Сумма операции</label>
              <input
                id="accountOperationAmount"
                v-model.number="operationAmount"
                class="form-control rounded-4"
                type="number"
                inputmode="numeric"
                placeholder="Например, 5000"
              />
            </div>
            <div class="col-md-8">
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-primary rounded-pill" type="button" @click="handleOperation('deposit-main')">
                  Пополнить основной счёт
                </button>
                <button class="btn btn-outline-primary rounded-pill" type="button" @click="handleOperation('move-to-savings')">
                  Перевести в сбережения
                </button>
                <button class="btn btn-outline-success rounded-pill" type="button" @click="handleOperation('withdraw-from-savings')">
                  Вывести из сбережений
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-xl-8">
        <div class="page-card h-100">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
              <h3 class="h5 fw-bold mb-1">Поиск и фильтрация транзакций</h3>
              <p class="text-secondary mb-0">Категория, сумма и дата</p>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label" for="categoryFilter">Категория</label>
              <select id="categoryFilter" v-model="filters.category" class="form-select rounded-4">
                <option value="">Все категории</option>
                <option v-for="category in allCategoryOptions" :key="`filter-${category}`" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="amountFilter">Минимальная сумма</label>
              <input
                id="amountFilter"
                v-model.number="filters.amount"
                class="form-control rounded-4"
                type="number"
                inputmode="numeric"
                placeholder="Например, 1000"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label" for="dateFilter">Дата</label>
              <input id="dateFilter" v-model="filters.date" class="form-control rounded-4" type="date" />
            </div>
          </div>

          <div class="d-flex gap-2 flex-wrap mb-4">
            <button class="btn btn-primary rounded-pill px-4" type="button" @click="applyFilters">
              Применить
            </button>
            <button class="btn btn-outline-secondary rounded-pill px-4" type="button" @click="resetFilters">
              Сбросить
            </button>
          </div>

          <TransactionTable :items="filteredTransactions" :show-delete="true" @delete="removeTransaction" />
        </div>
      </div>

      <div class="col-xl-4">
        <div class="page-card h-100">
          <h3 class="h5 fw-bold mb-4">Бюджеты</h3>
          <template v-if="financeStore.budgets.length">
            <BudgetProgress v-for="budget in financeStore.budgets" :key="budget.id" :budget="budget" />
          </template>
          <p v-else class="text-secondary mb-0">Бюджеты пока не добавлены.</p>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-6">
        <div class="page-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h3 class="h5 fw-bold mb-1">Курсы валют ЦБ РФ</h3>
              <p class="text-secondary mb-0">Текущие курсы и изменение к предыдущей дате</p>
            </div>
            <button class="btn btn-outline-secondary btn-sm rounded-pill" type="button" @click="marketsStore.loadCbrRates()">
              Обновить
            </button>
          </div>

          <div v-if="marketsStore.currencyItems.length" class="market-list">
            <div v-for="item in marketsStore.currencyItems" :key="item.code" class="market-row border-bottom py-2">
              <div>
                <div class="fw-semibold">{{ item.label }}</div>
                <div class="text-secondary small">1 {{ item.code }} = {{ item.rate.toFixed(4) }} RUB</div>
              </div>
              <div class="text-end">
                <div class="small text-secondary">{{ currencyUpdatedAt }}</div>
                <div class="small" :class="item.rate - item.previousRate >= 0 ? 'text-success' : 'text-danger'">
                  {{ item.rate - item.previousRate >= 0 ? '+' : '' }}{{ (item.rate - item.previousRate).toFixed(4) }} RUB
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">Данные по валютам пока не загружены.</div>

          <div class="mt-4">
            <h4 class="h6 fw-bold">Конвертер валют</h4>
            <div class="row g-2">
              <div class="col-12">
                <input
                  v-model.number="currencyAmount"
                  class="form-control rounded-4"
                  inputmode="numeric"
                  placeholder="Введите сумму"
                  type="number"
                />
              </div>
              <div class="col-md-5">
                <select v-model="currencyFrom" class="form-select rounded-4">
                  <option value="RUB">RUB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="KZT">KZT</option>
                  <option value="BYN">BYN</option>
                </select>
              </div>
              <div class="col-md-2 d-flex align-items-center justify-content-center text-secondary">→</div>
              <div class="col-md-5">
                <select v-model="currencyTo" class="form-select rounded-4">
                  <option value="USD">USD</option>
                  <option value="RUB">RUB</option>
                  <option value="EUR">EUR</option>
                  <option value="KZT">KZT</option>
                  <option value="BYN">BYN</option>
                </select>
              </div>
              <div class="col-12">
                <button class="btn btn-outline-primary rounded-pill" type="button" @click="showConvertResult = true">
                  Конвертировать
                </button>
              </div>
            </div>
            <div class="mt-3 text-secondary">
              <template v-if="showConvertResult">{{ convertResultText }}</template>
              <template v-else>Введите сумму и нажмите «Конвертировать».</template>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="h6 fw-bold">Архив курса</h4>
            <div class="row g-2">
              <div class="col-md-6">
                <select v-model="archiveCurrency" class="form-select rounded-4">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="KZT">KZT</option>
                  <option value="BYN">BYN</option>
                </select>
              </div>
            </div>
            <div class="mt-3 text-secondary" v-html="archiveInfoHtml"></div>
          </div>

          <div class="text-secondary small mt-3">{{ marketsStore.currenciesStatus }}</div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="page-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h3 class="h5 fw-bold mb-1">Криптовалюты</h3>
              <p class="text-secondary mb-0">Bitcoin, Ethereum и Toncoin</p>
            </div>
            <button class="btn btn-outline-secondary btn-sm rounded-pill" type="button" @click="marketsStore.loadCryptoPrices()">
              Обновить
            </button>
          </div>

          <div v-if="marketsStore.cryptoItems.length" class="market-list">
            <div v-for="item in marketsStore.cryptoItems" :key="item.key" class="market-row border-bottom py-2">
              <div>
                <div class="fw-semibold">
                  {{ item.label }} <span class="text-secondary small">{{ item.ticker }}</span>
                </div>
                <div class="text-secondary small">
                  {{ formatCompactMoney(item.rub, 'RUB', 0) }} · {{ formatCompactMoney(item.usd, 'USD', 2) }}
                </div>
              </div>
              <div class="fw-semibold" :class="item.change >= 0 ? 'text-success' : 'text-danger'">
                {{ item.changeLabel }}
              </div>
            </div>
          </div>

          <div v-else class="empty-state">Данные по криптовалютам пока не загружены.</div>

          <div class="text-secondary small mt-3">{{ marketsStore.cryptoStatus }}</div>
        </div>
      </div>

      <div class="col-12">
        <div class="page-card">
          <div class="d-flex justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h3 class="h5 fw-bold mb-1">Рынок MOEX ISS</h3>
              <p class="text-secondary mb-0">Индекс МосБиржи и популярные российские бумаги</p>
            </div>
            <button class="btn btn-outline-secondary btn-sm rounded-pill" type="button" @click="marketsStore.loadMoexMarket()">
              Обновить
            </button>
          </div>

          <div v-if="marketsStore.moexItems.length" class="market-list">
            <div v-for="item in marketsStore.moexItems" :key="item.security" class="market-row border-bottom py-2">
              <div>
                <div class="fw-semibold">{{ item.security }}</div>
                <div class="text-secondary small">{{ item.shortName }}</div>
              </div>
              <div class="text-end">
                <div class="fw-semibold">
                  {{ item.price ? item.price.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—' }}
                </div>
                <div class="small" :class="item.changePercent >= 0 ? 'text-success' : 'text-danger'">
                  {{ item.changeLabel }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">Данные MOEX пока не загружены.</div>

          <div class="text-secondary small mt-3">{{ marketsStore.moexStatus }}</div>
        </div>
      </div>
    </div>


  </BaseLayout>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BudgetProgress from '@/components/finance/BudgetProgress.vue'
import TransactionTable from '@/components/finance/TransactionTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'
import { useMarketsStore } from '@/stores/markets'
import { useToast } from '@/composables/useToast'
import { useUserFinanceData } from '@/composables/useUserFinanceData'
import { formatMoney } from '@/utils'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const marketsStore = useMarketsStore()
const { showToast } = useToast()

const operationAmount = ref(null)
const currencyAmount = ref(null)
const currencyFrom = ref('RUB')
const currencyTo = ref('USD')
const archiveCurrency = ref('USD')
const showConvertResult = ref(false)

const filters = reactive({
  category: '',
  amount: null,
  date: ''
})

const expenseCategoryOptions = ['Продукты', 'Транспорт', 'Развлечения', 'Подписки', 'Здоровье', 'Дом']
const incomeCategoryOptions = ['Зарплата', 'Инвестиции', 'Фриланс', 'Кэшбэк', 'Подарки', 'Переводы']

const transactionForm = reactive({
  description: '',
  category: expenseCategoryOptions[0],
  type: 'expense',
  amount: null,
  date: new Date().toISOString().slice(0, 10)
})

const todayDate = new Date().toISOString().slice(0, 10)

function isImportedIntegrationTransaction(item) {
  const importedDescriptions = ['Market Import', 'Metro Card']

  return (
    item?.imported === true ||
    item?.source === 'integration' ||
    item?.importSource === 'payment-account' ||
    importedDescriptions.includes(item?.description)
  )
}

const summaryTransactions = computed(() =>
  financeStore.transactions.filter((item) => !isImportedIntegrationTransaction(item))
)

const transactionCategoryOptions = computed(() =>
  transactionForm.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions
)

const allCategoryOptions = computed(() => [...expenseCategoryOptions, ...incomeCategoryOptions])

const filteredTransactions = computed(() => {
  let items = [...financeStore.transactions]

  if (filters.category) {
    items = items.filter((item) => item.category === filters.category)
  }

  if (filters.amount) {
    items = items.filter((item) => normalizedAmount(item.amount) >= Number(filters.amount))
  }

  if (filters.date) {
    items = items.filter((item) => item.date === filters.date)
  }

  return items
})

function normalizedAmount(value) {
  return Math.abs(Number(value || 0))
}

const monthExpenses = computed(() => {
  const expenseTransactions = financeStore.transactions.filter((item) => item.type === 'expense')

  if (!expenseTransactions.length) {
    return 0
  }

  const currentMonth = new Date().toISOString().slice(0, 7)
  const expenseMonths = [...new Set(expenseTransactions.map((item) => String(item.date || '').slice(0, 7)).filter(Boolean))].sort()

  const referenceMonth = expenseMonths.includes(currentMonth)
    ? currentMonth
    : [...expenseMonths].reverse().find((month) => month <= currentMonth) || expenseMonths.at(-1)

  return expenseTransactions
    .filter((item) => String(item.date || '').startsWith(referenceMonth))
    .reduce((sum, item) => sum + normalizedAmount(item.amount), 0)
})

const expenseTransactions = computed(() =>
  summaryTransactions.value.filter((item) => item.type === 'expense')
)

const incomeTransactions = computed(() =>
  summaryTransactions.value.filter((item) => item.type === 'income')
)

const currencyUpdatedAt = computed(() => {
  if (!marketsStore.cbrRatesCache?.Date) return '—'
  return new Date(marketsStore.cbrRatesCache.Date).toLocaleString('ru-RU')
})

const convertResultText = computed(() => {
  const amount = Number(currencyAmount.value)

  if (!amount || amount <= 0) {
    return 'Введите сумму больше нуля.'
  }

  const fromRate = marketsStore.getRateByCode(currencyFrom.value)
  const toRate = marketsStore.getRateByCode(currencyTo.value)

  if (fromRate == null || toRate == null) {
    return 'Не удалось выполнить конвертацию.'
  }

  const rubValue = amount * fromRate
  const converted = rubValue / toRate

  return `${amount.toLocaleString('ru-RU')} ${currencyFrom.value} = ${converted.toLocaleString('ru-RU', {
    maximumFractionDigits: 4
  })} ${currencyTo.value}`
})

const archiveInfoHtml = computed(() => {
  const current = marketsStore.getRateByCode(archiveCurrency.value)
  const previous = marketsStore.getPreviousRateByCode(archiveCurrency.value)

  if (current == null || previous == null) {
    return '<span>Нет данных для выбранной валюты.</span>'
  }

  const delta = current - previous
  const deltaClass = delta >= 0 ? 'text-success' : 'text-danger'
  const deltaPrefix = delta >= 0 ? '+' : ''

  return `
    <div class="small text-secondary mb-1">Сравнение с предыдущей датой</div>
    <div class="fw-semibold">Сегодня: ${current.toFixed(4)} RUB</div>
    <div class="fw-semibold">Предыдущий курс: ${previous.toFixed(4)} RUB</div>
    <div class="${deltaClass}">Изменение: ${deltaPrefix}${delta.toFixed(4)} RUB</div>
  `
})

function formatCompactMoney(value, currency = 'RUB', maximumFractionDigits = 2) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits
  }).format(Number(value || 0))
}

function applyFilters() {
  showToast('Фильтр применён')
}

function resetFilters() {
  filters.category = ''
  filters.amount = null
  filters.date = ''
  showToast('Фильтры сброшены')
}

async function handleOperation(type) {
  const amount = Number(operationAmount.value)

  if (!amount || amount <= 0) {
    showToast('Введите сумму больше нуля')
    return
  }

  try {
    if (type === 'deposit-main') {
      await financeStore.depositToMain(amount, authStore.user.id)
      showToast('Основной счёт пополнен')
    }

    if (type === 'move-to-savings') {
      await financeStore.moveToSavings(amount, authStore.user.id)
      showToast('Средства переведены в сбережения')
    }

    if (type === 'withdraw-from-savings') {
      await financeStore.withdrawFromSavings(amount, authStore.user.id)
      showToast('Средства переведены на основной счёт')
    }

    operationAmount.value = null
  } catch (error) {
    showToast(error.message || 'Не удалось выполнить операцию')
  }
}

async function submitTransaction() {
  if (!transactionForm.description || transactionForm.amount == null || transactionForm.amount === '' || !transactionForm.date) {
    showToast('Заполните все поля транзакции')
    return
  }

  const normalizedAmountValue = normalizedAmount(transactionForm.amount)

  if (!normalizedAmountValue) {
    showToast('Сумма должна быть больше нуля')
    return
  }

  if (Number(transactionForm.amount) < 0) {
    showToast('Нельзя вводить сумму с минусом. Укажите положительное значение.')
    return
  }

  if (transactionForm.date > todayDate) {
    showToast('Нельзя добавить транзакцию с датой позже сегодняшнего дня')
    return
  }

  try {
    await financeStore.createTransaction(
      {
        userId: authStore.user.id,
        description: transactionForm.description,
        category: transactionForm.category,
        amount: normalizedAmountValue,
        type: transactionForm.type,
        date: transactionForm.date
      },
      authStore.user.id
    )

    transactionForm.description = ''
    transactionForm.type = 'expense'
    transactionForm.category = expenseCategoryOptions[0]
    transactionForm.amount = null
    transactionForm.date = new Date().toISOString().slice(0, 10)

    showToast('Транзакция добавлена')
  } catch (error) {
    showToast(error.message || 'Ошибка при добавлении транзакции')
  }
}

async function removeTransaction(item) {
  if (!item?.id) return

  const confirmed = window.confirm(`Удалить транзакцию «${item.description}»?`)

  if (!confirmed) return

  try {
    await financeStore.deleteTransaction(item.id, authStore.user.id)
    showToast('Транзакция удалена')
  } catch (error) {
    showToast(error.message || 'Не удалось удалить транзакцию')
  }
}


watch(
  () => transactionForm.type,
  (nextType) => {
    const nextOptions = nextType === 'income' ? incomeCategoryOptions : expenseCategoryOptions

    if (!nextOptions.includes(transactionForm.category)) {
      transactionForm.category = nextOptions[0]
    }
  },
  { immediate: true }
)

useUserFinanceData([() => marketsStore.refreshAll()])
</script>
