<script setup>
import { computed, onMounted, ref } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { getAccountsByUser, getTransactionsByUser } from '@/api/finance'
import { useFormatters } from '@/composables/useFormatters'
import { useModalFeedback } from '@/composables/useModalFeedback'
import { useAccountsById, useSortedTransactions } from '@/composables/useTransactionHelpers'

const authStore = useAuthStore()
const { showError } = useModalFeedback()
const { formatMoney, formatDate, formatSignedAmount } = useFormatters()

const accounts = ref([])
const transactions = ref([])

const { accountsById } = useAccountsById(accounts)
const { sortedTransactions } = useSortedTransactions(transactions)
const recentTransactions = computed(() => sortedTransactions.value.slice(0, 5))

const income = computed(() => sortedTransactions.value.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0))
const expense = computed(() =>
  Math.abs(sortedTransactions.value.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0))
)
const balance = computed(() => income.value - expense.value)

async function initAccountPage() {
  try {
    const [loadedAccounts, loadedTransactions] = await Promise.all([
      getAccountsByUser(authStore.user.id),
      getTransactionsByUser(authStore.user.id)
    ])
    accounts.value = loadedAccounts
    transactions.value = loadedTransactions
  } catch (error) {
    showError(error)
  }
}

onMounted(() => {
  initAccountPage()
})
</script>

<template>
  <BaseLayout>
    <main class="container mt-3">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <div>
          <h1 class="fw-bold mb-0">Личный кабинет</h1>
          <p class="text-muted mb-0">Статистика за <strong>Март 2026</strong></p>
        </div>
      </div>

      <div class="row g-3 mb-5">
        <div class="col-md-4">
          <div class="stat-card">
            <small class="fw-bold">ДОХОДЫ</small>
            <div id="incomeValue" class="fw-bold income-text mt-2">{{ formatMoney(income) }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card">
            <small class="fw-bold">РАСХОДЫ</small>
            <div id="expenseValue" class="fw-bold expense-text mt-2">{{ formatMoney(expense) }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card balance-card">
            <small class="fw-bold">БАЛАНС</small>
            <div id="balanceValue" class="fw-bold mt-2">{{ formatMoney(balance) }}</div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card card-dashboard shadow-sm border-0">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Мои счета</h2>
              <div class="accounts-list-container mb-3">
                <div v-if="!accounts.length" class="list-group-item px-0 py-3 text-muted">Счета пока не добавлены.</div>
                <div v-else class="list-group list-group-flush" aria-live="polite">
                  <div
                    v-for="account in accounts"
                    :key="account.id"
                    class="list-group-item d-flex justify-content-between align-items-center px-0 py-3"
                  >
                    <div><span class="fw-bold">{{ account.name }}</span></div>
                    <div class="text-end">
                      <div class="fw-bold" :class="account.balance >= 0 ? 'income-text' : 'expense-text'">
                        {{ formatSignedAmount(account.balance) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center mt-2">
                <RouterLink :to="{ name: 'add-bank-account' }" class="btn btn-outline-secondary btn-custom">
                  Добавить новый счёт
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card card-dashboard shadow-sm border-0">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-4">История операций</h2>
              <div class="table-responsive">
                <table class="table table-custom align-middle">
                  <caption class="visually-hidden">
                    Последние операции по счетам пользователя
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Дата</th>
                      <th scope="col">Категория</th>
                      <th scope="col">Счёт</th>
                      <th scope="col" class="text-end">Сумма</th>
                    </tr>
                  </thead>
                  <tbody id="recentTransactionsBody" aria-live="polite">
                    <tr v-if="!recentTransactions.length">
                      <td colspan="4" class="text-center text-muted">Операции пока отсутствуют.</td>
                    </tr>
                    <tr v-for="transaction in recentTransactions" v-else :key="transaction.id">
                      <td>{{ formatDate(transaction.date) }}</td>
                      <td>{{ transaction.category }}</td>
                      <td>
                        <span class="badge bg-light text-dark border">{{ accountsById[transaction.accountId] }}</span>
                      </td>
                      <td class="text-end fw-bold" :class="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                        {{ formatSignedAmount(transaction.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-center mt-2">
                <RouterLink :to="{ name: 'search' }" class="btn btn-outline-secondary btn-custom">Смотреть все транзакции</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
