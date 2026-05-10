<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const transactions = ref([])
const loading = ref(true)

const loadRecentTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions')
    const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
    transactions.value = sorted.slice(0, 3)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' })
}

const getCategoryIcon = (category) => {
  const icons = { food: "bi-cart", salary: "bi-briefcase", transport: "bi-car-front", entertainment: "bi-controller", other: "bi-wallet2" }
  return icons[category] || "bi-tag"
}

onMounted(() => {
  loadRecentTransactions()
})
</script>

<template>
  <div class="card shadow-sm" style="border-radius: 15px;">
    <div class="card-body">
      <header class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="card-title h5 m-0">Последние транзакции</h3>
        <RouterLink to="/search" class="text-success text-decoration-none small">Смотреть все <i class="bi bi-arrow-right"></i></RouterLink>
      </header>
      <table class="table table-hover align-middle">
        <tbody>
        <tr v-if="loading">
          <td colspan="4" class="text-center text-muted">Загрузка операций...</td>
        </tr>
        <tr v-else-if="transactions.length === 0">
          <td colspan="4" class="text-center text-muted">Нет операций</td>
        </tr>
        <tr v-else v-for="tr in transactions" :key="tr.id">
          <td class="text-muted small">{{ formatDate(tr.date) }}</td>
          <td><div class="fw-bold">{{ tr.title }}</div></td>
          <td><span class="badge bg-light text-dark border"><i class="bi me-1" :class="getCategoryIcon(tr.category)"></i> {{ tr.categoryName }}</span></td>
          <td class="text-end fw-bold" :class="tr.type === 'expense' ? 'text-danger' : 'text-success'">
            {{ tr.type === 'expense' ? '- ' : '+ ' }}{{ tr.amount.toLocaleString('ru-RU') }} ₽
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
