<script setup>
import { computed, onMounted } from 'vue'
import { useDestinations } from '@/composables/useDestinations.js'
import { useDestinationFilters } from '@/composables/useDestinationFilters.js'
import { useFavorites } from '@/composables/useFavorites.js'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'
import DestinationCard from '@/components/DestinationCard.vue'

const { loadDestinations, isLoading } = useDestinations()
const { state, filtered, visible, pageCount, setSort, setPage, reset } = useDestinationFilters(6)
const { isFavorite, add, loadFavorites } = useFavorites()
const { isAuthenticated } = useAuth()
const { showToast } = useToast()

const sortOptions = [
  { value: 'rating-desc', label: 'Сначала лучшие' },
  { value: 'rating-asc', label: 'Сначала ниже рейтинг' },
  { value: 'budget-asc', label: 'Сначала дешевле' },
  { value: 'budget-desc', label: 'Сначала дороже' },
  { value: 'duration-asc', label: 'Короткие поездки' },
  { value: 'duration-desc', label: 'Длинные поездки' }
]

const pages = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1))

async function onSave(destinationId) {
  if (!isAuthenticated.value) {
    showToast('Сначала войдите, чтобы сохранять направления', 'info')
    return
  }
  try {
    await add(destinationId)
    showToast('Направление сохранено в избранное', 'success')
  } catch {
    showToast('Не удалось сохранить направление', 'error')
  }
}

onMounted(async () => {
  await loadDestinations()
  if (isAuthenticated.value) await loadFavorites()
})
</script>

<template>
  <div>
    <section class="page-header">
      <div class="container">
        <div class="page-header-card">
          <h1 class="section-title-sm mb-2">Каталог направлений</h1>
          <p>Ищите маршруты по названию, типу отдыха, бюджету и длительности. Используйте фильтры и сортировку, чтобы быстро найти подходящий вариант.</p>
        </div>
      </div>
    </section>

    <section class="pb-5">
      <div class="container">
        <div class="row g-4 align-items-start">
          <div class="col-lg-4">
            <aside class="filter-card">
              <h2 class="h3 mb-3">Фильтры</h2>
              <div class="mb-3">
                <label class="form-label" for="searchDestination">Поиск по названию</label>
                <input
                  id="searchDestination"
                  v-model="state.query"
                  class="form-control"
                  type="text"
                  placeholder="Например: Казань"
                  @input="state.currentPage = 1"
                />
              </div>
              <div class="mb-3">
                <label class="form-label" for="filterType">Тип</label>
                <select
                  id="filterType"
                  v-model="state.type"
                  class="form-select"
                  @change="state.currentPage = 1"
                >
                  <option value="all">Все</option>
                  <option value="city">Город</option>
                  <option value="nature">Природа</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label" for="filterBudget">Бюджет</label>
                <select
                  id="filterBudget"
                  v-model="state.budget"
                  class="form-select"
                  @change="state.currentPage = 1"
                >
                  <option value="any">Любой</option>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="form-label" for="filterDuration">Длительность</label>
                <select
                  id="filterDuration"
                  v-model="state.duration"
                  class="form-select"
                  @change="state.currentPage = 1"
                >
                  <option value="any">Любая</option>
                  <option value="1-3">1-3 дня</option>
                  <option value="4-7">4-7 дней</option>
                  <option value="8+">8+ дней</option>
                </select>
              </div>
              <button class="btn btn-outline-primary w-100" type="button" @click="reset">Сбросить фильтры</button>
            </aside>
          </div>

          <div class="col-lg-8">
            <div class="results-toolbar mb-4">
              <p class="result-count">Найдено направлений: {{ filtered.length }}</p>
              <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {{ state.sortLabel }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li v-for="option in sortOptions" :key="option.value">
                    <a
                      class="dropdown-item"
                      :class="{ active: state.sort === option.value }"
                      href="#"
                      @click.prevent="setSort(option.value, option.label)"
                    >
                      {{ option.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="isLoading && !visible.length" class="empty-state">
              <i class="bi bi-arrow-repeat" />
              <h3 class="h4">Загружаем каталог…</h3>
              <p class="text-secondary mb-0">Подождите немного.</p>
            </div>

            <div v-else-if="visible.length" class="catalog-grid">
              <DestinationCard
                v-for="destination in visible"
                :key="destination.id"
                :destination="destination"
                :is-favorite="isFavorite(destination.id)"
                @save="onSave"
              />
            </div>

            <div v-else class="empty-state mt-4">
              <i class="bi bi-search" />
              <h3 class="h4">Ничего не найдено</h3>
              <p class="text-secondary mb-0">Измените фильтры или выполните сброс, чтобы снова увидеть варианты направлений.</p>
            </div>

            <nav v-if="pageCount > 1" class="mt-4" aria-label="Pagination">
              <ul class="pagination justify-content-center mb-0">
                <li
                  v-for="pageNumber in pages"
                  :key="pageNumber"
                  class="page-item"
                  :class="{ active: state.currentPage === pageNumber }"
                >
                  <a class="page-link" href="#" @click.prevent="setPage(pageNumber)">{{ pageNumber }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
