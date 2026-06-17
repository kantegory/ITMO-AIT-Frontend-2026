<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import StatCard from '@/components/StatCard.vue';
import { useAuth } from '@/composables/useAuth';
import { useFinanceHelpers } from '@/composables/useFinanceHelpers';
import { apiRequest, normalizeErrorMessage } from '@/services/api';

const FILTER_STORAGE_KEY = 'lab3-transactions-filters';

const auth = useAuth();
const helpers = useFinanceHelpers();

const isLoading = ref(false);
const errorMessage = ref('');
const transactions = ref([]);

const filters = reactive({
  query: '',
  category: '',
  minAmount: '',
  maxAmount: '',
  fromDate: '',
  toDate: '',
});

function restoreFilters() {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const payload = JSON.parse(raw);
    filters.query = payload.query || '';
    filters.category = payload.category || '';
    filters.minAmount = payload.minAmount || '';
    filters.maxAmount = payload.maxAmount || '';
    filters.fromDate = payload.fromDate || '';
    filters.toDate = payload.toDate || '';
  } catch {
    /* Ignore bad localStorage values. */
  }
}

function saveFilters() {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    /* Ignore private mode/localStorage write failures. */
  }
}

function resetFilters() {
  filters.query = '';
  filters.category = '';
  filters.minAmount = '';
  filters.maxAmount = '';
  filters.fromDate = '';
  filters.toDate = '';
}

const filteredTransactions = computed(() => {
  const query = filters.query.trim().toLowerCase();
  const selectedCategory = filters.category;
  const minAmount = Number(filters.minAmount) || 0;
  const maxAmount = Number(filters.maxAmount) || Number.POSITIVE_INFINITY;
  const fromDate = filters.fromDate || '0000-00-00';
  const toDate = filters.toDate || '9999-12-31';

  return transactions.value.filter((item) => {
    const title = String(item.title || '').toLowerCase();
    const amount = Number(item.amount || 0);

    const matchesQuery = !query || title.includes(query);
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesAmount = amount >= minAmount && amount <= maxAmount;
    const matchesDate = String(item.date || '') >= fromDate && String(item.date || '') <= toDate;

    return matchesQuery && matchesCategory && matchesAmount && matchesDate;
  });
});

const statsCount = computed(() => filteredTransactions.value.length);

const statsIncome = computed(() =>
  filteredTransactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0),
);

const statsExpense = computed(() =>
  filteredTransactions.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0),
);

async function loadTransactions() {
  if (!auth.user.value?.id || !auth.token.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const data = await apiRequest('/transactions', {
      token: auth.token.value,
      params: {
        userId: auth.user.value.id,
        _sort: 'date',
        _order: 'desc',
      },
    });

    transactions.value = Array.isArray(data) ? data : [];
  } catch (error) {
    errorMessage.value = normalizeErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

watch(filters, saveFilters, { deep: true });

onMounted(() => {
  restoreFilters();
  void loadTransactions();
});
</script>

<template>
  <section class="glass-card hero-panel mb-4 reveal">
    <h1 class="page-title">Поиск и фильтрация транзакций</h1>
    <p class="page-subtitle mb-0">
      Фильтруйте операции по категории, сумме и дате. Пользователь: {{ auth.userName.value }}.
    </p>
  </section>

  <div v-if="errorMessage" class="alert alert-danger mb-4" role="status">{{ errorMessage }}</div>

  <section class="glass-card p-3 p-md-4 mb-4 reveal delay-1" aria-labelledby="filtersTitle">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <h2 id="filtersTitle" class="section-title h5 mb-0">Фильтры</h2>
      <button class="btn btn-sm btn-outline-secondary" type="button" @click="resetFilters">Сбросить</button>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-4">
        <label class="form-label" for="filterQuery">Поиск по описанию</label>
        <input id="filterQuery" v-model.trim="filters.query" type="search" class="form-control" placeholder="Например: такси" />
      </div>
      <div class="col-12 col-sm-6 col-lg-2">
        <label class="form-label" for="filterCategory">Категория</label>
        <select id="filterCategory" v-model="filters.category" class="form-select">
          <option value="">Все категории</option>
          <option value="groceries">Продукты</option>
          <option value="salary">Доход</option>
          <option value="subscriptions">Подписки</option>
          <option value="transport">Транспорт</option>
          <option value="savings">Накопления</option>
          <option value="food">Кафе</option>
          <option value="freelance">Фриланс</option>
          <option value="utilities">Коммунальные</option>
          <option value="scholarship">Стипендия</option>
          <option value="gifts">Подарки</option>
          <option value="other">Прочее</option>
        </select>
      </div>
      <div class="col-6 col-sm-3 col-lg-2">
        <label class="form-label" for="filterMinAmount">Сумма от</label>
        <input id="filterMinAmount" v-model="filters.minAmount" type="number" min="0" step="1" class="form-control" />
      </div>
      <div class="col-6 col-sm-3 col-lg-2">
        <label class="form-label" for="filterMaxAmount">Сумма до</label>
        <input id="filterMaxAmount" v-model="filters.maxAmount" type="number" min="0" step="1" class="form-control" />
      </div>
      <div class="col-6 col-sm-3 col-lg-2">
        <label class="form-label" for="filterFromDate">Дата от</label>
        <input id="filterFromDate" v-model="filters.fromDate" type="date" class="form-control" />
      </div>
      <div class="col-6 col-sm-3 col-lg-2">
        <label class="form-label" for="filterToDate">Дата до</label>
        <input id="filterToDate" v-model="filters.toDate" type="date" class="form-control" />
      </div>
    </div>
  </section>

  <section class="row g-3 mb-4">
    <div class="col-sm-4 reveal delay-1">
      <StatCard label="Найдено операций" :value="statsCount" />
    </div>
    <div class="col-sm-4 reveal delay-2">
      <StatCard label="Сумма доходов" :value="helpers.formatCurrency(statsIncome)" />
    </div>
    <div class="col-sm-4 reveal delay-2">
      <StatCard label="Сумма расходов" :value="helpers.formatCurrency(statsExpense)" />
    </div>
  </section>

  <section class="glass-card p-3 p-md-4 reveal delay-3" aria-labelledby="resultsTitle">
    <div class="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
      <h2 id="resultsTitle" class="section-title h5 mb-0">Результаты поиска</h2>
      <small class="text-muted-custom">Данные загружаются через axios с mock API</small>
    </div>

    <div v-if="isLoading" class="text-muted-custom">Загрузка операций...</div>

    <div v-else class="table-responsive">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Дата</th>
            <th scope="col">Описание</th>
            <th scope="col">Категория</th>
            <th scope="col">Тип</th>
            <th scope="col">Счет</th>
            <th scope="col">Сумма</th>
            <th scope="col">ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!filteredTransactions.length">
            <td colspan="7" class="py-4 text-center text-muted-custom">По выбранным фильтрам ничего не найдено.</td>
          </tr>
          <tr v-for="item in filteredTransactions" :key="item.id">
            <td data-label="Дата">{{ helpers.formatDate(item.date) }}</td>
            <td data-label="Описание" class="text-clamp">{{ item.title }}</td>
            <td data-label="Категория">{{ item.categoryLabel || helpers.getCategoryLabel(item.category) }}</td>
            <td data-label="Тип">
              <span class="badge-soft" :class="helpers.getBadgeClass(item.type)">
                {{ item.typeLabel || helpers.getTypeLabel(item.type) }}
              </span>
            </td>
            <td data-label="Счет">{{ item.accountName || '—' }}</td>
            <td data-label="Сумма">{{ item.type === 'expense' ? '-' : '' }}{{ helpers.formatCurrency(item.amount) }}</td>
            <td data-label="ID">#{{ item.id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
