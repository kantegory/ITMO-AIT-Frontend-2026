<template>
  <article class="card h-100">
    <div class="card-body">
      <h2 class="text-secondary small mb-1">{{ label }}</h2>
      <p class="fs-3 fw-bold mb-0">{{ value }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
});
</script>
