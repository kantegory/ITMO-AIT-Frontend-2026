<script setup>
defineProps({
  name: { type: String, required: true },
  className: { type: String, default: 'icon' },
});
</script>

<template>
  <svg :class="className" aria-hidden="true">
    <use :href="`/icons/sprite.svg#${name}`" />
  </svg>
</template>
