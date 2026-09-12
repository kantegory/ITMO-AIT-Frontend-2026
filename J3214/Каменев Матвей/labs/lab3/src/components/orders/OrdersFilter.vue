<script setup>
defineProps({
  types: {
    type: Array,
    required: true,
  },
})

const search = defineModel('search', { type: String, default: '' })
const type = defineModel('type', { type: String, default: '' })
</script>

<template>
  <div class="col-md-5">
    <input
      v-model="search"
      id="order-search"
      type="search"
      class="form-control"
      placeholder="Поиск по названию..."
      aria-label="Поиск заказов по названию"
    />
  </div>
  <div class="col-md-4">
    <select v-model="type" id="order-type-filter" class="form-select" aria-label="Фильтр по типу задания">
      <option value="">Все типы</option>
      <option v-for="item in types" :key="item" :value="item">{{ item }}</option>
    </select>
  </div>
</template>
