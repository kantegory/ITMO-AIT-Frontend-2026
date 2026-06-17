<template>
  <AppLayout title="Транзакции" subtitle="Добавление и фильтрация операций">
    <PageHeader
      kicker="Операции"
      title="Транзакции"
      description="Здесь можно добавить новый доход или расход, а также отфильтровать список операций."
    />

    <TransactionForm class="mb-4" :accounts="accounts" @submit="handleAddTransaction" />

    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Фильтры</h2>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label" for="search">Поиск</label>
            <input id="search" v-model.trim="filters.search" class="form-control" placeholder="Описание, категория, счёт" />
          </div>
          <div class="col-md-2">
            <label class="form-label" for="type">Тип</label>
            <select id="type" v-model="filters.type" class="form-select">
              <option value="">Все</option>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="account">Счёт</label>
            <select id="account" v-model="filters.accountId" class="form-select">
              <option value="">Все счета</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="sort">Сортировка</label>
            <select id="sort" v-model="filters.sort" class="form-select">
              <option value="date_desc">Сначала новые</option>
              <option value="date_asc">Сначала старые</option>
              <option value="amount_desc">Сумма по убыванию</option>
              <option value="amount_asc">Сумма по возрастанию</option>
              <option value="alpha_asc">А-Я</option>
              <option value="alpha_desc">Я-А</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Список операций</h2>
          <span class="badge text-bg-light">{{ filteredTransactions.length }} записей</span>
        </div>
        <TransactionTable :transactions="filteredTransactions" :format-money="formatMoney" editable @delete="handleDelete" />
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import PageHeader from '../components/PageHeader.vue';
import TransactionForm from '../components/TransactionForm.vue';
import TransactionTable from '../components/TransactionTable.vue';
import { useFinance } from '../composables/useFinance';
import { useToast } from '../composables/useToast';

const { accounts, syncData, addTransaction, deleteTransaction, getTransactionsWithAccount, formatMoney } = useFinance();
const { showToast } = useToast();

const filters = reactive({ search: '', type: '', accountId: '', sort: 'date_desc' });
const filteredTransactions = computed(() => getTransactionsWithAccount(filters));

onMounted(syncData);

async function handleAddTransaction(payload) {
  await addTransaction(payload);
  showToast('Транзакция добавлена');
}

async function handleDelete(id) {
  await deleteTransaction(id);
  showToast('Транзакция удалена', 'warning');
}
</script>
