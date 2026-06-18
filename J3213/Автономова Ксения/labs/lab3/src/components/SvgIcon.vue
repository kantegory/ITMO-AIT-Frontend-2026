<template>
  <svg class="icon" :class="customClass" aria-hidden="true">
    <use :href="`/icons/sprite.svg#${name}`"></use>
  </svg>
</template>
<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>
