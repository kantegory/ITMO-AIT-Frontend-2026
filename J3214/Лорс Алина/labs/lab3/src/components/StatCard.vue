<template>
  <article class="metric-card card border-0 shadow-sm h-100">
    <div class="card-body">
      <div class="d-flex align-items-start justify-content-between gap-3">
        <div>
          <p class="text-secondary mb-1">{{ label }}</p>
          <h2 class="h3 mb-1">{{ value }}</h2>
          <span v-if="hint" class="small text-secondary">{{ hint }}</span>
        </div>
        <span class="metric-icon" aria-hidden="true"><IconSprite :name="icon" /></span>
      </div>
    </div>
  </article>
</template>

<script setup>
import IconSprite from './IconSprite.vue';

defineProps({
  label: String,
  value: [String, Number],
  hint: String,
  icon: {
    type: String,
    default: 'graph-up-arrow'
  }
});
</script>
