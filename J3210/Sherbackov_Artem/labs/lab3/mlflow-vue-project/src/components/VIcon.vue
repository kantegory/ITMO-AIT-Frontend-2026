<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: [Number, String],
    default: 24
  },
  height: {
    type: [Number, String],
    default: 24
  }
});
</script>

<template>
  <svg :width="width" :height="height" aria-hidden="true">
    <use :href="`/img/sprite.svg#${name}`"></use>
  </svg>
</template>