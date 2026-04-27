<template>
  <div class="stat-box">
    <div class="h4 mb-0">{{ value }}</div>
    <p class="mb-0">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
});
</script>