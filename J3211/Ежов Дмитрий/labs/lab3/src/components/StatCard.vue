<script setup lang="ts">
defineProps<{
  label: string;
  value: number | string;
  sub: string;
  tone: 'violet' | 'green' | 'yellow' | 'red';
}>();
</script>

<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div :class="['stat-value', tone]">{{ value }}</div>
    <div class="stat-sub">{{ sub }}</div>
  </div>
</template>
