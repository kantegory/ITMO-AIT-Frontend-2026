<script setup>
import { ref, onMounted, computed } from 'vue'
import { useModels } from '@/composables/useModels'
import ModelCard from '@/components/model/ModelCard.vue'
import ModelFilters from '@/components/model/ModelFilters.vue'
import ModelPagination from '@/components/model/ModelPagination.vue'

const { 
  models, 
  loading, 
  error, 
  filteredModels, 
  getPaginatedModels, 
  totalPages, 
  currentPage, 
  setPage, 
  allTags,
  toggleLike,
  isLiked,
  fetchModels,
  applyFilters
} = useModels()

const searchQuery = ref('')
const selectedTag = ref('all')
const filters = ref({ categoryTags: [], dropdownTag: 'all', searchQuery: '' })

const handleFilterChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
  updateAppliedFilters()
}

const handleSearch = () => {
  filters.value.searchQuery = searchQuery.value
  updateAppliedFilters()
}

const handleTagChange = () => {
  filters.value.dropdownTag = selectedTag.value
  updateAppliedFilters()
}

const updateAppliedFilters = () => {
  applyFilters(filters.value)
}

const theme = computed(() => {
  return document.documentElement.getAttribute('data-theme') || 'dark'
})

const textClass = computed(() => {
  return theme.value === 'light' ? 'text-dark' : 'text-white'
})

onMounted(() => {
  fetchModels()
})
</script>

<template>
  <div class="explore-page container my-5">
    <div class="row">
      <ModelFilters 
        :model-tags="allTags" 
        @filter-change="handleFilterChange"
      />

      <section class="col-lg-9">
        <div class="input-group mb-4">
          <input 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
            type="text" 
            class="form-control"
            :class="{ 
              'bg-transparent text-white border-secondary': theme === 'dark',
              'bg-white text-dark border-secondary': theme === 'light'
            }"
            placeholder="Search models by name, tags or author..."
          >
          <button @click="handleSearch" class="btn btn-outline-info" type="button">
            Search
          </button>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold">Trending Models</h3>
          
          <select 
            v-model="selectedTag" 
            @change="handleTagChange"
            class="form-select w-auto"
            :class="{ 
              'bg-transparent text-white border-secondary': true
            }"
          >
            <option value="all" class="text-dark">All Tasks</option>
            <option v-for="tag in allTags" :key="tag" :value="tag" class="text-dark">
              {{ tag.replace(/-/g, ' ') }}
            </option>
          </select>
        </div>

        <div v-if="loading" class="row g-4 mb-5">
          <div class="col-12 text-center py-5">
            <div class="spinner-border text-info" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-white-50 mt-3 small">Fetching models from Hugging Face...</p>
          </div>
        </div>

        <div v-else-if="error" class="row g-4 mb-5">
          <div class="col-12 text-center py-5 text-danger">
            {{ error }}
          </div>
        </div>

        <div v-else class="row g-4 mb-5">
          <ModelCard
            v-for="model in getPaginatedModels()"
            :key="model.id"
            :model="model"
            :is-liked="isLiked(model.id)"
            @view-details="$router.push(`/model/${model.id}`)"
            @toggle-like="toggleLike"
          />
          
          <div v-if="getPaginatedModels().length === 0" class="col-12 text-center py-5 text-white-50">
            No models found matching your filters.
          </div>
        </div>

        <ModelPagination
          v-if="!loading && !error"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="setPage"
        />
      </section>
    </div>
  </div>
</template>