<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'neutral',
  },
});

const toneClass = computed(() => `delta ${props.tone}`);
</script>

<template>
  <article class="glass-card card-stat h-100">
    <p class="text-muted-custom mb-1">{{ label }}</p>
    <p class="value mb-1">{{ value }}</p>
    <p v-if="hint" class="mb-0" :class="toneClass">{{ hint }}</p>
  </article>
</template>
