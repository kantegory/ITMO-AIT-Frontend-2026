<template>
  <NavBar />
  <main class="container">
    <!-- Секция фильтров -->
    <section class="card shadow-sm mb-4">
      <div class="card-header fw-bold">Фильтрация операций</div>
      <div class="card-body">
        <form @submit.prevent class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Поиск по названию</label>
            <input type="text" class="form-control" v-model="filters.search" placeholder="Например: Аптека">
          </div>
          <div class="col-md-4">
            <label class="form-label">Категория</label>
            <select class="form-select" v-model="filters.category">
              <option value="">Все категории</option>
              <option value="Продукты">Продукты</option>
              <option value="Развлечения">Развлечения</option>
              <option value="Транспорт">Транспорт</option>
              <option value="Покупки">Покупки</option>
              <option value="Зарплата">Зарплата</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Мин. сумма</label>
            <input type="number" class="form-control" v-model="filters.min" placeholder="0" min="0">
          </div>
          <div class="col-md-2">
            <label class="form-label">Макс. сумма</label>
            <input type="number" class="form-control" v-model="filters.max" placeholder="100000" min="0">
          </div>
          <div class="col-12 d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-outline-secondary" @click="resetFilters">Сбросить</button>
          </div>
        </form>
      </div>
    </section>

    <!-- Таблица транзакций -->
    <section class="card shadow-sm mb-5">
      <div class="card-header fw-bold">Список транзакций</div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Категория</th>
                <th class="text-end">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="4" class="text-center text-muted p-3">Операций не найдено</td>
              </tr>
              <tr v-for="tx in filteredTransactions" :key="tx.id">
                <td>{{ formatDate(tx.date) }}</td>
                <td>{{ tx.name }}</td>
                <td><span class="badge bg-secondary">{{ tx.category }}</span></td>
                <td class="text-end fw-bold" :class="tx.amount < 0 ? 'text-expense' : 'text-income'">
                  {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount.toLocaleString('ru-RU') }} ₽
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const transactions = ref([])
const user = JSON.parse(localStorage.getItem('app_session'))

const filters = reactive({
  search: '',
  category: '',
  min: '',
  max: ''
})

onMounted(async () => {
  if (user) {
    const res = await fetch(`http://localhost:3000/transactions?userId=${user.id}`)
    const data = await res.json()
    transactions.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
})

// Реактивная фильтрация на лету
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const nameMatch = !filters.search || t.name.toLowerCase().includes(filters.search.toLowerCase())
    const catMatch = !filters.category || t.category === filters.category
    const absSum = Math.abs(t.amount)
    const minMatch = !filters.min || absSum >= parseFloat(filters.min)
    const maxMatch = !filters.max || absSum <= parseFloat(filters.max)
    return nameMatch && catMatch && minMatch && maxMatch
  })
})

const resetFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.min = ''
  filters.max = ''
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const p = dateStr.split('-')
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : dateStr
}
</script>