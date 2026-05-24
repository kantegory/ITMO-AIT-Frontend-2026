<template>
  <section aria-labelledby="resultsTitle">
    <h2 id="resultsTitle" class="visually-hidden">Результаты поиска</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status" aria-hidden="true"></div>
      <p class="mt-2 text-muted mb-0">Загружаем результаты поиска...</p>
    </div>

    <p v-else-if="error" class="text-danger py-4 mb-0">{{ error }}</p>

    <p v-else-if="!models.length" class="text-muted py-4 mb-0">
      По вашему запросу ничего не найдено.
    </p>

    <div v-else class="row g-4">
      <div
        v-for="(model, index) in models"
        :key="model.id"
        :class="getGridClass(index)"
      >
        <ModelCard
          :title="model.title"
          :description="model.description"
          :type="model.type"
          :button-text="model.buttonText"
          :downloads="model.downloads"
          :meta="model.meta"
          :to="model.to"
          :variant="getCardVariant(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ModelCard from '@/components/home/ModelCard.vue'

defineProps({
  models: {
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

function getGridClass(index) {
  if (index < 2) {
    return 'col-12 col-lg-6'
  }

  if (index < 5) {
    return 'col-12 col-md-6 col-lg-4'
  }

  return 'col-12 col-md-6 col-lg-3'
}

function getCardVariant(index) {
  if (index < 2) return 'featured'
  if (index < 5) return 'standard'
  return 'compact'
}
</script>
