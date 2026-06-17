<script setup>
import { onMounted, ref } from 'vue';
import TransactionFilters from '../components/TransactionFilters.vue';
import TransactionsTable from '../components/TransactionsTable.vue';
import { useTransactions } from '../composables/useTransactions';

const {
  transactions,
  loading,
  error,
  categories,
  loadTransactions,
  filterTransactions
} = useTransactions();

const visibleTransactions = ref([]);

async function loadPage() {
  await loadTransactions();
  visibleTransactions.value = transactions.value;
}

function applyFilters(filters) {
  visibleTransactions.value = filterTransactions(filters);
}

function resetFilters() {
  visibleTransactions.value = transactions.value;
}

onMounted(() => {
  loadPage();
});
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4">Поиск и фильтрация транзакций</h2>

    <TransactionFilters
      :categories="categories"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <TransactionsTable
      :items="visibleTransactions"
      :loading="loading"
      :error="error"
    />
  </div>
</template>
