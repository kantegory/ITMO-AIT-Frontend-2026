<template>
  <div>
    <TheNavbar />

    <main id="main-content">
      <!-- Промо-раздел Hero -->
      <section class="hero-section d-flex align-items-center" aria-label="Промо-раздел">
        <div class="container-fluid custom-container position-relative z-1 px-4 px-md-5">
          <div class="row align-items-center py-5">
            <div class="col-lg-6 col-xl-6 text-center text-lg-start">
              <span class="badge-premium">Межпланетные путешествия</span>
              <h1 class="hero-title display-2 mb-4">
                Открой для себя<br>
                <span class="fw-light text-muted-custom">Глубокий Космос</span>
              </h1>
              <p class="hero-subtitle mb-5 mx-auto mx-lg-0" style="max-width: 500px;">
                Премиальные туристические маршруты на Луну, Марс и Энцелад. Почувствуйте невесомость и взгляните на Вселенную по-новому.
              </p>

              <TourSearchPanel
                :filters="filters"
                @update:filter="onFilterChange"
                @search="scrollToCatalog"
              />
            </div>

            <div class="col-lg-6 col-xl-6 mt-5 mt-lg-0">
              <PlanetPreview :destination="filters.destination" />
            </div>
          </div>
        </div>
      </section>

      <!-- Каталог экспедиций -->
      <section id="catalog" ref="catalogSection" class="py-5" aria-labelledby="catalogTitle">
        <div class="container-fluid custom-container px-4 px-md-5">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span class="badge-premium">Реестр полетов</span>
              <h2 id="catalogTitle" class="display-6 fw-bold text-main mb-0">Доступные экспедиции</h2>
            </div>
            <div class="mt-3 mt-md-0 d-flex gap-2">
              <button type="button" class="btn btn-glass fs-7 py-2 px-3" @click="resetFilters">
                Показать все миссии
              </button>
            </div>
          </div>

          <!-- Индикатор загрузки -->
          <div v-if="isLoading" class="col-12 text-center py-5" role="status">
            <div class="spinner-border text-light mb-3" role="status">
              <span class="visually-hidden">Установка связи с базой данных...</span>
            </div>
            <p class="text-muted-custom fs-7 letter-spacing-2 text-uppercase">
              Установка связи с базой данных...
            </p>
          </div>

          <!-- Ошибка загрузки -->
          <div v-else-if="error" class="col-12 text-center py-5" role="alert">
            <p class="text-danger mb-2">Ошибка подключения к бортовой сети (json-server не отвечает).</p>
            <p class="text-muted-custom fs-7">Убедитесь, что сервер запущен командой npm run server</p>
          </div>

          <!-- Сообщение "Ничего не найдено" -->
          <div v-else-if="filteredTours.length === 0" class="glass-panel text-center p-5" role="status" aria-live="polite">
            <h3 class="text-main mb-2 fs-5">Экспедиций не найдено</h3>
            <p class="text-muted-custom mb-4">
              По выбранным параметрам нет доступных стартовых окон. Попробуйте изменить фильтры.
            </p>
            <button type="button" class="btn btn-accent py-2 px-4" @click="resetFilters">
              Сбросить фильтры
            </button>
          </div>

          <!-- Сетка карточек -->
          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" aria-live="polite">
            <TourCard
              v-for="tour in filteredTours"
              :key="tour.id"
              :tour="tour"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import TheNavbar from '../components/common/TheNavbar.vue'
import PlanetPreview from '../components/home/PlanetPreview.vue'
import TourSearchPanel from '../components/home/TourSearchPanel.vue'
import TourCard from '../components/home/TourCard.vue'
import { toursApi } from '../api/tours'

const tours = ref([])
const isLoading = ref(true)
const error = ref(null)
const catalogSection = ref(null)

const filters = reactive({
  destination: '',
  duration: '',
  budget: ''
})

const onFilterChange = ({ key, value }) => {
  filters[key] = value
}

const resetFilters = () => {
  filters.destination = ''
  filters.duration = ''
  filters.budget = ''
}

const scrollToCatalog = () => {
  catalogSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const filteredTours = computed(() => {
  return tours.value.filter(tour => {
    const matchDest = !filters.destination || tour.destination === filters.destination
    const matchDur = !filters.duration || tour.duration === filters.duration
    const matchBud = !filters.budget || tour.budget === filters.budget
    return matchDest && matchDur && matchBud
  })
})

onMounted(async () => {
  try {
    isLoading.value = true
    tours.value = await toursApi.getAll()
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
})
</script>