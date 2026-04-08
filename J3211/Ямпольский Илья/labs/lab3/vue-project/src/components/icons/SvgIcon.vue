<template>
  <svg :class="['icon', `icon--${size}`]" aria-hidden="true">
    <use :href="`/svg/sprite.svg#${name}`" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    size: {
      type: String,
      default: 'md'
    }
  }
}
</script>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: middle;
  display: inline-block;
}
</style>
