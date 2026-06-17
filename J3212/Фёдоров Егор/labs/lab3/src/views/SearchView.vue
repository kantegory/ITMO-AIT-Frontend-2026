<script setup>
import { onMounted } from 'vue'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import ResultCard from '@/components/ResultCard.vue'
import SearchFilters from '@/components/SearchFilters.vue'
import { useHubSearch } from '@/composables/useHubSearch'

const {
  query,
  type,
  sortKey,
  sortedResults,
  loading,
  error,
  statusText,
  loadResults,
} = useHubSearch()

onMounted(() => {
  loadResults()
})
</script>

<template>
  <main class="container py-4 d-flex flex-column gap-4">
    <section class="hero-panel">
      <div class="row g-4 align-items-center">
        <div class="col-lg-8">
          <span class="hero-badge mb-3">Hugging Face Hub</span>
          <h1 class="fw-bold mt-3 mb-2 page-title">Поиск моделей и датасетов</h1>
          <p class="muted mb-0">
            Найдите модель или датасет, откройте карточку, добавьте в избранное и оставьте комментарий.
          </p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <div class="text-muted small">Найдено элементов</div>
          <div class="stat-value">{{ sortedResults.length }}</div>
        </div>
      </div>
    </section>

    <section class="row g-4">
      <aside class="col-12 col-lg-3">
        <SearchFilters
          v-model:query="query"
          v-model:type="type"
          v-model:sort-key="sortKey"
          @search="loadResults"
        />
      </aside>

      <section class="col-12 col-lg-9 d-flex flex-column gap-4">
        <BaseAlert :type="error ? 'danger' : 'success'">{{ statusText }}</BaseAlert>
        <BaseLoader v-if="loading" />

        <div v-else-if="sortedResults.length" class="row g-4">
          <div v-for="item in sortedResults" :key="`${item.resourceType}-${item.id}`" class="col-12 col-md-6 col-xl-4">
            <ResultCard :item="item" />
          </div>
        </div>

        <div v-else class="hub-card">Ничего не найдено.</div>
      </section>
    </section>
  </main>
</template>
