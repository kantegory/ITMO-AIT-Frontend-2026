<template>
  <div class="card card-metric" :class="dark ? 'dark' : 'light'">
    <div class="small" :class="dark ? 'opacity-75' : 'text-muted'">{{ label }}</div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  dark: { type: Boolean, default: false }
})
</script>
