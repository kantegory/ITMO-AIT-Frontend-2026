<script setup lang="ts">
import { computed } from 'vue';
import type { TaskStatus } from '../types/domain';
import { statusLabel } from '../utils/render';

const props = defineProps<{ status: TaskStatus; variant?: 'pill' | 'badge' }>();

const cls = computed(() =>
  props.variant === 'badge' ? `badge status-${props.status}` : `status-badge ${props.status}`,
);
</script>

<template>
  <span :class="cls">{{ statusLabel(status) }}</span>
</template>
