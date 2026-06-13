<script setup>
defineProps(['title', 'value', 'accent'])
</script>

<template>
  <div class="dashboard-card stat-card" :class="{ 'yellow-card': accent }">
    <p>{{ title }}</p>
    <h3>{{ value }}</h3>
  </div>
</template>