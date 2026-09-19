<script setup>
import { computed } from 'vue';
import { displaySize } from '../services/format.js';

const props = defineProps({ resource: { type: Object, required: true } });
const typeLabel = computed(() => (props.resource.type === 'dataset' ? 'Dataset' : 'Model'));
const sizeLabel = computed(() => displaySize(props.resource.sizeBytes));
</script>

<template>
  <li class="axon-resource-row">
    <span
      class="axon-resource-type"
      :class="{ 'axon-resource-type--dataset': resource.type === 'dataset' }"
      >{{ typeLabel }}</span
    >
    <h3>{{ resource.name }}</h3>
    <p>{{ resource.summary }}</p>
    <dl class="axon-metadata">
      <div
        ><dt>Task</dt><dd>{{ resource.task }}</dd></div
      >
      <div
        ><dt>Framework</dt><dd>{{ resource.framework }}</dd></div
      >
      <div
        ><dt>License</dt><dd>{{ resource.license }}</dd></div
      >
      <div
        ><dt>Size</dt><dd>{{ sizeLabel }}</dd></div
      >
    </dl>
  </li>
</template>
