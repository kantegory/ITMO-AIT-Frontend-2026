<script setup>
defineProps({
  type: {
    type: String,
    default: 'info'
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div v-if="message" :class="`alert alert-${type}`" :role="type === 'danger' || type === 'warning' ? 'alert' : 'status'">
    {{ message }}
  </div>
</template>
