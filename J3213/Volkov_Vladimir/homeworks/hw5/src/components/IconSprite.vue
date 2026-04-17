<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    :aria-hidden="ariaHidden ? 'true' : null"
  >
    <use :href="`/icons-sprite.svg#${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  width: {
    type: [String, Number],
    default: 18
  },
  height: {
    type: [String, Number],
    default: 18
  },
  ariaHidden: {
    type: Boolean,
    default: false
  }
})
</script>
