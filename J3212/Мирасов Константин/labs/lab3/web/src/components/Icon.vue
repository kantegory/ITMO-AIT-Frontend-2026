<script setup>
defineProps({ name: { type: String, required: true } });

const sprite = `${import.meta.env.BASE_URL}assets/icons.svg`;
</script>
<template>
  <svg class="axon-icon" aria-hidden="true" focusable="false">
    <use :href="`${sprite}#${name}`" />
  </svg>
</template>
