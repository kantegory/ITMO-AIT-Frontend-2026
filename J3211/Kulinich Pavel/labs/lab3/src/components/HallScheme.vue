<script setup>
const sectors = ['A', 'B', 'C', 'D'];
</script>

<template>
  <section class="hall-schema rounded-4 p-4 text-center">
    <div class="scene mb-4">СЦЕНА</div>
    <div class="row g-2 justify-content-center">
      <div v-for="sector in sectors" :key="sector" class="col-3 col-md-2">
        <div class="seat-block">{{ sector }}</div>
      </div>
    </div>
  </section>
</template>
