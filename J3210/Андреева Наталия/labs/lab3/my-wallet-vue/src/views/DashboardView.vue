<template>
  <main class="container">
    <div class="row g-3 mb-5">
      <StatCard title="Мои счета">
        <p id="accBalance" class="fw-bold h2 mb-0" :class="{'text-danger': balance < 0}">
          {{ (balance < 0 ? '- ' : '') + Math.abs(balance).toLocaleString() }} ₽
        </p>
      </StatCard>

      <StatCard title="Бюджет на месяц">
        <div class="progress" style="height: 14px; border-radius: 10px;">
          <div class="progress-bar bg-success" :style="{ width: budgetPercent + '%' }"></div>
        </div>
        <p class="text-muted mt-2 mb-0">{{ expenses.toLocaleString() }} из 50 000 ₽</p>
      </StatCard>

      <div class="col-12 col-md-4">
        <button class="btn btn-primary w-100 py-3 fw-bold mb-2 shadow border-0" data-bs-toggle="modal"
                data-bs-target="#addMoneyModal">
          + Добавить транзакцию
        </button>
      </div>
    </div>

    <CurrencyRates/>

    <section class="card p-4 mb-5 shadow-sm border-0">
      <h2 class="mb-3 fw-bold h5">Последние транзакции</h2>
      <ul class="list-group list-group-flush">
        <li v-for="t in recentTransactions" :key="t.id"
            class="list-group-item d-flex justify-content-between px-0 border-0">
          <span>{{ t.cat }}</span>
          <span class="fw-bold" :class="t.type === 'plus' ? 'text-success' : 'text-danger'">
            {{ t.type === 'plus' ? '+' : '-' }}{{ parseFloat(t.sum).toLocaleString() }} ₽
          </span>
        </li>
      </ul>
    </section>

    <TransactionModal @save="addTransaction"/>
  </main>
</template>

<script setup>
import {computed, onMounted} from 'vue'
import {useTransactions} from '../composables/useTransactions'

import StatCard from '../components/StatCard.vue'
import CurrencyRates from '../components/CurrencyRates.vue'
import TransactionModal from '../components/TransactionModal.vue'

const {transactions, fetchTransactions, addTransaction, balance, expenses} = useTransactions()

const budgetPercent = computed(() => Math.min((expenses.value / 50000) * 100, 100))
const recentTransactions = computed(() => [...transactions.value].slice(-5).reverse())

onMounted(() => {
  fetchTransactions()
})
</script>