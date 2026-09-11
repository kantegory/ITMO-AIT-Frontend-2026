<template>
  <svg class="icon" aria-hidden="true">
    <use :href="`/img/sprite.svg#icon-${name}`" />
  </svg>
</template>

<script>
export default {
  name: 'IconComponent',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>
