<script setup>
import { onMounted, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { useTransactions } from '../composables/useTransactions'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import StatCard from '../components/StatCard.vue'

const { theme, toggleTheme } = useTheme()
const { currentUser } = useAuth()
const { transactions, loadTransactions } = useTransactions()

onMounted(() => {
  if (currentUser.value) {
    loadTransactions(currentUser.value.id)
  }
})

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

const avg = computed(() => Math.round(expense.value / 4))
const balance = computed(() => income.value - expense.value)
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
            <h1>Отчёты</h1>
            <p>Анализ доходов и расходов пользователя</p>
          </div>
        </div>

        <div class="stats-grid">
          <StatCard title="Доходы" :value="`${income} ₽`" :accent="true" />
          <StatCard title="Расходы" :value="`${expense} ₽`" />
          <StatCard title="Средний расход в неделю" :value="`${avg} ₽`" />
          <StatCard title="Остаток бюджета" :value="`${balance} ₽`" :accent="true" />
        </div>
      </div>
    </main>
  </div>
</template>