<script setup>
const search = defineModel('search', { type: String, default: '' })
const activeFilter = defineModel('filter', { type: String, default: 'all' })

const filters = [
  { key: 'all', label: 'All', class: 'btn-outline-secondary' },
  { key: 'success', label: 'Success', class: 'btn-outline-success' },
  { key: 'failed', label: 'Failed', class: 'btn-outline-danger' },
  { key: 'running', label: 'Running', class: 'btn-outline-warning' },
]
</script>

<template>
  <div class="filter-bar d-flex flex-wrap gap-2 align-items-center">
    <input
      v-model="search"
      type="text"
      class="form-control form-control-sm"
      style="max-width: 250px"
      placeholder="Search pipelines..."
    />

    <button
      v-for="item in filters"
      :key="item.key"
      type="button"
      class="btn btn-sm"
      :class="[item.class, { active: activeFilter === item.key }]"
      @click="activeFilter = item.key"
    >
      {{ item.label }}
    </button>
  </div>
</template>
