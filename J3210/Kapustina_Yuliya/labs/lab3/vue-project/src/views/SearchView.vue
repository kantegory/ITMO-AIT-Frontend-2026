<template>
  <main class="container mt-4">
    <header class="mb-4">
      <h1>Поиск фанфиков</h1>
    </header>

    <section class="row">
      <aside class="col-md-3">
        <div class="filter-box">
          <h2 class="h5">Фильтры</h2>

          <div class="mb-3">
            <label class="form-label" for="filter-title">Название</label>
            <input
              id="filter-title"
              class="form-control"
              v-model="filters.title"
              placeholder="Введите название"
              @keypress.enter="applyFilters"
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="filter-fandom">Фандом</label>
            <select id="filter-fandom" class="form-select" v-model="filters.fandom">
              <option value="">Любой</option>
              <option v-for="fandom in fandoms" :key="fandom" :value="fandom">
                {{ fandom }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label" for="filter-rating">Рейтинг</label>
            <select id="filter-rating" class="form-select" v-model="filters.rating">
              <option value="">Любой</option>
              <option v-for="rating in ratings" :key="rating" :value="rating">
                {{ rating }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label" for="filter-status">Статус</label>
            <select id="filter-status" class="form-select" v-model="filters.status">
              <option value="">Любой</option>
              <option v-for="status in statuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <button class="btn btn-main w-100" @click="applyFilters">Найти</button>
          <button class="btn btn-outline-secondary w-100 mt-2" @click="resetFilters">
            Сбросить
          </button>
        </div>
      </aside>

      <section class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <p class="text-muted mb-0">
            Найдено: {{ filteredFics.length }} фанфиков
          </p>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else>
          <FicCardDetailed
            v-for="fic in filteredFics"
            :key="fic.id"
            :fic="fic"
          />
          <p v-if="filteredFics.length === 0" class="text-center text-muted py-5">
            Ничего не найдено
          </p>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSearch } from '@/composables/useSearch'
import FicCardDetailed from '@/components/FicCardDetailed.vue'

const route = useRoute()
const {
  loading,
  filters,
  fandoms,
  ratings,
  statuses,
  filteredFics,
  loadAllFics,
  resetFilters,
  setSearchQuery
} = useSearch()

function applyFilters() {
  loadAllFics()
}

onMounted(async () => {
  const query = route.query.q
  if (query) {
    setSearchQuery(query)
  }
  await loadAllFics()
})
</script>