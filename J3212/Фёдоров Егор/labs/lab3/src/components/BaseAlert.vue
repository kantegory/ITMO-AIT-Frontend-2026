<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
  },
})
</script>

<template>
  <div class="alert mb-0" :class="`alert-${type}`">
    <slot />
  </div>
</template>
