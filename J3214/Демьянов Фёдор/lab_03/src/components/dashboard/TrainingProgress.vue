<template>
  <section class="bento-card p-4 p-md-5" aria-labelledby="trainingHeading">
    <h2 id="trainingHeading" class="text-uppercase letter-spacing-2 text-muted-custom fs-7 mb-4">
      Предполетные нормативы
    </h2>

    <div class="mb-4">
      <div class="d-flex justify-content-between mb-2 fs-7">
        <span class="text-main" id="norm1Label">Тест на центрифуге (до 4.5G)</span>
        <span class="text-main fw-bold">{{ progress?.centrifuge || 100 }}%</span>
      </div>
      <div class="progress" style="height: 6px;">
        <div
          class="progress-bar progress-bar-blue-1"
          role="progressbar"
          :style="{ width: `${progress?.centrifuge || 100}%` }"
          :aria-valuenow="progress?.centrifuge || 100"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-labelledby="norm1Label"
        ></div>
      </div>
    </div>

    <div class="mb-4">
      <div class="d-flex justify-content-between mb-2 fs-7">
        <span class="text-main" id="norm2Label">Инструктаж по шлюзованию</span>
        <span class="text-main fw-bold">{{ progress?.docking || 80 }}%</span>
      </div>
      <div class="progress" style="height: 6px;">
        <div
          class="progress-bar progress-bar-blue-2"
          role="progressbar"
          :style="{ width: `${progress?.docking || 80}%` }"
          :aria-valuenow="progress?.docking || 80"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-labelledby="norm2Label"
        ></div>
      </div>
    </div>

    <div>
      <div class="d-flex justify-content-between mb-2 fs-7">
        <span class="text-main" id="norm3Label">Индивидуальная подгонка скафандра</span>
        <span class="text-main fw-bold">{{ progress?.suitFitting || 50 }}%</span>
      </div>
      <div class="progress" style="height: 6px;">
        <div
          class="progress-bar progress-bar-blue-3"
          role="progressbar"
          :style="{ width: `${progress?.suitFitting || 50}%` }"
          :aria-valuenow="progress?.suitFitting || 50"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-labelledby="norm3Label"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  progress: {
    type: Object,
    default: () => ({ centrifuge: 100, docking: 80, suitFitting: 50 })
  }
})
</script>