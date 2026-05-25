<script setup lang="ts">
import type { Priority } from '../types/domain';
import { priorityEmoji, priorityLabel } from '../utils/render';

const props = defineProps<{ priority: Priority; variant?: 'pill' | 'badge' }>();
</script>

<template>
  <span v-if="props.variant === 'badge'" :class="`badge priority-${priority}`">
    {{ priorityEmoji(priority) }} {{ priorityLabel(priority) }} приоритет
  </span>
  <span v-else :class="`priority ${priority}`">
    <span class="priority-dot" />{{ priorityLabel(priority) }}
  </span>
</template>
