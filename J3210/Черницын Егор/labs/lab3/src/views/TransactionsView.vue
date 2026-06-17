<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Modal } from 'bootstrap'
import { useRoute } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
import TransactionRow from '@/components/TransactionRow.vue'

import { getAccounts, patchAccount } from '@/api/accounts'
import { createTransaction, getTransactions } from '@/api/transactions'
import { normalizeId, useAuth } from '@/composables/useAuth'

const route = useRoute()
const { userId } = useAuth()

const tableTransactions = ref([])
const allTransactionsForOptions = ref([])
const allAccounts = ref([])

const filters = reactive({
  search: '',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  accountId: 'all',
})

const transactionForm = reactive({
  description: '',
  category: '',
  date: '',
  accountId: '',
  type: 'expense',
  amount: '',
})

const categories = computed(() => {
  return [...new Set(allTransactionsForOptions.value.map((transaction) => transaction.category))]
    .filter(Boolean)
})

const accountMap = computed(() => {
  return allAccounts.value.reduce((result, account) => {
    result[account.id] = account.name
    return result
  }, {})
})

function resetTransactionForm() {
  transactionForm.description = ''
  transactionForm.category = ''
  transactionForm.date = new Date().toISOString().slice(0, 10)
  transactionForm.accountId = allAccounts.value[0]?.id || ''
  transactionForm.type = 'expense'
  transactionForm.amount = ''
}

async function loadFilterOptions() {
  const [loadedAccounts, loadedTransactions] = await Promise.all([
    getAccounts(userId.value),
    getTransactions(userId.value),
  ])

  allAccounts.value = loadedAccounts
  allTransactionsForOptions.value = loadedTransactions

  resetTransactionForm()
}

async function loadTableTransactions() {
  tableTransactions.value = await getTransactions(userId.value, {
    search: filters.search,
    category: filters.category,
    accountId: filters.accountId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sort: '-date',
  })
}

async function loadTransactionsPage() {
  try {
    await loadFilterOptions()

    if (route.query.accountId) {
      filters.accountId = String(route.query.accountId)
    }

    await loadTableTransactions()
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  }
}

async function applyFilters() {
  try {
    await loadTableTransactions()
  } catch (error) {
    console.error('Ошибка фильтрации:', error)
  }
}

async function saveTransaction() {
  const account = allAccounts.value.find((item) => {
    return String(item.id) === String(transactionForm.accountId)
  })

  if (!account) {
    alert('Счёт не найден.')
    return
  }

  const amount = Number(transactionForm.amount)

  const newTransaction = {
    userId: normalizeId(userId.value),
    accountId: normalizeId(transactionForm.accountId),
    type: transactionForm.type,
    amount,
    currency: account.currency,
    category: transactionForm.category,
    description: transactionForm.description,
    date: transactionForm.date,
  }

  try {
    await createTransaction(newTransaction)

    const newBalance =
      transactionForm.type === 'expense'
        ? Number(account.balance) - amount
        : Number(account.balance) + amount

    await patchAccount(account.id, {
      balance: newBalance,
    })

    const modalElement = document.getElementById('addTransactionModal')
    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)

    modalInstance.hide()

    await loadFilterOptions()
    await loadTableTransactions()
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Произошла ошибка при сохранении транзакции.')
  }
}

watch(
  () => route.query.accountId,
  async (accountId) => {
    filters.accountId = accountId ? String(accountId) : 'all'
    await loadTableTransactions()
  },
)

onMounted(() => {
  document.body.className = ''
  loadTransactionsPage()
})
</script>

<template>
  <AppHeader active="transactions" nav-class="navbar navbar-expand-lg shadow-sm bg-white" />

  <main>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>История транзакций</h3>

        <button class="btn btn-custom rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
          + Новая запись
        </button>
      </div>

      <div class="card shadow-sm border-0 rounded-4 mb-4">
        <div class="card-body">
          <form id="filterForm" class="row g-3" @submit.prevent="applyFilters">
            <div class="col-md-2">
              <label for="searchInput" class="form-label text-muted small mb-1">Поиск</label>

              <input
                id="searchInput"
                v-model="filters.search"
                type="text"
                class="form-control"
                placeholder="Ключевые слова..."
              />
            </div>

            <div class="col-md-2">
              <label for="categoryFilter" class="form-label text-muted small mb-1">Категория</label>

              <select id="categoryFilter" v-model="filters.category" class="form-select">
                <option value="all" class="text-dark">Все категории</option>

                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="col-md-2">
              <label for="dateFrom" class="form-label text-muted small mb-1">От даты</label>

              <input id="dateFrom" v-model="filters.dateFrom" type="date" class="form-control" />
            </div>

            <div class="col-md-2">
              <label for="dateTo" class="form-label text-muted small mb-1">До даты</label>

              <input id="dateTo" v-model="filters.dateTo" type="date" class="form-control" />
            </div>

            <div class="col-md-2">
              <label for="accountFilter" class="form-label text-muted small mb-1">Счёт</label>

              <select id="accountFilter" v-model="filters.accountId" class="form-select">
                <option value="all">Все счета</option>

                <option v-for="account in allAccounts" :key="account.id" :value="String(account.id)">
                  {{ account.name }}
                </option>
              </select>
            </div>

            <div class="col-md-2 d-flex align-items-end">
              <button id="applyFilterBtn" type="submit" class="btn btn-secondary w-100">Применить</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-body p-0">
          <div class="table-responsive table-scroll-container">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light sticky-table-header">
              <tr>
                <th class="ps-4 py-3">Дата</th>
                <th class="py-3">Описание</th>
                <th class="py-3">Счет</th>
                <th class="py-3">Категория</th>
                <th class="pe-4 py-3">Сумма</th>
              </tr>
              </thead>

              <tbody id="transTable">
              <TransactionRow
                v-for="transaction in tableTransactions"
                :key="transaction.id"
                :transaction="transaction"
                :account-map="accountMap"
              />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div id="addTransactionModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg">
        <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
          <h5 class="modal-title fw-bold">Новая транзакция</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>

        <div class="modal-body p-4">
          <form id="addTransactionForm" @submit.prevent="saveTransaction">
            <div class="mb-3">
              <label
                for="newTransDesc"
                class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1"
              >
                Описание
              </label>

              <input
                id="newTransDesc"
                v-model="transactionForm.description"
                type="text"
                class="form-control border-0"
                placeholder="Например: поход в вольчек"
                required
              />
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <label
                  for="newTransCategory"
                  class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1"
                >
                  Категория
                </label>

                <input
                  id="newTransCategory"
                  v-model="transactionForm.category"
                  type="text"
                  list="categoryList"
                  class="form-control border-0"
                  placeholder="Выберите или введите..."
                  autocomplete="off"
                  required
                />

                <datalist id="categoryList">
                  <option v-for="category in categories" :key="category" :value="category"></option>
                </datalist>
              </div>

              <div class="col-6">
                <label
                  for="newTransDate"
                  class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1"
                >
                  Дата
                </label>

                <input
                  id="newTransDate"
                  v-model="transactionForm.date"
                  type="date"
                  class="form-control border-0"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label
                for="newTransAccount"
                class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1"
              >
                Счёт
              </label>

              <select
                id="newTransAccount"
                v-model="transactionForm.accountId"
                class="form-select border-0"
                required
              >
                <option v-for="account in allAccounts" :key="account.id" :value="account.id">
                  {{ account.name }} ({{ account.balance }} ₽)
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label
                for="newTransType"
                class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1"
              >
                Операция
              </label>

              <select
                id="newTransType"
                v-model="transactionForm.type"
                class="form-select border-0"
                required
              >
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>

            <div class="mb-4">
              <label
                for="newTransAmount"
                class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1"
              >
                Сумма (₽)
              </label>

              <input
                id="newTransAmount"
                v-model="transactionForm.amount"
                type="number"
                class="form-control form-control-lg border-0"
                placeholder="0.00"
                required
              />
            </div>

            <button type="submit" class="btn btn-custom w-100 py-3 mb-3">
              Сохранить транзакцию
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
