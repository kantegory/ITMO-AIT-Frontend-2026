<template>
  <svg class="sprite-icon" aria-hidden="true" focusable="false">
    <use :href="`/assets/icons.svg#icon-${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
});
</script>
