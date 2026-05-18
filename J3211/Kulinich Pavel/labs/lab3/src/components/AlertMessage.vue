<script setup>
defineProps({
  type: { type: String, default: 'info' },
  text: { type: String, default: '' }
});
</script>

<template>
  <div v-if="text" :class="`alert alert-${type} mb-0`" role="alert">
    {{ text }}
  </div>
</template>
