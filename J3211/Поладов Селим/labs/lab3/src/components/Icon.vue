<template>
  <svg
    :width="size"
    :height="size"
    :fill="fillAttr"
    :stroke="strokeAttr"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <use :href="`/img/icons.svg#icon-${name}`" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  solid: { type: Boolean, default: false }
})

const fillAttr = computed(() => props.solid ? 'currentColor' : 'none')
const strokeAttr = computed(() => props.solid ? undefined : 'currentColor')
</script>
