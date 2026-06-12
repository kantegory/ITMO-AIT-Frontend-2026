<template>
  <svg
      class="icon"
      :class="iconClass"
      :width="computedSize"
      :height="computedSize"
      aria-hidden="true"
  >
    <use :href="spritePath"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
  lg: { type: Boolean, default: false },
  xl: { type: Boolean, default: false },
  xxl: { type: Boolean, default: false }
})

const iconClass = computed(() => ({
  'icon-lg': props.lg,
  'icon-xl': props.xl,
  'icon-xxl': props.xxl
}))

const computedSize = computed(() => {
  if (props.lg) return 32
  if (props.xl) return 48
  if (props.xxl) return 64
  return props.size
})

const spritePath = computed(() => `/images/sprite.svg#icon-${props.name}`)
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  stroke: currentColor;
  flex-shrink: 0;
}
</style>