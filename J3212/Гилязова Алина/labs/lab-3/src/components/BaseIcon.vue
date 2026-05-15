<template>
  <svg :class="['ui-icon', className]" aria-hidden="true" focusable="false">
    <use :href="`/icons.svg#${name}`" :xlink:href="`/icons.svg#${name}`" />
  </svg>
</template>

<script>


export default {
  name: 'BaseIcon',
  props: {
    name: { type: String, required: true },
    className: { type: String, default: '' }
  }
}

</script>
