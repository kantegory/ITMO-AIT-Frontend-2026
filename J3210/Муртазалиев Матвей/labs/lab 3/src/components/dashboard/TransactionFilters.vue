<template>
  <form class="filter-panel mt-4" aria-labelledby="transaction-filters-title" novalidate @submit.prevent>
    <h3 id="transaction-filters-title" class="visually-hidden">Фильтры транзакций</h3>
    <div class="row g-3 align-items-end">
      <div class="col-md-4">
        <label class="form-label" for="searchFilter">Поиск</label>
        <input id="searchFilter" v-model="filters.search" class="form-control" type="search" placeholder="Название магазина или операции" />
      </div>
      <div class="col-md-4">
        <label class="form-label" for="categoryFilter">Категория</label>
        <select id="categoryFilter" v-model="filters.category" class="form-select">
          <option value="all">Все</option>
          <option v-for="category in categories" :key="category" :value="category.toLowerCase()">{{ category }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label" for="amountFilter">Макс. сумма</label>
        <input id="amountFilter" v-model="filters.amount" class="form-control" type="number" placeholder="Например, 5000" />
      </div>
      <div class="col-md-3">
        <label class="form-label" for="dateFrom">Дата от</label>
        <input id="dateFrom" v-model="filters.from" class="form-control" type="date" />
      </div>
      <div class="col-md-3">
        <label class="form-label" for="dateTo">Дата до</label>
        <input id="dateTo" v-model="filters.to" class="form-control" type="date" />
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
      <p class="mb-0 text-secondary" role="status" aria-live="polite">
        <template v-if="loading">Загрузка...</template>
        <template v-else>Найдено транзакций: <strong>{{ count }}</strong></template>
      </p>
      <button class="btn btn-link link-accent text-decoration-none p-0" type="button" @click="$emit('reset')">Сбросить фильтры</button>
    </div>
  </form>
</template>

<script setup>
defineEmits(["reset"]);

defineProps({
  filters: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
