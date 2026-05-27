<script setup>
import { ref, computed, onMounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import TransactionRow from '../components/TransactionRow.vue'
import { useTransactions } from '../composables/useTransactions'

const { transactions, loading, error, fetchTransactions } = useTransactions()
const query = ref('')
const category = ref('')

onMounted(fetchTransactions)

const filtered = computed(() =>
  transactions.value.filter(t => {
    const matchQ = !query.value || t.description.toLowerCase().includes(query.value.toLowerCase())
    const matchC = !category.value || t.category === category.value
    return matchQ && matchC
  })
)

function reset() {
  query.value = ''
  category.value = ''
}
</script>

<template>
  <AppNavbar />
  <main class="container my-4">
    <h1 class="h4 mb-4">Транзакции</h1>

    <div class="card mb-4">
      <div class="card-body">
        <form @submit.prevent aria-label="Фильтрация транзакций">
          <div class="row g-3">
            <div class="col-md-5">
              <label class="form-label" for="filter-query">Поиск</label>
              <input v-model="query" type="text" class="form-control" id="filter-query" placeholder="Введите описание">
            </div>
            <div class="col-md-4">
              <label class="form-label" for="filter-category">Категория</label>
              <select v-model="category" class="form-select" id="filter-category">
                <option value="">Все категории</option>
                <option value="income">Доход</option>
                <option value="food">Еда</option>
                <option value="housing">Жильё</option>
                <option value="transport">Транспорт</option>
                <option value="entertainment">Развлечения</option>
                <option value="services">Сервисы</option>
              </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button type="button" class="btn btn-outline-secondary" @click="reset">Сбросить</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="loading" class="text-muted">Загрузка...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else class="card">
      <div v-if="filtered.length === 0" class="card-body text-muted">Транзакции не найдены</div>
      <div v-else class="table-responsive">
        <table class="table mb-0" aria-label="Список транзакций">
          <thead>
            <tr>
              <th scope="col">Описание</th>
              <th scope="col">Категория</th>
              <th scope="col">Дата</th>
              <th scope="col" class="text-end">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <TransactionRow v-for="t in filtered" :key="t.id" :transaction="t" />
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
