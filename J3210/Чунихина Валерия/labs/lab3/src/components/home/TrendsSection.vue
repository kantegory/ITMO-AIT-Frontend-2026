<template>
  <section class="container my-5 py-5 border-top" aria-labelledby="trendsTitle">
    <div class="d-flex align-items-center mb-4">
      <h2 id="trendsTitle" class="h3 fw-bold mb-0">Мировые тренды</h2>
      <span class="badge bg-soft-blue text-primary ms-3" aria-label="Данные обновляются в реальном времени">
        Live Data
      </span>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status" aria-hidden="true"></div>
      <p class="mt-2 text-muted mb-0">Ищем лучшие модели в мире...</p>
    </div>

    <p v-else-if="error" class="text-danger py-4 mb-0">{{ error }}</p>

    <div v-else class="row g-4">
      <div
        v-for="trend in trends"
        :key="trend.id"
        class="col-md-6 col-xl-4"
      >
        <ModelCard
          :title="trend.title"
          :description="trend.description"
          :type="trend.type"
          button-text="Открыть"
          :downloads="trend.downloads"
          :meta="trend.meta"
          :to="trend.to"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ModelCard from '@/components/home/ModelCard.vue'

defineProps({
  trends: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})
</script>
