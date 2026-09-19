<script setup>
import { displayLabel, displaySize } from '../services/filters.js';

defineProps({ resource: { type: Object, required: true } });
</script>
<template>
  <aside class="axon-panel">
    <h2>Resource information</h2>
    <dl>
      <template v-for="key in ['task', 'framework', 'license']" :key="key"
        ><dt class="text-capitalize">{{ key }}</dt>
        <dd>{{ displayLabel(key, resource[key]) }}</dd></template
      >
      <dt>Size</dt>
      <dd>{{ displaySize(resource.sizeBytes) }}</dd>
      <dt>Version</dt>
      <dd>{{ resource.revision }}</dd>
    </dl>
    <p v-if="resource.tags?.length">Tags: {{ resource.tags.join(', ') }}</p>
  </aside>
</template>
