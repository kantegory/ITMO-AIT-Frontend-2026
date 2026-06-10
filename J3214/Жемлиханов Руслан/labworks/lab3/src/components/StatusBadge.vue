<template>
  <span class="badge" :class="`text-bg-${statusClass(status)}`">{{ status }}</span>
</template>

<script setup>
import { useStatus } from '../composables/useStatus';

defineProps({
  status: {
    type: String,
    required: true
  }
});

const { statusClass } = useStatus();
</script>
