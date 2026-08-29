<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <TheSidebar />

      <main class="col-12 col-md-9 col-lg-10 p-4 p-lg-5">
        <TheHeader title="Поиск и фильтрация" />

        <!-- панель параметров фильтрации -->
        <SearchFilter 
          v-model:category="selectedCategory"
          v-model:amount="maxAmount"
          v-model:date="selectedDate"
          @reset="resetFilters"
        />

        <!-- таблица с результатами -->
        <SearchTable 
          :transactions="filteredTransactions" 
          :total-user-transactions="transactions.length"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheSidebar from '../components/layout/TheSidebar.vue'
import TheHeader from '../components/layout/TheHeader.vue'
import SearchFilter from '../components/search/SearchFilter.vue'
import SearchTable from '../components/search/SearchTable.vue'
import { useAuth } from '@/composables/useAuth'
import { useTransactions } from '@/composables/useTransactions'

const { currentUser } = useAuth()
const { transactions, fetchTransactions } = useTransactions()

const selectedCategory = ref('')
const maxAmount = ref(null)
const selectedDate = ref('')

const filteredTransactions = computed(() => {
  return transactions.value.filter(tx => {
    const matchCategory = !selectedCategory.value || tx.category === selectedCategory.value
    const matchAmount = !maxAmount.value || Math.abs(tx.amount) <= maxAmount.value
    const matchDate = !selectedDate.value || (tx.date && tx.date.startsWith(selectedDate.value))

    return matchCategory && matchAmount && matchDate
  })
})

const resetFilters = () => {
  selectedCategory.value = ''
  maxAmount.value = null
  selectedDate.value = ''
}

onMounted(() => {
  // запрашиваем транзакции, если массив в общем хранилище ещё пуст
  if (currentUser.value?.id && transactions.value.length === 0) {
    fetchTransactions(currentUser.value.id)
  }
})
</script>