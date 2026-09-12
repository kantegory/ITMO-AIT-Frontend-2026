<template>
  <NavBar />
  <main class="container">
    <section class="row mb-4">
      <div class="col-lg-4 mb-3">
        <div class="card shadow-sm text-bg-primary h-100" style="background-color: var(--app-nav-bg) !important;">
          <div class="card-body">
            <h1 class="card-subtitle mb-2 opacity-75 fs-6 text-white">Общий баланс</h1>
            <div class="card-title fw-bold fs-2 text-white">{{ balance.toLocaleString('ru-RU') }} ₽</div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 mb-3">
        <div class="card shadow-sm h-100">
          <div class="card-header fw-bold">Быстрые действия</div>
          <div class="card-body d-flex align-items-center gap-3">
            <button class="btn btn-success d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
              <svg class="icon"><use href="/img/sprite.svg#icon-plus"></use></svg> Добавить транзакцию
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="card shadow-sm mb-5">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="fw-bold fs-6 mb-0">Последние транзакции</h2>
        <router-link to="/transactions" class="btn btn-sm btn-outline-primary">Все транзакции</router-link>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr><th>Дата</th><th>Название</th><th>Категория</th><th class="text-end">Сумма</th></tr>
            </thead>
            <tbody>
              <tr v-if="transactions.length === 0"><td colspan="4" class="text-center text-muted p-3">Операций пока нет</td></tr>
              <tr v-for="tx in transactions.slice(0, 4)" :key="tx.id">
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

  <!-- Модальное окно Bootstrap (HTML остается прежним, меняем только форму на @submit) -->
  <div class="modal fade" id="addTransactionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5">Добавить транзакцию</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" id="closeModalBtn"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addTransaction">
            <!-- Поля формы привязываем через v-model к объекту newTx -->
            <div class="mb-3">
              <label class="form-label">Тип операции</label>
              <select class="form-select" v-model="newTx.type" required>
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Дата</label>
              <input type="date" class="form-control" v-model="newTx.date" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Название</label>
              <input type="text" class="form-control" v-model="newTx.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Категория</label>
              <select class="form-select" v-model="newTx.category" required>
                <option value="Продукты">Продукты</option>
                <option value="Развлечения">Развлечения</option>
                <option value="Транспорт">Транспорт</option>
                <option value="Покупки">Покупки</option>
                <option value="Зарплата">Зарплата</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Сумма (₽)</label>
              <input type="number" class="form-control" v-model="newTx.amount" min="1" required>
            </div>
            <button type="submit" class="btn btn-success w-100">Сохранить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const transactions = ref([])
const balance = ref(0)
const user = JSON.parse(localStorage.getItem('app_session'))

const newTx = reactive({
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
  name: '',
  category: 'Продукты',
  amount: ''
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  const res = await fetch(`http://localhost:3000/transactions?userId=${user.id}`)
  const data = await res.json()
  transactions.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  const totalSum = transactions.value.reduce((sum, item) => sum + item.amount, 0)
  balance.value = (user.baseBalance || 0) + totalSum
}

const addTransaction = async () => {
  const amount = newTx.type === 'expense' ? -Math.abs(newTx.amount) : Math.abs(newTx.amount)
  
  await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      date: newTx.date,
      name: newTx.name,
      category: newTx.category,
      amount: amount
    })
  })
  
  document.getElementById('closeModalBtn').click() // Закрываем модалку Bootstrap
  fetchData() // Обновляем данные на экране
  
  newTx.name = ''
  newTx.amount = ''
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const p = dateStr.split('-')
  return `${p[2]}.${p[1]}.${p[0]}`
}
</script>