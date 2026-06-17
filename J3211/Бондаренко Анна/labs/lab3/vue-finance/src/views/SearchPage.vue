<template>
  <BaseLayout>
    <div class="container">
      <section class="dashboard-block">
        <h2 class="block-title">&gt; ФИЛЬТРЫ</h2>
        <div class="row g-3">
          <div class="col-md-8">
            <div class="input-group mb-0">
              <label class="input-prefix" for="searchCategory">&gt; КАТЕГОРИЯ:</label>
              <select id="searchCategory" v-model="filters.category" class="terminal-input">
                <option value="">[ ВСЕ_КАТЕГОРИИ ]</option>
                <option value="РАЗНОЕ">РАЗНОЕ</option>
                <option v-for="cat in financeStore.categories" :key="cat.id" :value="cat.name || cat">{{
                    cat.name || cat
                  }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <button @click="resetFilters" class="terminal-btn mt-0" style="width: 100%;">[ СБРОСИТЬ_ФИЛЬТРЫ ]</button>
          </div>

          <div class="col-md-6">
            <div class="input-group mb-0">
              <label class="input-prefix" for="filterDateFrom">ДАТА_ОТ:</label>
              <input type="date" id="filterDateFrom" v-model="filters.dateFrom" :max="today" class="terminal-input">
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group mb-0">
              <label class="input-prefix" for="filterDateTo">ДАТА_ДО:</label>
              <input type="date" id="filterDateTo" v-model="filters.dateTo" :max="today" class="terminal-input">
            </div>
          </div>

          <div class="col-md-6">
            <div class="input-group mb-0">
              <label class="input-prefix" for="filterSumMin">СУММА_ОТ:</label>
              <input type="number" id="filterSumMin" v-model="filters.sumMin" class="terminal-input" placeholder="0.00">
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group mb-0">
              <label class="input-prefix" for="filterSumMax">СУММА_ДО:</label>
              <input type="number" id="filterSumMax" v-model="filters.sumMax" class="terminal-input"
                     placeholder="999999.00">
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-block">
        <h2 class="block-title">&gt; РЕЗУЛЬТАТЫ_ПОИСКА</h2>
        <table v-if="filteredTransactions.length > 0" class="terminal-table">
          <thead>
          <tr>
            <th>ДАТА</th>
            <th>СЧЁТ</th>
            <th>ОПИСАНИЕ</th>
            <th>КАТЕГОРИЯ</th>
            <th>СУММА</th>
          </tr>
          </thead>
          <tbody>
          <TransactionRow
              v-for="tx in filteredTransactions"
              :key="tx.id"
              :tx="tx"
          />
          </tbody>
        </table>
        <div v-else role="status">[ СОВПАДЕНИЙ_0 ]</div>
      </section>
    </div>
  </BaseLayout>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import BaseLayout from '../layouts/BaseLayout.vue'
import {useFinanceStore} from '../stores/finance'
import {useAuthStore} from '../stores/auth'
import TransactionRow from "@/components/TransactionRow.vue";

const financeStore = useFinanceStore()
const authStore = useAuthStore()

const today = new Date().toISOString().split('T')[0]

const filters = ref({
  category: '',
  dateFrom: '',
  dateTo: '',
  sumMin: null,
  sumMax: null
})

onMounted(() => financeStore.loadAllData(authStore.userId))

const filteredTransactions = computed(() => {
  return financeStore.transactions.filter(tx => {
    const matchCat = !filters.value.category || tx.category === filters.value.category
    const matchDateFrom = !filters.value.dateFrom || tx.date >= filters.value.dateFrom
    const matchDateTo = !filters.value.dateTo || tx.date <= filters.value.dateTo
    const matchSumMin = filters.value.sumMin === null || tx.sum >= filters.value.sumMin
    const matchSumMax = filters.value.sumMax === null || tx.sum <= filters.value.sumMax
    return matchCat && matchDateFrom && matchDateTo && matchSumMin && matchSumMax
  })
})

const resetFilters = () => {
  filters.value = {
    category: '',
    dateFrom: '',
    dateTo: '',
    sumMin: null,
    sumMax: null
  }
}
</script>