<template>
  <main class="container">
    <div class="card p-4 shadow-sm border-0">
      <h1 class="h4 mb-4 fw-bold">Поиск транзакций</h1>
      <form class="row g-3 mb-4" @submit.prevent>
        <div class="col-12 col-md-4">
          <label class="small fw-bold text-secondary mb-1">Категория</label>
          <input v-model="filters.cat" type="text" class="form-control" placeholder="Введите название...">
        </div>
        <div class="col-12 col-md-4">
          <label class="small fw-bold text-secondary mb-1">Сумма до</label>
          <input v-model.number="filters.sum" type="number" class="form-control" placeholder="Напр: 5000">
        </div>
        <div class="col-12 col-md-4">
          <label class="small fw-bold text-secondary mb-1">Дата операции</label>
          <input v-model="filters.date" type="date" class="form-control">
        </div>
      </form>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
          <tr>
            <th>Категория</th>
            <th>Сумма</th>
            <th>Дата</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in filteredTransactions" :key="t.id">
            <td class="fw-bold">{{ t.cat }}</td>
            <td class="fw-bold" :class="t.type === 'plus' ? 'text-success' : 'text-danger'">
              {{ t.type === 'plus' ? '+' : '-' }}{{ parseFloat(t.sum).toLocaleString() }} ₽
            </td>
            <td>{{ t.date }}</td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="3" class="text-center text-muted">Ничего не найдено</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useTransactions} from '../composables/useTransactions'

const {transactions, fetchTransactions} = useTransactions()

const filters = ref({cat: '', sum: null, date: ''})

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const matchCat = !filters.value.cat || t.cat.toLowerCase().includes(filters.value.cat.toLowerCase())
    const matchSum = !filters.value.sum || parseFloat(t.sum) <= filters.value.sum
    const matchDate = !filters.value.date || t.date === filters.value.date
    return matchCat && matchSum && matchDate
  })
})

onMounted(fetchTransactions)
</script>