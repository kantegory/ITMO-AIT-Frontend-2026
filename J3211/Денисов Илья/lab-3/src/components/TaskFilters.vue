<script setup>
defineProps({
  statusOptions: {
    type: Array,
    required: true
  },
  priorityOptions: {
    type: Array,
    required: true
  }
});

const searchQuery = defineModel('searchQuery', { type: String, default: '' });
const statusFilter = defineModel('statusFilter', { type: String, default: 'all' });
const priorityFilter = defineModel('priorityFilter', { type: String, default: 'all' });
const sortValue = defineModel('sortValue', { type: String, default: 'az' });
</script>

<template>
  <div class="container pt-4">
    <div class="row g-3 align-items-end">
      <div class="col-12 col-lg-5">
        <label for="search" class="form-label visually-hidden">Поиск по задачам</label>
        <input
          id="search"
          v-model="searchQuery"
          class="form-control"
          type="search"
          placeholder="Поиск по задачам"
          aria-label="Поиск по задачам"
        />
      </div>

      <div class="col-12 col-sm-6 col-lg-2">
        <label for="status-filter" class="form-label visually-hidden">Фильтр по статусу</label>
        <select id="status-filter" v-model="statusFilter" class="form-select" aria-label="Фильтр по статусу">
          <option value="all">Все статусы</option>
          <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>

      <div class="col-12 col-sm-6 col-lg-2">
        <label for="priority-filter" class="form-label visually-hidden">Фильтр по приоритету</label>
        <select id="priority-filter" v-model="priorityFilter" class="form-select" aria-label="Фильтр по приоритету">
          <option value="all">Все приоритеты</option>
          <option v-for="priority in priorityOptions" :key="priority" :value="priority">{{ priority }}</option>
        </select>
      </div>

      <div class="col-12 col-lg-3">
        <label for="sort" class="form-label visually-hidden">Сортировка</label>
        <select id="sort" v-model="sortValue" class="form-select" aria-label="Сортировка по постановщику">
          <option value="az">Постановщик: А → Я</option>
          <option value="za">Постановщик: Я → А</option>
        </select>
      </div>
    </div>
  </div>
</template>
