<template>
  <BaseLayout>
    <section class="card shadow-sm mb-4" aria-labelledby="filter-heading"><div class="card-header fw-bold"><h1 id="filter-heading" class="fs-6 mb-0">Фильтрация операций</h1></div><div class="card-body">
      <form class="row g-3" @submit.prevent><div class="col-md-4"><label for="filter-search" class="form-label">Поиск по названию</label><input id="filter-search" v-model="filters.search" type="text" class="form-control" placeholder="Например: Аптека"></div>
      <div class="col-md-4"><label for="filter-category" class="form-label">Категория</label><select id="filter-category" v-model="filters.category" class="form-select"><option value="">Все категории</option><option v-for="category in categories" :key="category" :value="category">{{ category }}</option></select></div>
      <div class="col-md-2"><label for="filter-min" class="form-label">Мин. сумма</label><input id="filter-min" v-model="filters.min" type="number" class="form-control" placeholder="0" min="0"></div><div class="col-md-2"><label for="filter-max" class="form-label">Макс. сумма</label><input id="filter-max" v-model="filters.max" type="number" class="form-control" placeholder="100000" min="0"></div>
      <div class="col-12 d-flex gap-2 justify-content-end"><button type="button" class="btn btn-outline-secondary" @click="resetFilters">Сбросить</button><button type="submit" class="btn btn-primary">Применить фильтр</button></div></form>
    </div></section>
    <section class="card shadow-sm mb-5" aria-labelledby="history-heading"><div class="card-header fw-bold"><h2 id="history-heading" class="fs-6 mb-0">Список транзакций</h2></div><div class="card-body p-0"><div class="table-responsive" tabindex="0" aria-label="Прокручиваемая таблица транзакций"><table class="table table-hover mb-0"><caption class="visually-hidden">Полная история доходов и расходов</caption><thead><tr><th>Дата</th><th>Название</th><th>Категория</th><th class="text-end">Сумма</th></tr></thead><tbody>
      <tr v-if="filteredTransactions.length === 0"><td colspan="4" class="text-center text-muted p-3">Операций не найдено</td></tr><TransactionRow v-for="transaction in filteredTransactions" :key="transaction.id" :transaction="transaction" />
    </tbody></table></div></div></section>
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import TransactionRow from '@/components/TransactionRow.vue'
import { transactionsApi } from '@/api'
import { useAuth } from '@/composables/useAuth'

const categories = ['Продукты', 'Развлечения', 'Транспорт', 'Покупки', 'Зарплата']
const transactions = ref([])
const filters = reactive({ search: '', category: '', min: '', max: '' })
const { user } = useAuth()

onMounted(async () => {
  const { data } = await transactionsApi.getByUser(user.value.id)
  transactions.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredTransactions = computed(() => transactions.value.filter((transaction) => {
  const nameMatch = !filters.search || transaction.name.toLowerCase().includes(filters.search.toLowerCase())
  const categoryMatch = !filters.category || transaction.category === filters.category
  const amount = Math.abs(transaction.amount)
  const minMatch = !filters.min || amount >= Number(filters.min)
  const maxMatch = !filters.max || amount <= Number(filters.max)
  return nameMatch && categoryMatch && minMatch && maxMatch
}))

const resetFilters = () => Object.assign(filters, { search: '', category: '', min: '', max: '' })
</script>
