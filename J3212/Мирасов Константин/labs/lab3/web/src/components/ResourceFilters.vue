<script setup>
import { computed, reactive, ref, watch, useId } from 'vue';
import { filterOptions, readFilters } from '../services/filters.js';
import Icon from './Icon.vue';

const allLabels = {
  type: 'types',
  size: 'sizes',
  license: 'licenses',
  task: 'tasks',
  framework: 'frameworks',
};

const props = defineProps({ filters: { type: Object, required: true } });
const emit = defineEmits(['apply']);
const draft = reactive(readFilters(props.filters));
const panelId = useId();
const activeCount = computed(
  () => Object.entries(props.filters).filter(([key, value]) => key !== 'q' && value).length,
);
const expanded = ref(activeCount.value > 0);
watch(
  () => props.filters,
  (value) => Object.assign(draft, readFilters(value)),
  { deep: true },
);

function reset() {
  Object.assign(draft, readFilters({}));
  emit('apply', { ...draft });
}
</script>
<template>
  <form
    class="axon-filter-form"
    role="search"
    aria-label="Resource filters"
    @submit.prevent="emit('apply', { ...draft })"
  >
    <div class="axon-search">
      <div>
        <label class="form-label" for="resource-query">Search resources</label>
        <input
          id="resource-query"
          v-model="draft.q"
          type="search"
          class="form-control"
          placeholder="Search by name, description or tag"
          aria-controls="resource-results"
        />
      </div>
      <button class="btn btn-primary" type="submit"><Icon name="search" />Apply filters</button>
      <button class="btn btn-outline-primary" type="button" @click="reset">Reset</button>
      <button
        class="btn btn-outline-primary axon-filter-toggle"
        type="button"
        :aria-expanded="expanded"
        :aria-controls="panelId"
        @click="expanded = !expanded"
      >
        <Icon name="sliders" /> Filters<span v-if="activeCount"> ({{ activeCount }})</span>
        <span class="axon-chevron" aria-hidden="true"></span>
      </button>
    </div>
    <div
      :id="panelId"
      class="axon-filter-collapse"
      :class="{ 'is-open': expanded }"
      :inert="!expanded"
      :aria-hidden="!expanded"
    >
      <div class="axon-filter-clip">
        <div class="axon-filter-grid">
          <div v-for="(options, key) in filterOptions" :key="key">
            <label class="form-label text-capitalize" :for="`filter-${key}`">{{
              key[0].toUpperCase() + key.slice(1)
            }}</label>
            <select :id="`filter-${key}`" v-model="draft[key]" class="form-select">
              <option value="">
                All
                {{ allLabels[key] }}
              </option>
              <option v-for="[value, label] in options" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
