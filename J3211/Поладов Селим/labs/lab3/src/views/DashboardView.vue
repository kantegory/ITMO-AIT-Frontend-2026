<template>
  <AppLayout title="Личный кабинет">
    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <MetricCard label="Общий баланс" :value="formatMoney(totalBalance)" dark />
      </div>
      <div class="col-md-4">
        <MetricCard label="Расходы за месяц" :value="formatMoney(monthlyExpenses)" />
      </div>
      <div class="col-md-4">
        <MetricCard label="Накоплено" :value="formatMoney(savings)" />
      </div>
    </div>

    <RatesBar />

    <div class="row">
      <div class="col-lg-8">
        <div class="content-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Последние транзакции</h3>
            <router-link to="/transactions" class="btn btn-sm btn-link text-decoration-none p-0">Все →</router-link>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Сумма</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingRecent"><td colspan="4" class="text-center text-muted py-3">Загрузка...</td></tr>
                <tr v-else-if="!recent.length"><td colspan="4" class="text-center text-muted py-3">Нет транзакций</td></tr>
                <TransactionRow v-for="t in recent" :key="t.id" :transaction="t" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="content-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Счета</h3>
          </div>
          <AccountsList :accounts="accounts" :loading="loadingAccounts" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import MetricCard from '../components/MetricCard.vue'
import RatesBar from '../components/RatesBar.vue'
import AccountsList from '../components/AccountsList.vue'
import TransactionRow from '../components/TransactionRow.vue'
import { useAuth } from '../composables/useAuth.js'
import { useFormatters } from '../composables/useFormatters.js'
import { accountsApi, transactionsApi } from '../api/resources.js'

const { user } = useAuth()
const { formatMoney } = useFormatters()

const accounts = ref([])
const loadingAccounts = ref(true)
const recent = ref([])
const loadingRecent = ref(true)
const totalBalance = ref(0)
const monthlyExpenses = ref(0)
const savings = ref(0)

function monthRangeIso() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

async function loadAccounts() {
  const list = await accountsApi.list({ userId: user.value.id })
  accounts.value = list
  totalBalance.value = list.reduce((sum, a) => sum + a.balance, 0)
  const sav = list.find(a => a.name === 'Накопительный')
  savings.value = sav ? sav.balance : 0
  loadingAccounts.value = false
}

async function loadMonthlyExpenses() {
  const { start, end } = monthRangeIso()
  const expenses = await transactionsApi.list({
    userId: user.value.id,
    date_gte: start,
    date_lte: end,
    amount_lte: -1
  })
  monthlyExpenses.value = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

async function loadRecent() {
  recent.value = await transactionsApi.list({
    userId: user.value.id,
    _sort: 'date',
    _order: 'desc',
    _limit: 5
  })
  loadingRecent.value = false
}

onMounted(() => {
  loadAccounts()
  loadMonthlyExpenses()
  loadRecent()
})
</script>
