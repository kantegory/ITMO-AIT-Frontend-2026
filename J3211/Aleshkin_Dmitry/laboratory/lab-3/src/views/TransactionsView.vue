<template>
  <main class="container">
    <DemoBanner :is-demo="finance.isDemo.value" />
    <BaseAlert :message="notice.message || finance.error.value" :type="notice.type" />

    <h1 class="page-title mb-4">Транзакции</h1>

    <div class="content-card mb-4">
      <TransactionForm
        :accounts="finance.accounts.value"
        :categories="finance.categories"
        :disabled="finance.isDemo.value"
        :format-currency="finance.formatCurrency"
        @submit="submitTransaction"
      />
    </div>

    <div class="content-card mb-4">
      <TransactionsFilter
        :filters="filters"
        :categories="finance.categories"
        @apply="applyFilters"
        @reset="resetFilters"
      />
    </div>

    <TransactionTable
      :items="filteredTransactions"
      :disabled="finance.isDemo.value"
      :format-currency="finance.formatCurrency"
      :format-date="finance.formatDate"
      @remove="removeTransaction"
    />

    <ExpenseChart :items="finance.expensesByCategory.value" />
  </main>
</template>

<script setup>
import { computed, reactive } from 'vue';
import BaseAlert from '../components/BaseAlert.vue';
import DemoBanner from '../components/DemoBanner.vue';
import ExpenseChart from '../components/ExpenseChart.vue';
import TransactionForm from '../components/TransactionForm.vue';
import TransactionsFilter from '../components/TransactionsFilter.vue';
import TransactionTable from '../components/TransactionTable.vue';
import { useFinanceManager } from '../composables/useFinanceManager.js';

const finance = useFinanceManager();

const notice = reactive({
  message: '',
  type: 'info',
});

const filters = reactive({
  category: 'all',
  minAmount: 0,
  dateFrom: '',
  dateTo: '',
});

const filteredTransactions = computed(() => {
  return finance.transactions.value.filter((item) => {
    const categoryOk = filters.category === 'all' || item.category === filters.category;
    const minOk = Math.abs(Number(item.amount || 0)) >= Number(filters.minAmount || 0);
    const fromOk = !filters.dateFrom || item.date >= filters.dateFrom;
    const toOk = !filters.dateTo || item.date <= filters.dateTo;
    return categoryOk && minOk && fromOk && toOk;
  });
});

function applyFilters() {
  notice.message = '';
}

function resetFilters() {
  filters.category = 'all';
  filters.minAmount = 0;
  filters.dateFrom = '';
  filters.dateTo = '';
}

async function submitTransaction(payload) {
  notice.message = '';

  if (!payload.accountId || !payload.description || !payload.date || Number(payload.amount) <= 0) {
    notice.message = 'Заполните все поля транзакции корректно.';
    notice.type = 'warning';
    return;
  }

  try {
    const amount =
      payload.type === 'expense'
        ? -Math.abs(Number(payload.amount))
        : Math.abs(Number(payload.amount));

    await finance.createTransaction({
      userId: finance.currentUser.value.id,
      accountId: payload.accountId,
      date: payload.date,
      description: payload.description,
      category: payload.category,
      categoryName: payload.categoryName,
      amount,
      currency: payload.currency,
      type: payload.type,
    });

    notice.message = 'Транзакция успешно добавлена.';
    notice.type = 'success';
  } catch (error) {
    notice.message = error.message;
    notice.type = 'danger';
  }
}

async function removeTransaction(id) {
  try {
    await finance.deleteTransaction(id);
    notice.message = 'Транзакция удалена.';
    notice.type = 'success';
  } catch (error) {
    notice.message = error.message;
    notice.type = 'danger';
  }
}
</script>