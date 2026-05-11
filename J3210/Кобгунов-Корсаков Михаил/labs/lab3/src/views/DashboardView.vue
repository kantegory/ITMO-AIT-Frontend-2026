<script setup>
import { onMounted } from 'vue';
import AccountCards from '../components/AccountCards.vue';
import BudgetProgress from '../components/BudgetProgress.vue';
import CurrencyRate from '../components/CurrencyRate.vue';
import SummaryCards from '../components/SummaryCards.vue';
import TransactionsTable from '../components/TransactionsTable.vue';
import { useTransactions } from '../composables/useTransactions';

const {
  loading,
  error,
  summary,
  lastTransactions,
  loadTransactions
} = useTransactions();

onMounted(() => {
  loadTransactions();
});
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-4">Личный кабинет</h2>

    <CurrencyRate />
    <SummaryCards :summary="summary" />
    <AccountCards />

    <div class="mb-4">
      <TransactionsTable
        :items="lastTransactions"
        :loading="loading"
        :error="error"
        short
      />
    </div>

    <BudgetProgress />
  </div>
</template>
