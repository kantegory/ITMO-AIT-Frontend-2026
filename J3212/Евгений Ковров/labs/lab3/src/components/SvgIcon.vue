<template>
  <svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <use :href="symbolHref" :xlink:href="symbolHref"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

const symbolHref = computed(() => `/assets/icons/sprite.svg#${props.name}`);
</script>
