<template>
  <form class="filter-box" @submit.prevent="$emit('apply')" @reset="$emit('reset')">
    <h2>Фильтры</h2>
    <div class="row g-3">
      <div class="col-12 col-md-6 col-lg-3">
        <label class="form-label">Категория</label>
        <select v-model="filters.category" class="form-select">
          <option value="all">Все</option>
          <option v-for="item in filterCategories" :key="item.value" :value="item.value">{{ item.label }}</option>
          <option value="income">Доход</option>
        </select>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <label class="form-label">Минимальная сумма</label>
        <input v-model.number="filters.minAmount" type="number" class="form-control" min="0" placeholder="Например, 1000" />
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <label class="form-label">Дата от</label>
        <input v-model="filters.dateFrom" type="date" class="form-control" />
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <label class="form-label">Дата до</label>
        <input v-model="filters.dateTo" type="date" class="form-control" />
      </div>
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-primary" type="submit">Применить</button>
        <button class="btn btn-outline-secondary" type="reset">Сбросить</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  filters: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
});

defineEmits(['apply', 'reset']);

const filterCategories = computed(() => props.categories.filter((item) => item.value !== 'income'));
</script>
