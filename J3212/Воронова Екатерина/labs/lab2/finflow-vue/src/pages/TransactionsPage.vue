<script setup>
import { onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { useTransactions } from '../composables/useTransactions'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import TransactionTable from '../components/TransactionTable.vue'
import StatCard from '../components/StatCard.vue'

const { theme, toggleTheme } = useTheme()
const { currentUser } = useAuth()
const { search, category, filteredTransactions, loadTransactions, incomeSum, expenseSum } =
  useTransactions()

onMounted(() => {
  if (currentUser.value) {
    loadTransactions(currentUser.value.id)
  }
})
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
            <h1>Транзакции</h1>
            <p>Просматривайте, ищите и фильтруйте все операции</p>
          </div>
        </div>

        <div class="dashboard-card filter-box">
          <input v-model="search" class="custom-input" placeholder="Поиск по описанию или категории" />
          <input v-model="category" class="custom-input" placeholder="Категория" />
        </div>

        <div class="stats-grid">
          <StatCard title="Доходы" :value="`${incomeSum} ₽`" :accent="true" />
          <StatCard title="Расходы" :value="`${expenseSum} ₽`" />
          <StatCard title="Найдено" :value="`${filteredTransactions.length}`" />
        </div>

        <TransactionTable :items="filteredTransactions" />
      </div>
    </main>
  </div>
</template>