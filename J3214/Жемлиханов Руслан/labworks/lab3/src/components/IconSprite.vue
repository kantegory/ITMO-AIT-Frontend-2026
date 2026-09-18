<template>
  <svg class="icon" :class="sizeClass" aria-hidden="true" focusable="false">
    <use :href="`/assets/icons.svg#${name}`" />
  </svg>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  }
});

const sizeClass = {
  sm: 'icon-sm',
  md: '',
  lg: 'icon-lg'
}[props.size];
</script>
