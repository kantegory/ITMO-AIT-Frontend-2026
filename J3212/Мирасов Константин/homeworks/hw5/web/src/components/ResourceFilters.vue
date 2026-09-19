<script setup>
import { computed } from 'vue';

const props = defineProps({
  query: { type: String, default: '' },
  type: { type: String, default: '' },
});
const emit = defineEmits(['update:query', 'update:type', 'reset']);

const queryInput = computed({
  get: () => props.query,
  set: (value) => emit('update:query', value),
});
const typeInput = computed({ get: () => props.type, set: (value) => emit('update:type', value) });
</script>

<template>
  <form class="axon-filters" role="search" aria-label="Resource filters" @submit.prevent>
    <div class="axon-search-field">
      <label class="form-label" for="resource-query">Search resources</label>
      <input
        id="resource-query"
        v-model="queryInput"
        class="form-control"
        type="search"
        placeholder="Search by name or description"
        aria-controls="resource-results"
      />
    </div>
    <div class="axon-type-field">
      <label class="form-label" for="resource-type">Type</label>
      <select
        id="resource-type"
        v-model="typeInput"
        class="form-select"
        aria-controls="resource-results"
      >
        <option value="">All types</option>
        <option value="model">Models</option>
        <option value="dataset">Datasets</option>
      </select>
    </div>
    <button class="btn btn-outline-primary" type="button" @click="emit('reset')"
      >Reset filters</button
    >
  </form>
</template>
