<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div v-if="message" class="alert alert-danger text-start" role="alert">
    {{ message }}
  </div>
</template>
