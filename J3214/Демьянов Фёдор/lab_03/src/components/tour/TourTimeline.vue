<template>
  <section class="glass-panel p-4 p-md-5 mb-5" aria-labelledby="timelineHeading">
    <h2 id="timelineHeading" class="text-uppercase letter-spacing-2 fs-6 text-main mb-4">
      График экспедиции
    </h2>
    <div class="border-start border-secondary border-opacity-50 ps-4 ms-2">
      <div
        v-for="(step, index) in timeline"
        :key="index"
        :class="['position-relative', { 'mb-4': index !== timeline.length - 1 }]"
      >
        <i
          :class="['bi bi-circle-fill position-absolute top-0 start-0 translate-middle', index === timeline.length - 1 ? 'text-main' : 'text-secondary']"
          :style="{ fontSize: index === timeline.length - 1 ? '10px' : '8px' }"
          aria-hidden="true"
        ></i>
        <h3 class="text-main fs-6 mb-1">{{ step.time }} // {{ step.title }}</h3>
        <p class="text-muted-custom fs-7 mb-0">{{ step.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  timeline: {
    type: Array,
    default: () => []
  }
})
</script>