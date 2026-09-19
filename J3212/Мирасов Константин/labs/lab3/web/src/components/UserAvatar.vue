<script setup>
import { computed } from 'vue';

const props = defineProps({ name: { type: String, default: '' }, small: Boolean });
const initials = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean);

  return (
    words
      .slice(0, 2)
      .map((word) => Array.from(word)[0])
      .join('')
      .toLocaleUpperCase() || '?'
  );
});
</script>
<template>
  <span class="axon-avatar" :class="{ 'axon-avatar--small': small }" aria-hidden="true">{{
    initials
  }}</span>
</template>
