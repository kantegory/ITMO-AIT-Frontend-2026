<script setup>
import Icon from './Icon.vue';
import ResourceActions from './ResourceActions.vue';
import { displayLabel, displaySize } from '../services/filters.js';

defineProps({ resource: { type: Object, required: true } });
defineEmits(['changed']);
</script>
<template>
  <li class="axon-resource-row">
    <div class="axon-resource-title">
      <span
        class="axon-resource-tile"
        :class="{ 'axon-resource-tile--dataset': resource.type === 'dataset' }"
        ><Icon :name="resource.type === 'dataset' ? 'database' : 'box'"
      /></span>
      <div>
        <span
          class="axon-resource-type"
          :class="{ 'axon-resource-type--dataset': resource.type === 'dataset' }"
          >{{ resource.type === 'dataset' ? 'Dataset' : 'Model' }}</span
        >
        <h3>
          <RouterLink :to="`/resources/${resource.id}`">{{ resource.name }}</RouterLink>
        </h3>
      </div>
    </div>
    <p>{{ resource.summary }}</p>
    <div class="axon-resource-footer">
      <dl class="axon-row-metadata">
        <div v-for="key in ['task', 'framework', 'license']" :key="key">
          <dt>{{ key[0].toUpperCase() + key.slice(1) }}</dt>
          <dd>{{ displayLabel(key, resource[key]) }}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>{{ displaySize(resource.sizeBytes) }}</dd>
        </div>
      </dl>
      <ResourceActions :resource-id="resource.id" @changed="$emit('changed')" />
    </div>
  </li>
</template>
