<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLoad } from '../composables/useLoad.js';
import { getRankedResources } from '../services/resources.js';
import { matchesResource, readFilters } from '../services/filters.js';
import ResourceFilters from '../components/ResourceFilters.vue';
import ResourceRow from '../components/ResourceRow.vue';
import Icon from '../components/Icon.vue';

const route = useRoute();
const router = useRouter();
const { data, loading, error, reload } = useLoad(() => getRankedResources());
const filters = computed(() => readFilters(route.query));
const visible = computed(() =>
  (data.value || []).filter((resource) => matchesResource(resource, filters.value)),
);

function apply(filters) {
  router.push({
    path: '/explore',
    query: Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
  });
}
</script>
<template>
  <section class="axon-explore-intro">
    <div>
      <p class="axon-eyebrow">The resource library</p>
      <h1 tabindex="-1">Find your next starting point.</h1>
      <p>
        Explore models and datasets. Compare the details, inspect the examples, and make something
        of your own.
      </p>
    </div>
    <Icon name="resource-network" class="axon-library-mark" />
  </section>
  <ResourceFilters :filters="filters" @apply="apply" />
  <section id="resource-results" aria-labelledby="results-heading" :aria-busy="loading">
    <div class="axon-results-heading">
      <h2 id="results-heading">
        Explore resources <span class="axon-sort-label">Most starred</span>
      </h2>
      <p role="status">
        {{
          loading
            ? 'Loading resources…'
            : error
              ? 'Resources unavailable.'
              : `${visible.length} resources found.`
        }}
      </p>
    </div>
    <div v-if="error" role="alert">
      <p>{{ error.message }}</p>
      <button class="btn btn-outline-primary" @click="reload">Retry resources</button>
    </div>
    <ul v-else-if="visible.length" class="axon-resource-list">
      <ResourceRow v-for="resource in visible" :key="resource.id" :resource="resource" />
    </ul>
    <div v-else-if="!loading" class="axon-empty-state">
      <h3>No matching resources</h3>
      <p>Change your search or reset the filters.</p>
    </div>
  </section>
</template>
