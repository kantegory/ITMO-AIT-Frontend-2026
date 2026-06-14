<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import TransactionTable from '../components/TransactionTable.vue'
import { useAuth } from '../composables/useAuth'
import { useTransactions } from '../composables/useTransactions'
import { formatMoney, formatDate } from '../utils/format'

const { currentUser } = useAuth()
const { categories, transactions, loadAll, filterTransactions } = useTransactions()

const filters = reactive({
  query: '',
  category: '',
  type: '',
  minAmount: '',
  maxAmount: '',
  dateFrom: '',
  dateTo: '',
})

const selectedTransaction = ref(null)

onMounted(loadAll)

const filteredRows = computed(() => filterTransactions(filters))

const resetFilters = () => {
  filters.query = ''
  filters.category = ''
  filters.type = ''
  filters.minAmount = ''
  filters.maxAmount = ''
  filters.dateFrom = ''
  filters.dateTo = ''
}

const selectTransaction = (row) => {
  selectedTransaction.value = row
}
</script>

<template>
  <section class="container">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
      <div>
        <div class="badge-soft mb-2">
          <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-filter"></use></svg>
          Поиск и фильтрация
        </div>
        <h1 class="section-title mb-2">Транзакции</h1>
        <p class="muted mb-0">Найдено операций: {{ filteredRows.length }} из {{ transactions.length }}</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <aside class="filter-panel">
          <h2 class="h4 mb-3">Фильтры</h2>
          <form @submit.prevent>
            <div class="mb-3">
              <label class="form-label" for="search-query">Поиск</label>
              <input id="search-query" v-model="filters.query" class="form-control" type="search" placeholder="Описание или счёт">
            </div>

            <div class="mb-3">
              <label class="form-label" for="filter-category">Категория</label>
              <select id="filter-category" v-model="filters.category" class="form-select">
                <option value="">Все категории</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label" for="filter-type">Тип операции</label>
              <select id="filter-type" v-model="filters.type" class="form-select">
                <option value="">Все</option>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <label class="form-label" for="amount-min">Сумма от</label>
                <input id="amount-min" v-model="filters.minAmount" class="form-control" type="number" min="0" step="0.01">
              </div>
              <div class="col-sm-6">
                <label class="form-label" for="amount-max">Сумма до</label>
                <input id="amount-max" v-model="filters.maxAmount" class="form-control" type="number" min="0" step="0.01">
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-sm-6">
                <label class="form-label" for="date-from">Дата с</label>
                <input id="date-from" v-model="filters.dateFrom" class="form-control" type="date">
              </div>
              <div class="col-sm-6">
                <label class="form-label" for="date-to">Дата по</label>
                <input id="date-to" v-model="filters.dateTo" class="form-control" type="date">
              </div>
            </div>

            <button class="btn btn-outline-secondary" type="button" @click="resetFilters">Сбросить</button>
          </form>
        </aside>
      </div>

      <div class="col-lg-8">
        <section class="table-panel">
          <h2 class="h4 mb-3">Список операций</h2>
          <TransactionTable
            :rows="filteredRows"
            :currency="currentUser?.currency || 'RUB'"
            :format-money="formatMoney"
            :format-date="formatDate"
            @select="selectTransaction"
          />
        </section>

        <section v-if="selectedTransaction" class="chart-card mt-4">
          <h2 class="h4 mb-3">Выбранная операция</h2>
          <div class="row g-3">
            <div class="col-md-6"><strong>Дата:</strong> {{ formatDate(selectedTransaction.date) }}</div>
            <div class="col-md-6"><strong>Категория:</strong> {{ selectedTransaction.category }}</div>
            <div class="col-md-6"><strong>Счёт:</strong> {{ selectedTransaction.account }}</div>
            <div class="col-md-6"><strong>Тип:</strong> {{ selectedTransaction.type === 'income' ? 'Доход' : 'Расход' }}</div>
            <div class="col-12"><strong>Описание:</strong> {{ selectedTransaction.description }}</div>
            <div class="col-12"><strong>Сумма:</strong> {{ formatMoney(selectedTransaction.amount, currentUser?.currency || 'RUB') }}</div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
