<template>
  <section class="glass-panel p-4 p-md-5 mb-5" aria-labelledby="specsHeading">
    <h2 id="specsHeading" class="text-uppercase letter-spacing-2 fs-6 text-main mb-4">
      Технические параметры полета
    </h2>
    <div class="row g-4">
      <div class="col-sm-6 col-md-3">
        <div class="text-muted-custom fs-7 text-uppercase letter-spacing-2 mb-1">Дистанция</div>
        <div class="fs-4 fw-medium text-main">{{ specs.distance }}</div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="text-muted-custom fs-7 text-uppercase letter-spacing-2 mb-1">Гравитация</div>
        <div class="fs-4 fw-medium text-main">{{ specs.gravity }}</div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="text-muted-custom fs-7 text-uppercase letter-spacing-2 mb-1">Перегрузка</div>
        <div class="fs-4 fw-medium text-main">{{ specs.gforce }}</div>
      </div>
      <div class="col-sm-6 col-md-3">
        <div class="text-muted-custom fs-7 text-uppercase letter-spacing-2 mb-1">Радиация</div>
        <div class="fs-4 fw-medium text-main">{{ specs.radiation }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  specs: {
    type: Object,
    required: true
  }
})
</script>