<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const allTransactions = ref([])
const loading = ref(true)

const searchText = ref('')
const typeFilter = ref('all')
const categoryFilter = ref('all')
const minAmount = ref(null)
const maxAmount = ref(null)
const startDate = ref('')
const endDate = ref('')

const currentPage = ref(1)
const itemsPerPage = 5

const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions')
    allTransactions.value = response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error("Ошибка загрузки операций:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})

const filteredTransactions = computed(() => {
  return allTransactions.value.filter(tr => {
    const sText = searchText.value.toLowerCase()
    const matchName = tr.title.toLowerCase().includes(sText)
    const matchType = (typeFilter.value === 'all') || (tr.type === typeFilter.value)
    const matchCategory = (categoryFilter.value === 'all') || (tr.category === categoryFilter.value)

    const min = minAmount.value !== null && minAmount.value !== '' ? Number(minAmount.value) : 0
    const max = maxAmount.value !== null && maxAmount.value !== '' ? Number(maxAmount.value) : Infinity
    const matchAmount = tr.amount >= min && tr.amount <= max

    let matchDate = true
    if (startDate.value) matchDate = matchDate && (tr.date >= startDate.value)
    if (endDate.value) matchDate = matchDate && (tr.date <= endDate.value)

    return matchName && matchType && matchCategory && matchAmount && matchDate
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const setPage = (page) => {
  currentPage.value = page
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU")
}

const getCategoryIcon = (category) => {
  const icons = { food: "bi-cart", salary: "bi-briefcase", transport: "bi-car-front", entertainment: "bi-controller", other: "bi-wallet2" }
  return icons[category] || "bi-tag"
}
</script>

<template>
  <main class="container mt-4">
    <h1 class="mb-4 text-success fw-bold h2"><i class="bi bi-search me-2"></i> Поиск и фильтрация</h1>

    <section class="card shadow-sm mb-4 border-success" style="border-radius: 15px;">
      <div class="card-body">
        <form class="row g-3 align-items-end" @submit.prevent>
          <div class="col-md-4">
            <label class="form-label text-muted"><i class="bi bi-textarea-t me-1"></i> Название</label>
            <input type="text" class="form-control" placeholder="Например: Супермаркет" v-model="searchText" @input="currentPage = 1">
          </div>

          <div class="col-md-3">
            <label class="form-label text-muted"><i class="bi bi-arrow-left-right me-1"></i> Тип операции</label>
            <select class="form-select" v-model="typeFilter" @change="currentPage = 1">
              <option value="all">Все типы</option>
              <option value="expense">Только расходы</option>
              <option value="income">Только доходы</option>
            </select>
          </div>

          <div class="col-md-5">
            <label class="form-label text-muted"><i class="bi bi-tags me-1"></i> Категория</label>
            <select class="form-select" v-model="categoryFilter" @change="currentPage = 1">
              <option value="all">Все категории</option>
              <option value="food">Продукты</option>
              <option value="transport">Транспорт</option>
              <option value="salary">Зарплата</option>
              <option value="entertainment">Развлечения</option>
              <option value="other">Разное</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label text-muted"><i class="bi bi-cash-coin me-1"></i> Сумма (₽)</label>
            <div class="input-group">
              <input type="number" class="form-control" placeholder="От" v-model="minAmount" @input="currentPage = 1">
              <span class="input-group-text">-</span>
              <input type="number" class="form-control" placeholder="До" v-model="maxAmount" @input="currentPage = 1">
            </div>
          </div>

          <div class="col-md-5">
            <label class="form-label text-muted"><i class="bi bi-calendar3 me-1"></i> Период</label>
            <div class="input-group">
              <input type="date" class="form-control" v-model="startDate" @change="currentPage = 1">
              <span class="input-group-text">-</span>
              <input type="date" class="form-control" v-model="endDate" @change="currentPage = 1">
            </div>
          </div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm" style="border-radius: 15px;">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
          <tr>
            <th scope="col">Дата</th>
            <th scope="col">Название</th>
            <th scope="col">Категория</th>
            <th scope="col" class="text-end">Сумма</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="4" class="text-center text-muted py-4">Загрузка операций...</td>
          </tr>
          <tr v-else-if="paginatedTransactions.length === 0">
            <td colspan="4" class="text-center text-muted py-4">Транзакции не найдены</td>
          </tr>
          <tr v-else v-for="tr in paginatedTransactions" :key="tr.id">
            <td class="text-muted small">{{ formatDate(tr.date) }}</td>
            <td class="fw-bold">{{ tr.title }}</td>
            <td><span class="badge bg-light text-dark border"><i class="bi me-1" :class="getCategoryIcon(tr.category)"></i> {{ tr.categoryName }}</span></td>
            <td class="text-end fw-bold" :class="tr.type === 'expense' ? 'text-danger' : 'text-success'">
              {{ tr.type === 'expense' ? '- ' : '+ ' }}{{ tr.amount.toLocaleString('ru-RU') }} ₽
            </td>
          </tr>
          </tbody>
        </table>

        <nav v-if="totalPages > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </main>
</template>
