<template>
  <div class="mb-2">
    <span>{{ label }}</span>
    <div class="progress" style="height:20px;">
      <div class="progress-bar" :class="colorClass" :style="{ width: percent + '%' }">
        {{ percent }}%
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['label', 'percent', 'colorClass'])
</script>