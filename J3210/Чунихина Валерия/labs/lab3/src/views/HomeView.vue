<template>
  <HeroSection />

  <div class="container my-5">
    <div class="row">
      <FilterSidebar
        :task="selectedTask"
        :license="selectedLicense"
        :frameworks="selectedFrameworks"
        :loading="loadingModels"
        @update:task="selectedTask = $event"
        @update:license="selectedLicense = $event"
        @toggle-framework="toggleFramework"
        @submit="applyFilters"
      />

      <main id="main-content" class="col-lg-9" tabindex="-1">
        <SearchBar
          v-model="search"
          :loading="loadingModels"
          @submit="applyFilters"
        />

        <ModelGrid
          :models="models"
          :loading="loadingModels"
          :error="modelsError"
        />
      </main>
    </div>
  </div>

  <TrendsSection
    :trends="trends"
    :loading="loadingTrends"
    :error="trendsError"
  />
</template>

<script setup>
import FilterSidebar from '@/components/home/FilterSidebar.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ModelGrid from '@/components/home/ModelGrid.vue'
import SearchBar from '@/components/home/SearchBar.vue'
import TrendsSection from '@/components/home/TrendsSection.vue'
import { useCatalog } from '@/composables/useCatalog'

const {
  search,
  selectedTask,
  selectedLicense,
  selectedFrameworks,
  models,
  trends,
  loadingModels,
  loadingTrends,
  modelsError,
  trendsError,
  toggleFramework,
  applyFilters
} = useCatalog()
</script>
