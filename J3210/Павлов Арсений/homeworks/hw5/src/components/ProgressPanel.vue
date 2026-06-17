<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const clampedValue = Math.max(0, Math.min(100, props.value));
</script>

<template>
  <section class="panel">
    <h2>Общий прогресс</h2>
    <div class="bar">
      <span :style="{ width: `${clampedValue}%` }" />
    </div>
    <p>{{ clampedValue }}%</p>
  </section>
</template>
