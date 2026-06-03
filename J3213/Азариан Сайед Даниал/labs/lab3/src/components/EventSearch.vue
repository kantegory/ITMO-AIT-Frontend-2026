<script setup>
const filters = defineModel({
  type: Object,
  required: true,
})

defineProps({
  cities: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search'])
</script>

<template>
  <form class="search-panel p-3 p-md-4" @submit.prevent="emit('search')">
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label" for="searchEvent">Что ищем?</label>
        <input id="searchEvent" v-model.trim="filters.searchText" type="text" class="form-control" placeholder="Например, Stand-Up" />
      </div>
      <div class="col-md-3">
        <label class="form-label" for="searchDate">Дата</label>
        <input id="searchDate" v-model="filters.selectedDate" type="date" class="form-control" />
      </div>
      <div class="col-md-3">
        <label class="form-label" for="searchCity">Город</label>
        <select id="searchCity" v-model="filters.selectedCity" class="form-select">
          <option value="">Любой</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-primary w-100" type="submit" :disabled="loading">
          {{ loading ? 'Ищем...' : 'Найти' }}
        </button>
      </div>
    </div>
  </form>
</template>
