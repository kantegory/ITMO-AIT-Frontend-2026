<script setup>
import { computed, ref } from 'vue';
import PageLayout from './components/PageLayout.vue';
import ResourceFilters from './components/ResourceFilters.vue';
import ResourceRow from './components/ResourceRow.vue';
import { resourcePreviews } from './data/resource-previews.js';

const query = ref('');
const type = ref('');
const visibleResources = computed(() => {
  const search = query.value.trim().toLowerCase();

  return resourcePreviews.filter(
    (resource) =>
      (!type.value || resource.type === type.value) &&
      `${resource.name} ${resource.summary}`.toLowerCase().includes(search),
  );
});

function resetFilters() {
  query.value = '';
  type.value = '';
}
</script>

<template>
  <PageLayout>
    <section class="axon-intro" aria-labelledby="page-title">
      <p class="axon-eyebrow">The resource library</p>
      <h1 id="page-title">Find your next starting point.</h1>
      <p>Explore models and datasets. Compare the details and find something to build on.</p>
      <p class="axon-preview-note">Sample catalog · Read-only previews</p>
    </section>
    <ResourceFilters v-model:query="query" v-model:type="type" @reset="resetFilters" />
    <section id="resource-results" aria-labelledby="results-heading">
      <div class="axon-results-heading">
        <h2 id="results-heading">Explore resources</h2>
        <p role="status" aria-live="polite"
          >{{ visibleResources.length }}
          {{ visibleResources.length === 1 ? 'resource' : 'resources' }} found.</p
        >
      </div>
      <ul v-if="visibleResources.length" class="axon-resource-list">
        <ResourceRow v-for="resource in visibleResources" :key="resource.id" :resource="resource" />
      </ul>
      <div v-else class="axon-empty-state">
        <h3>No matching resources</h3>
        <p>Try a different search or reset the filters.</p>
        <button class="btn btn-outline-primary" type="button" @click="resetFilters"
          >Show all resources</button
        >
      </div>
    </section>
  </PageLayout>
</template>
