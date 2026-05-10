<template>
  <svg :class="classes" aria-hidden="true" focusable="false">
    <use :href="`/assets/icons/sprite.svg#${name}`" />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
});

const classes = computed(() => ["icon", props.className].filter(Boolean).join(" "));
</script>

