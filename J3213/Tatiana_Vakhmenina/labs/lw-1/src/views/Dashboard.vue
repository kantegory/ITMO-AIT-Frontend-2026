<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-md-2 sidebar p-3 shadow bg-dark text-white min-vh-100">
        <h6 class="mb-0">Вахменина Т. М.</h6>
        <small class="text-muted">Группа J3213</small>
        <nav class="nav flex-column mt-4">
          <router-link to="/dashboard" class="nav-link text-white active fw-bold">Дашборд</router-link>
          <button @click="handleLogout" class="btn btn-link nav-link text-danger text-start mt-3 p-0 border-0">Выход</button>
        </nav>
      </aside>

      <main class="col-md-10 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Личный кабинет</h2>
          <button class="btn btn-outline-primary btn-sm" @click="fetchFinancialData">Синхронизировать</button>
        </div>

        <div class="card p-4 mb-4 shadow-sm" style="max-width: 300px;">
          <h3 class="h6 text-muted">Текущий баланс</h3>
          <p class="h2 my-0" v-if="!loading">{{ balance.toLocaleString() }} ₽</p>
          <p class="h2 my-0 text-muted" v-else>Загрузка баланса...</p>
        </div>

        <div class="card p-4 mb-4 shadow-sm">
          <h5 class="mb-3 fw-bold text-secondary">Новая финансовая операция</h5>
          <form class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label">Категория</label>
              <input v-model="form.category" type="text" class="form-control" placeholder="Например: Зарплата, Продукты" required />
            </div>
            <div class="col-md-3">
              <label class="form-label">Сумма операции (положительное число)</label>
              <input v-model.number="form.amount" type="number" min="1" class="form-control" placeholder="1000" required />
            </div>
            <div class="col-md-3">
              <label class="form-label">Дата</label>
              <input v-model="form.date" type="text" class="form-control" placeholder="03.06.2026" required />
            </div>
            <div class="col-md-3 d-flex gap-2">
              <button type="button" @click="submitTransaction('income')" class="btn btn-success flex-grow-1fw-bold">
                + Доход
              </button>
              <button type="button" @click="submitTransaction('expense')" class="btn btn-danger flex-grow-1 fw-bold">
                - Расход
              </button>
            </div>
          </form>
        </div>

        <div class="card p-3 mb-4 shadow-sm bg-light">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label small text-muted">Поиск по названию</label>
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Введите категорию..." />
            </div>
            <div class="col-md-4">
              <label class="form-label small text-muted">Фильтрация типа</label>
              <select v-model="filterType" class="form-select">
                <option value="all">Все типы операций</option>
                <option value="expense">Только расходы</option>
                <option value="income">Только доходы</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small text-muted">Сортировка списка</label>
              <select v-model="sortBy" class="form-select">
                <option value="date">По дате (последние сверху)</option>
                <option value="amountAsc">Сумма: по возрастанию</option>
                <option value="amountDesc">Сумма: по убыванию</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card shadow-sm p-3">
          <h5 class="mb-3">История транзакций</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Категория</th>
                  <th>Статус проведения</th>
                  <th class="text-end">Сумма</th>
                  <th class="text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in processedTransactions" :key="tx.id">
                  <td>{{ tx.date }}</td>
                  <td>{{ tx.category }}</td>
                  <td>
                    <span :class="['badge', tx.status === 'success' ? 'bg-success' : 'bg-warning text-dark']">
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="text-end fw-bold" :style="{ color: tx.amount < 0 ? '#e63946' : '#2a9d8f' }">
                    {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount.toLocaleString() }} ₽
                  </td>
                  <td class="text-center">
                    <button @click="toggleStatus(tx)" class="btn btn-sm btn-outline-secondary me-2">
                      Изменить статус
                    </button>
                    <button @click="deleteTransaction(tx.id)" class="btn btn-sm btn-outline-danger">
                      Удалить
                    </button>
                  </td>
                </tr>
                <tr v-if="processedTransactions.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">Операций по выбранным фильтрам не найдено</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinance } from '../composables/useFinance'

const router = useRouter()
const { 
  transactions, balance, loading, fetchFinancialData, 
  addTransaction, patchTransaction, deleteTransaction, logout 
} = useFinance()

const form = ref({
  category: '',
  amount: null,
  date: new Date().toLocaleDateString('ru-RU')
})

const searchQuery = ref('')
const filterType = ref('all')
const sortBy = ref('date')

onMounted(fetchFinancialData)

const handleLogout = () => {
  logout()
  router.push('/')
}

// Универсальный обработчик создания, принимающий тип ('income' или 'expense')
const submitTransaction = async (type) => {
  if (!form.value.category || !form.value.amount) {
    alert('Заполните категорию и сумму!')
    return
  }

  // Если расход — автоматически трансформируем число в отрицательное
  const finalAmount = type === 'expense' ? -Math.abs(form.value.amount) : Math.abs(form.value.amount)

  await addTransaction({
    category: form.value.category,
    amount: finalAmount,
    date: form.value.date,
    status: 'pending'
  })

  // Очистка формы
  form.value.category = ''
  form.value.amount = null
  form.value.date = new Date().toLocaleDateString('ru-RU')
}

const toggleStatus = async (tx) => {
  const nextStatus = tx.status === 'success' ? 'pending' : 'success'
  await patchTransaction(tx.id, { status: nextStatus })
}

const processedTransactions = computed(() => {
  let result = [...transactions.value]

  if (searchQuery.value) {
    result = result.filter(tx => 
      tx.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterType.value === 'expense') {
    result = result.filter(tx => tx.amount < 0)
  } else if (filterType.value === 'income') {
    result = result.filter(tx => tx.amount >= 0)
  }

  if (sortBy.value === 'amountAsc') {
    result.sort((a, b) => a.amount - b.amount)
  } else if (sortBy.value === 'amountDesc') {
    result.sort((a, b) => b.amount - a.amount)
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('.').map(Number)
      const [dayB, monthB, yearB] = b.date.split('.').map(Number)
      return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA)
    })
  }

  return result
})
</script>

<style scoped>
.sidebar { min-height: 100vh; }
</style>