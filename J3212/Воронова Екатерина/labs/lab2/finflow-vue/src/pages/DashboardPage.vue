<script setup>
import { computed, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { useDashboard } from '../composables/useDashboard'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import StatCard from '../components/StatCard.vue'
import TransactionTable from '../components/TransactionTable.vue'
import AccountList from '../components/AccountList.vue'
import BudgetList from '../components/BudgetList.vue'

const { theme, toggleTheme } = useTheme()
const { currentUser } = useAuth()
const { accounts, budgets, transactions, loadDashboard } = useDashboard()

onMounted(() => {
  if (currentUser.value) {
    loadDashboard(currentUser.value.id)
  }
})

const totalBalance = computed(() =>
  accounts.value.reduce((sum, item) => sum + item.balance, 0)
)

const income = computed(() =>
  transactions.value
    .filter((item) => item.type === 'Доход')
    .reduce((sum, item) => sum + item.amount, 0)
)

const expense = computed(() =>
  transactions.value
    .filter((item) => item.type === 'Расход')
    .reduce((sum, item) => sum + item.amount, 0)
)
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      <AppTopbar
        :theme="theme"
        :user-name="currentUser && currentUser.name"
        @toggle-theme="toggleTheme"
      />

      <div class="content-section">
        <div class="page-header">
          <div>
            <h1>Личный кабинет</h1>
            <p>Общий обзор ваших счетов, бюджетов и последних операций</p>
          </div>
        </div>

        <div class="stats-grid">
          <StatCard title="Общий баланс" :value="`${totalBalance} ₽`" />
          <StatCard title="Доходы" :value="`${income} ₽`" :accent="true" />
          <StatCard title="Расходы" :value="`${expense} ₽`" />
        </div>

        <TransactionTable :items="transactions.slice(0, 5)" />
        <AccountList :items="accounts" />
        <BudgetList :items="budgets" />
      </div>
    </main>
  </div>
</template>