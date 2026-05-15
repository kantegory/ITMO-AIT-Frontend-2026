<template>
  
  <section aria-labelledby="filters-title" class="mb-4">
    <h2 id="filters-title" class="visually-hidden">Фильтры поиска мероприятий</h2>
    <form class="row g-3 mb-0" role="search" aria-label="Поиск мероприятий" @submit.prevent>
      <div class="col-md-4">
        <label for="searchInput" class="form-label">Поиск по названию</label>
        <input
          id="searchInput"
          type="text"
          class="form-control"
          placeholder="Например: концерт"
          autocomplete="off"
          :value="search"
          @input="$emit('update:search', $event.target.value)"
        >
      </div>
      <div class="col-md-3">
        <label for="typeFilter" class="form-label">Тип мероприятия</label>
        <select
          id="typeFilter"
          class="form-select"
          :value="typeFilter"
          @change="$emit('update:typeFilter', $event.target.value)"
        >
          <option value="all">Все типы</option>
          <option v-for="option in typeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="cityFilter" class="form-label">Город</label>
        <input
          id="cityFilter"
          type="text"
          class="form-control"
          placeholder="Введите город"
          autocomplete="address-level2"
          :value="cityFilter"
          @input="$emit('update:cityFilter', $event.target.value)"
        >
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button type="button" class="btn btn-outline-secondary w-100 btn-icon" @click="$emit('reset')">
          <base-icon name="search" />
          <span>Сброс</span>
        </button>
      </div>
    </form>
  </section>
</template>

<script>

import useEventTypes from '@/composables/useEventTypes'
import BaseIcon from '@/components/BaseIcon.vue'

export default {
  name: 'EventFilters',
  components: { BaseIcon },

  props: {
    search: { type: String, default: '' },
    typeFilter: { type: String, default: 'all' },
    cityFilter: { type: String, default: '' }
  },
  emits: ['update:search', 'update:typeFilter', 'update:cityFilter', 'reset'],
  setup() {
    const { typeOptions } = useEventTypes()
    return { typeOptions }
  }
}

</script>
