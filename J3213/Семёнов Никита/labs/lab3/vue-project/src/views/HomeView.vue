<template>
  <BaseLayout>
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <section class="row mb-4" aria-labelledby="balance-heading">
      <div class="col-lg-4 mb-3"><div class="card shadow-sm text-bg-primary h-100" style="background-color: var(--app-nav-bg) !important;"><div class="card-body">
        <h1 id="balance-heading" class="card-subtitle mb-2 opacity-75 fs-6 text-white">Общий баланс</h1><div class="card-title fw-bold fs-2 text-white">{{ balance.toLocaleString('ru-RU') }} ₽</div>
      </div></div></div>
      <div class="col-lg-8 mb-3"><div class="card shadow-sm h-100"><div class="card-header fw-bold">Быстрые действия</div><div class="card-body d-flex align-items-center gap-3">
        <button class="btn btn-success d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addTransactionModal" aria-haspopup="dialog"><svg class="icon"><use href="/img/sprite.svg#icon-plus"></use></svg>Добавить транзакцию</button>
      </div></div></div>
    </section>
    <section class="card shadow-sm mb-5" aria-labelledby="tx-heading"><div class="card-header d-flex justify-content-between align-items-center"><h2 id="tx-heading" class="fw-bold fs-6 mb-0">Последние транзакции</h2><router-link to="/transactions" class="btn btn-sm btn-outline-primary">Все транзакции</router-link></div><div class="card-body p-0"><div class="table-responsive">
      <table class="table table-hover mb-0"><caption class="visually-hidden">Таблица последних транзакций пользователя</caption><thead><tr><th>Дата</th><th>Название</th><th>Категория</th><th class="text-end">Сумма</th></tr></thead><tbody>
        <tr v-if="transactions.length === 0"><td colspan="4" class="text-center text-muted p-3">Операций пока нет</td></tr><TransactionRow v-for="transaction in transactions.slice(0, 4)" :key="transaction.id" :transaction="transaction" />
      </tbody></table>
    </div></div></section>
    <TransactionModal @add="addTransaction" />
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import TransactionRow from '@/components/TransactionRow.vue'
import TransactionModal from '@/components/TransactionModal.vue'
import { transactionsApi } from '@/api'
import { useAuth } from '@/composables/useAuth'

const transactions = ref([])
const balance = ref(0)
const error = ref('')
const { user } = useAuth()

const loadData = async () => {
  try {
    const { data } = await transactionsApi.getByUser(user.value.id)
    transactions.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    balance.value = (user.value.baseBalance || 0) + transactions.value.reduce((sum, item) => sum + item.amount, 0)
  } catch {
    error.value = 'Ошибка подключения к API серверу.'
  }
}

const addTransaction = async (transaction) => {
  try {
    await transactionsApi.create({ ...transaction, userId: user.value.id })
    await loadData()
  } catch {
    error.value = 'Ошибка отправки данных.'
  }
}

onMounted(loadData)
</script>
