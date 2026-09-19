<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="notice">
    <strong>{{ title }}</strong>
    <p v-if="text">{{ text }}</p>
  </div>
</template>
