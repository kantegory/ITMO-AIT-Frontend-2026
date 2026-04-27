<template>
  <div v-if="message" class="alert mb-3" :class="`alert-${type}`">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: 'info',
  },
});
</script>