<template>
  <div class="col-12 col-md-4">
    <section class="card p-4 h-100 shadow-sm border-0">
      <h2 class="text-muted small fw-bold text-uppercase h6">{{ title }}</h2>
      <slot/>
    </section>
  </div>
</template>

<script setup>
defineProps(['title'])
</script>