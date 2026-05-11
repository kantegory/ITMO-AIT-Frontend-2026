<script setup>
import { reactive } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['apply', 'reset']);

const filters = reactive({
  search: '',
  category: '',
  amount: '',
  date: ''
});

function applyFilters() {
  emit('apply', { ...filters });
}

function resetFilters() {
  filters.search = '';
  filters.category = '';
  filters.amount = '';
  filters.date = '';
  emit('reset');
}
</script>

<template>
  <div class="card shadow-sm p-3 mb-4">
    <div class="row g-3">
      <div class="col-md-3">
        <label for="searchInput" class="form-label">Поиск</label>
        <input
          id="searchInput"
          v-model="filters.search"
          type="text"
          class="form-control"
          name="search"
          placeholder="Поиск"
        >
      </div>

      <div class="col-md-3">
        <label for="categorySelect" class="form-label">Категория</label>
        <select id="categorySelect" v-model="filters.category" class="form-select" name="category">
          <option value="">Категория</option>
          <option v-for="category in props.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="col-md-2">
        <label for="amountInput" class="form-label">Сумма</label>
        <input
          id="amountInput"
          v-model="filters.amount"
          type="number"
          class="form-control"
          name="amount"
          placeholder="Сумма"
        >
      </div>

      <div class="col-md-2">
        <label for="dateInput" class="form-label">Дата</label>
        <input
          id="dateInput"
          v-model="filters.date"
          type="date"
          class="form-control"
          name="date"
        >
      </div>

      <div class="col-md-2 d-grid align-self-end">
        <button class="btn btn-primary" type="button" @click="applyFilters">
          Применить
        </button>
      </div>
    </div>

    <div class="mt-3">
      <button class="btn btn-outline-secondary" type="button" @click="resetFilters">
        Сбросить
      </button>
    </div>
  </div>
</template>
