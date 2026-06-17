<template>
  <article class="stat-box">
    <h4>
      <SvgIcon :name="icon" size="lg" class="me-2"/>
      <slot name="value">0</slot>
    </h4>
    <p class="mb-0">
      <SvgIcon :name="subIcon" size="sm" class="me-1"/>
      <slot name="label">Текст</slot>
    </p>
  </article>
</template>

<script>
import SvgIcon from './icons/SvgIcon.vue'

export default {
  name: 'StatBox',
  components: { SvgIcon },
  props: {
    icon: { type: String, default: 'icon-chart' },
    subIcon: { type: String, default: 'icon-star' }
  }
}
</script>
