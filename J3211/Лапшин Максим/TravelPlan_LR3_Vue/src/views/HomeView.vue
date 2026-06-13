<script setup>
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import TourCard from '@/components/TourCard.vue'
import TourFilters from '@/components/TourFilters.vue'
import { useTours } from '@/composables/useTours'

const { filteredTours, filterOptions, filters, loading, error, loadData, resetFilters } = useTours()
</script>

<template>
  <header class="hero-header px-4 mb-4">
    <h1 class="display-6 fw-bold">Найдите своё путешествие</h1>
    <p class="lead mb-0">Города, природа, культура и пляжный отдых — выберите подходящий маршрут.</p>
  </header>

  <TourFilters :model="filters" :options="filterOptions" @reset="resetFilters" />

  <div v-if="error" class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
    <span>{{ error }}</span>
    <button type="button" class="btn btn-sm btn-danger" @click="loadData">Повторить</button>
  </div>
  <LoadingSpinner v-else-if="loading" />
  <section v-else aria-label="Найденные туры">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 mb-0">Доступные туры</h2>
      <span class="text-muted">Найдено: {{ filteredTours.length }}</span>
    </div>
    <p v-if="!filteredTours.length" class="card p-5 text-center text-muted">По вашему запросу туров не найдено.</p>
    <div v-else class="row g-4">
      <div v-for="(tour, index) in filteredTours" :key="tour.id" :class="index === 0 ? 'col-12' : 'col-md-6 col-xl-4'">
        <TourCard :tour="tour" :featured="index === 0" />
      </div>
    </div>
  </section>
</template>
