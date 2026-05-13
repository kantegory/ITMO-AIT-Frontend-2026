<template>
  <base-layout>
    <div class="text-start">
      <h2 class="mb-4 fw-bold">Транзакции</h2>
      
      <div class="widget-card border-gold p-4 mb-5">
        <h3 class="h5 mb-4">Добавить новую операцию</h3>
        <form @submit.prevent="addTransaction" class="row g-3">
            <div class="col-lg-5">
              <label class="small text-muted mb-2">Описание платежа</label>
              <input type="text" v-model="addForm.description" class="custom-input m-0" placeholder="На что потратили?" required>
            </div>
            <div class="col-lg-3">
              <label class="small text-muted mb-2">Сумма (₽)</label>
              <input type="number" v-model="addForm.amount" class="custom-input m-0" placeholder="0.00" required>
            </div>
            <div class="col-lg-3">
              <label class="small text-muted mb-2">Категория</label>
              <select v-model="addForm.category" class="custom-input m-0">
                <option>Продукты</option><option>Транспорт</option><option>Развлечения</option><option>Доходы</option><option>Другое</option>
              </select>
            </div>
            <div class="col-lg-1 d-flex align-items-end">
              <button type="submit" class="btn-custom w-100" style="height: 44px;">ОК</button>
            </div>
        </form>
      </div>

      <div class="widget-card p-4 mb-4">
        <div class="row g-4 align-items-end">
          <div class="col-md-5">
            <label class="small text-muted mb-2">Поиск по ключевым словам</label>
            <div class="input-group">
              <input type="text" v-model="filters.search" class="custom-input m-0" style="border-radius: 6px 0 0 6px !important;" placeholder="Найти операцию...">
              <span class="input-group-text border-secondary bg-transparent">
                <svg class="icon-svg"><use href="#icon-search"></use></svg>
              </span>
            </div>
          </div>
          <div class="col-md-3">
            <label class="small text-muted mb-2">Фильтр категорий</label>
            <select v-model="filters.category" class="custom-input m-0">
              <option value="all">Все категории</option>
              <option>Продукты</option><option>Транспорт</option><option>Доходы</option>
            </select>
          </div>
        </div>
      </div>

      <div id="transactions-list">
        <transaction-card v-for="item in filteredTransactions" :key="item.id" v-bind="item" />
        <p v-if="filteredTransactions.length === 0" class="text-center text-muted py-5">Ничего не найдено по вашему запросу</p>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import BaseLayout from '../layouts/BaseLayout.vue'
import TransactionCard from '../components/TransactionCard.vue'
import { ref, computed, onMounted } from 'vue'
import useTransactionsStore from '../stores/transactions'

const store = useTransactionsStore()
const filters = ref({ search: '', category: 'all' })
const addForm = ref({ description: '', amount: null, category: 'Продукты', date: '12.05', account: 'Карта' })

const filteredTransactions = computed(() => {
  return store.transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchesCategory = filters.value.category === 'all' || t.category === filters.value.category
    return matchesSearch && matchesCategory
  }).reverse()
})

const addTransaction = async () => {
  let finalAmount = Number(addForm.value.amount)
  if (addForm.value.category !== 'Доходы' && finalAmount > 0) finalAmount = -finalAmount
  
  await store.createTransaction({ ...addForm.value, amount: finalAmount })
  addForm.value.description = ''; addForm.value.amount = null
}

onMounted(() => store.loadTransactions())
</script>