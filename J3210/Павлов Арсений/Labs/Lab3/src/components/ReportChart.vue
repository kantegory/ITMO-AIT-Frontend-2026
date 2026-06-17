<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  formatValue: {
    type: Function,
    required: true,
  },
});

const maxValue = computed(() => {
  const values = props.items.map((item) => Number(item.value) || 0);
  return Math.max(...values, 1);
});

function getWidth(value) {
  return Math.max(8, Math.round(((Number(value) || 0) / maxValue.value) * 100));
}
</script>

<template>
  <div class="report-chart" aria-live="polite">
    <div v-for="item in items" :key="item.key" class="report-bar-row">
      <span>{{ item.key }}</span>
      <div class="report-bar-wrap" role="img" :aria-label="`${item.key}: ${item.value}`">
        <span class="report-bar" :style="{ width: `${getWidth(item.value)}%` }"></span>
      </div>
      <span class="report-value">{{ formatValue(item.value) }}</span>
    </div>
  </div>
</template>
