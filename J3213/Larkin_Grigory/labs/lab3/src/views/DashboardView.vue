<script setup>
import { computed, onMounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import StatCard from '../components/StatCard.vue'
import TransactionRow from '../components/TransactionRow.vue'
import { useTransactions } from '../composables/useTransactions'
import { useAccounts } from '../composables/useAccounts'

const { transactions, loading, error, fetchTransactions } = useTransactions()
const { accounts, fetchAccounts } = useAccounts()

onMounted(() => {
  fetchTransactions()
  fetchAccounts()
})

const totalBalance = computed(() =>
  accounts.value.reduce((s, a) => s + a.balance, 0)
)
const income = computed(() =>
  transactions.value.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
)
const expenses = computed(() =>
  transactions.value.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)
)
const saved = computed(() => income.value + expenses.value)
const recent = computed(() => transactions.value.slice(0, 5))

function fmt(n) { return n.toLocaleString('ru-RU') + ' ₽' }
</script>

<template>
  <AppNavbar />
  <main class="container my-4">
    <h1 class="h4 mb-4">Личный кабинет</h1>

    <div v-if="loading" class="text-muted">Загрузка...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <template v-else>
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-lg-3"><StatCard label="Общий баланс" :value="fmt(totalBalance)" /></div>
        <div class="col-sm-6 col-lg-3"><StatCard label="Доходы за период" :value="'+' + fmt(income)" value-class="amount-plus" /></div>
        <div class="col-sm-6 col-lg-3"><StatCard label="Расходы за период" :value="'−' + fmt(Math.abs(expenses))" value-class="amount-minus" /></div>
        <div class="col-sm-6 col-lg-3"><StatCard label="Накоплено" :value="fmt(saved)" /></div>
      </div>

      <h2 class="h6 mb-3">Последние транзакции</h2>
      <div class="card">
        <div class="table-responsive">
          <table class="table mb-0" aria-label="Последние транзакции">
            <thead>
              <tr>
                <th>Описание</th><th>Категория</th><th>Дата</th><th class="text-end">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <TransactionRow v-for="t in recent" :key="t.id" :transaction="t" />
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </main>
</template>
