<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <TheSidebar />

      <main class="col-12 col-md-9 col-lg-10 p-4 p-lg-5">
        <TheHeader :title="`Добро пожаловать, ${currentUser?.name}!`" />

        <!-- БАЛАНС + РАСХОДЫ И ДОХОДЫ -->
        <SummaryCards :income="totalIncome" :expenses="totalExpenses" />

        <!-- КУРСЫ ВАЛЮТ (8) + КАРТА (4) -->
        <div class="row g-4 mb-4">
          <div class="col-12 col-lg-8">
            <CurrencyWidget />
          </div>
          <div class="col-12 col-lg-4">
            <BankCardWidget 
              :balance="totalIncome - totalExpenses" 
              :user-name="currentUser?.name" 
            />
          </div>
        </div>

        <!-- КЭШБЕК (4) + ОПЕРАЦИИ (4) + ЦЕЛИ (4) -->
        <div class="row g-4 mb-4">
          <div class="col-12 col-lg-4">
            <CashbackWidget />
          </div>
          <div class="col-12 col-lg-4">
            <RecentTransactionsWidget 
              :transactions="transactions" 
              @open-add-modal="showModal = true"
              @delete-tx="deleteTx"
            />
          </div>
          <div class="col-12 col-lg-4">
            <GoalsWidget />
          </div>
        </div>
      </main>
    </div>

    <!-- Модальное окно добавления -->
    <AddTransactionModal 
      :is-open="showModal" 
      @close="showModal = false" 
      @submit="createTx" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TheSidebar from '../components/layout/TheSidebar.vue'
import TheHeader from '../components/layout/TheHeader.vue'
import SummaryCards from '../components/dashboard/SummaryCards.vue'
import CurrencyWidget from '../components/dashboard/CurrencyWidget.vue'
import BankCardWidget from '../components/dashboard/BankCardWidget.vue'
import CashbackWidget from '../components/dashboard/CashbackWidget.vue'
import RecentTransactionsWidget from '../components/dashboard/RecentTransactionsWidget.vue'
import GoalsWidget from '../components/dashboard/GoalsWidget.vue'
import AddTransactionModal from '../components/dashboard/AddTransactionModal.vue'
import { useAuth } from '@/composables/useAuth'
import { useTransactions } from '@/composables/useTransactions'

const { currentUser } = useAuth()
const { 
  transactions, 
  fetchTransactions, 
  addTransaction, 
  removeTransaction, 
  totalExpenses, 
  totalIncome 
} = useTransactions()

const showModal = ref(false)

const createTx = async (formData) => {
  try {
    await addTransaction({
      userId: currentUser.value?.id || '1',
      title: formData.title,
      amount: formData.amount,
      category: formData.category,
      date: new Date().toISOString()
    })
    showModal.value = false
  } catch (err) {
    alert(err.message || 'Ошибка создания транзакции')
  }
}

const deleteTx = async (id) => {
  if (!confirm('Удалить эту транзакцию?')) return
  try {
    await removeTransaction(id)
  } catch (err) {
    alert(err.message || 'Ошибка удаления')
  }
}

onMounted(() => {
  fetchTransactions(currentUser.value?.id)
})
</script>