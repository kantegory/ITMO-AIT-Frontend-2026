<template>
  <AppLayout>
    <template #header="{ toggleSidebar }">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
            <button class="btn btn-light d-lg-none me-2" @click="toggleSidebar" aria-expanded="false" aria-controls="sidebar" aria-label="Открыть меню">
                <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-list"></use></svg>
            </button>
            <h1 class="m-0 h2">Управление транзакциями</h1>
        </div>
        <button class="btn btn-primary btn-sm px-3 py-2" @click="openModal('transaction')">
            <svg class="bi me-1" aria-hidden="true"><use href="/assets/sprite.svg#bi-plus-lg"></use></svg> Добавить
        </button>
      </div>
    </template>

    <div v-if="!isDataLoaded" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-muted" aria-live="polite">Загрузка данных...</div>
    </div>

    <div v-else>
      <!-- Фильтры -->
      <section class="card border-0 shadow-sm p-4 mb-4" aria-labelledby="filter-heading">
          <h2 id="filter-heading" class="h5 mb-3">Поиск и фильтрация</h2>
          <div class="row g-3">
              <div class="col-12 col-md-6 col-lg-3">
                  <label for="filter-category" class="form-label text-muted small mb-1">Категория</label>
                  <select class="form-select" id="filter-category" v-model="filters.category">
                      <option value="all">Все категории</option>
                      <optgroup label="Расходы" v-if="expenseCategories.length">
                          <option v-for="cat in expenseCategories" :key="cat" :value="cat">{{ cat }}</option>
                      </optgroup>
                      <optgroup label="Доходы" v-if="incomeCategories.length">
                          <option v-for="cat in incomeCategories" :key="cat" :value="cat">{{ cat }}</option>
                          <option value="Из копилки">Из копилки</option>
                      </optgroup>
                      <optgroup label="Копилки" v-if="goals.length">
                          <option v-for="goal in goals" :key="goal.id" :value="goal.name">{{ goal.name }}</option>
                      </optgroup>
                  </select>
              </div>
              <div class="col-6 col-md-3 col-lg-2">
                  <label for="filter-min" class="form-label text-muted small mb-1">Сумма от (₽)</label>
                  <input type="number" id="filter-min" class="form-control" v-model.number="filters.min" placeholder="0">
              </div>
              <div class="col-6 col-md-3 col-lg-2">
                  <label for="filter-max" class="form-label text-muted small mb-1">Сумма до (₽)</label>
                  <input type="number" id="filter-max" class="form-control" v-model.number="filters.max" placeholder="Макс">
              </div>
              <div class="col-6 col-md-6 col-lg-2">
                  <label for="filter-date-start" class="form-label text-muted small mb-1">Дата с</label>
                  <input type="date" id="filter-date-start" class="form-control" v-model="filters.dateStart">
              </div>
              <div class="col-6 col-md-6 col-lg-3">
                  <label for="filter-date-end" class="form-label text-muted small mb-1">Дата по</label>
                  <input type="date" id="filter-date-end" class="form-control" v-model="filters.dateEnd">
              </div>
          </div>
      </section>

      <!-- Таблица -->
      <section class="card border-0 shadow-sm p-3 table-responsive">
          <table class="table table-hover align-middle mb-0" style="min-width: 600px;">
              <caption class="visually-hidden">Список ваших транзакций</caption>
              <thead>
                <tr>
                  <th scope="col">Дата</th>
                  <th scope="col">Описание</th>
                  <th scope="col">Категория</th>
                  <th scope="col">Сумма</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredTransactions.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">Транзакции не найдены</td>
                </tr>
                <tr v-for="t in filteredTransactions" :key="t.id">
                    <td>{{ new Date(t.date).toLocaleDateString('ru-RU') }}</td>
                    <td><strong>{{ t.desc }}</strong></td>
                    <td><span class="badge bg-secondary">{{ t.category }}</span></td>
                    <td class="fw-bold" :class="getColorClass(t)">
                        {{ getSign(t) }} {{ t.amount.toLocaleString() }} ₽
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" @click="openModal('transaction', t)" aria-label="Редактировать транзакцию">
                            <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-pencil"></use></svg>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="openModal('delete', { id: t.id, type: 'transaction' })" aria-label="Удалить транзакцию">
                            <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-trash"></use></svg>
                        </button>
                    </td>
                </tr>
              </tbody>
          </table>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { useFinanceData } from '../composables/useFinanceData';
import { useModals } from '../composables/useModals';

const { transactions, categories, goals, isDataLoaded, loadData } = useFinanceData();
const { openModal } = useModals();

const filters = ref({
    category: 'all',
    min: null,
    max: null,
    dateStart: '',
    dateEnd: ''
});

onMounted(() => {
    if (!isDataLoaded.value) loadData();
});

const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense').map(c => c.name).sort());
const incomeCategories = computed(() => categories.value.filter(c => c.type === 'income').map(c => c.name).sort());

const filteredTransactions = computed(() => {
    return transactions.value.filter(t => {
        if (filters.value.category !== 'all' && t.category !== filters.value.category) return false;
        
        const minAmount = filters.value.min !== null && filters.value.min !== '' ? filters.value.min : 0;
        const maxAmount = filters.value.max !== null && filters.value.max !== '' ? filters.value.max : Infinity;
        if (t.amount < minAmount || t.amount > maxAmount) return false;

        if (filters.value.dateStart && new Date(t.date) < new Date(filters.value.dateStart)) return false;
        if (filters.value.dateEnd && new Date(t.date) > new Date(filters.value.dateEnd)) return false;

        return true;
    });
});

const getColorClass = (t) => {
    if (t.type === 'savings') return 'text-primary';
    if (t.type === 'income' && t.category === 'Из копилки') return 'text-warning';
    return t.type === 'income' ? 'text-success' : 'text-danger';
};

const getSign = (t) => {
    if (t.type === 'savings') return '-';
    if (t.type === 'income' && t.category === 'Из копилки') return '+';
    return t.type === 'income' ? '+' : '-';
};
</script>