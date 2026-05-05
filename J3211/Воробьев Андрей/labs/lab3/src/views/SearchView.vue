<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'
import {
  createTransaction,
  getAccountsByUser,
  getCategories,
  getTransactionsByFilter,
  getTransactionsByUser,
  getUserNotificationSettings,
  updateUserNotificationSettings
} from '@/api/finance'

const authStore = useAuthStore()
const modalStore = useModalStore()

const allTransactions = ref([])
const accounts = ref([])
const categories = ref([])
const filter = reactive({
  period: 'Март 2026',
  category: 'Все категории',
  account: 'Все счета'
})

const accountsById = computed(() =>
  accounts.value.reduce((acc, account) => {
    acc[account.id] = account.name
    return acc
  }, {})
)

function formatDate(dateISO) {
  return new Date(dateISO).toLocaleDateString('ru-RU')
}

function formatAmount(value) {
  return `${value > 0 ? '+' : '-'} ${Math.abs(value).toLocaleString('ru-RU')} ₽`
}

async function initSearchPage() {
  try {
    const [loadedAccounts, loadedTransactions, categoriesData] = await Promise.all([
      getAccountsByUser(authStore.user.id),
      getTransactionsByUser(authStore.user.id),
      getCategories()
    ])

    accounts.value = loadedAccounts
    allTransactions.value = loadedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    categories.value = [...new Set(categoriesData.map((cat) => cat.name))].sort((a, b) => a.localeCompare(b, 'ru'))
  } catch (error) {
    modalStore.openInfo('Ошибка', error.message)
  }
}

async function filterTransactions() {
  try {
    const transactions = await getTransactionsByFilter(authStore.user.id, filter)
    allTransactions.value = transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    modalStore.openInfo('Ошибка', error.message)
  }
}

function openAddTransactionModal() {
  modalStore.openTransaction(accounts.value, categories.value, async (data) => {
    try {
      await createTransaction({
        userId: authStore.user.id,
        accountId: data.accountId,
        date: data.date,
        category: data.category,
        comment: data.comment,
        amount: data.amount
      })
      modalStore.openInfo('Успех', 'Транзакция добавлена')
      await initSearchPage()
    } catch (error) {
      modalStore.openInfo('Ошибка', error.message)
    }
  })
}

async function openRuleModal() {
  try {
    const settings = await getUserNotificationSettings(authStore.user.id)
    modalStore.openRule(settings, async (notificationSettings) => {
      try {
        await updateUserNotificationSettings(authStore.user.id, notificationSettings)
        modalStore.openInfo('Успех', 'Настройки уведомлений сохранены')
      } catch (error) {
        modalStore.openInfo('Ошибка', error.message)
      }
    })
  } catch (error) {
    modalStore.openInfo('Ошибка', error.message)
  }
}

onMounted(() => {
  initSearchPage()
})
</script>

<template>
  <BaseLayout>
    <main class="container mt-3">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 class="fw-bold mb-0">История операций</h1>
        <div class="d-grid d-md-flex gap-3">
          <button
            id="addAccountRule"
            type="button"
            class="btn btn-primary btn-custom"
            aria-label="Добавить новое правило"
            @click="openRuleModal"
          >
            + Правило
          </button>
          <button
            id="addTransactionBtn"
            type="button"
            class="btn btn-primary btn-custom"
            aria-label="Добавить новую транзакцию"
            @click="openAddTransactionModal"
          >
            + Транзакция
          </button>
        </div>
      </div>

      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body p-4">
          <form id="filterForm" class="row g-3" aria-label="Фильтрация транзакций" @submit.prevent="filterTransactions">
            <div class="col-md-3">
              <label class="form-label fw-bold me-2" for="filterPeriod">Период</label>
              <select id="filterPeriod" v-model="filter.period" class="form-select" name="period">
                <option>Март 2026</option>
                <option>Февраль 2026</option>
                <option>Весь период</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label fw-bold me-2" for="filterCategory">Категория</label>
              <select id="filterCategory" v-model="filter.category" class="form-select" name="category">
                <option>Все категории</option>
                <option v-for="category in categories" :key="category">{{ category }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label fw-bold me-2" for="filterAccount">Счёт</label>
              <select id="filterAccount" v-model="filter.account" class="form-select" name="account">
                <option>Все счета</option>
                <option v-for="account in accounts" :key="account.id">{{ account.name }}</option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button type="submit" class="btn btn-outline-secondary w-100 fw-bold">Найти</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <div class="table-responsive">
            <table class="table table-custom align-middle">
              <caption class="visually-hidden">
                Таблица найденных транзакций
              </caption>
              <thead>
                <tr>
                  <th scope="col">Дата</th>
                  <th scope="col">Категория</th>
                  <th scope="col">Счёт</th>
                  <th scope="col">Комментарий</th>
                  <th scope="col" class="text-end">Сумма</th>
                </tr>
              </thead>
              <tbody id="transactionsTableBody" aria-live="polite">
                <tr v-if="!allTransactions.length">
                  <td colspan="5" class="text-center text-muted">Транзакции по выбранному фильтру не найдены.</td>
                </tr>
                <tr v-for="transaction in allTransactions" v-else :key="transaction.id">
                  <td>{{ formatDate(transaction.date) }}</td>
                  <td>{{ transaction.category }}</td>
                  <td><span class="badge bg-light text-dark border">{{ accountsById[transaction.accountId] }}</span></td>
                  <td class="text-muted">{{ transaction.comment }}</td>
                  <td class="text-end fw-bold" :class="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                    {{ formatAmount(transaction.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
