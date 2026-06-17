<template>
  <BaseLayout>
    <AppNavbar />

    <section class="mb-4">
      <h1 class="fw-bold mb-3">Поиск путешествий</h1>
      <p class="text-muted">
        Ниже загружаются направления из твоего db.json через axios.
      </p>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-md-4">
        <label class="form-label">Тип</label>
        <select v-model="typeFilter" class="form-select">
          <option value="all">Все</option>
          <option value="city">Город</option>
          <option value="nature">Природа</option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Максимальный бюджет</label>
        <input
          v-model="budgetFilter"
          type="number"
          class="form-control"
          placeholder="Например, 700"
        >
      </div>

      <div class="col-md-4">
        <label class="form-label">Длительность</label>
        <select v-model="daysFilter" class="form-select">
          <option value="all">Любая</option>
          <option value="1-3">1–3 дня</option>
          <option value="4-7">4–7 дней</option>
          <option value="8+">8+ дней</option>
        </select>
      </div>
    </section>

    <div v-if="loading" class="alert alert-light border">Загрузка направлений...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <section v-else class="row g-4">
      <div v-for="place in filteredPlaces" :key="place.id" class="col-md-6 col-xl-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <span class="badge text-bg-light border align-self-start mb-2">
              {{ place.type === 'city' ? 'Город' : 'Природа' }}
            </span>

            <h3 class="h5">{{ place.title }}</h3>
            <p class="text-muted mb-2">
              {{ place.days }} дн. · до {{ place.budget }} $
            </p>
            <p class="text-muted flex-grow-1">
              {{ place.description }}
            </p>

            <RouterLink
              class="btn btn-outline-primary mt-2"
              :to="`/destination/${place.key}`"
            >
              Открыть
            </RouterLink>
          </div>
        </div>
      </div>

      <div v-if="!filteredPlaces.length" class="col-12">
        <div class="alert alert-warning mb-0">
          По заданным фильтрам ничего не найдено.
        </div>
      </div>
    </section>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'
import { placesApi } from '../api/index.js'

export default {
  name: 'SearchPage',
  components: { BaseLayout, AppNavbar },

  data() {
    return {
      places: [],
      loading: false,
      error: '',
      typeFilter: 'all',
      budgetFilter: '',
      daysFilter: 'all',
    }
  },

  computed: {
    filteredPlaces() {
      return this.places.filter((place) => {
        const matchesType =
          this.typeFilter === 'all' || place.type === this.typeFilter

        const matchesBudget =
          !this.budgetFilter || Number(place.budget) <= Number(this.budgetFilter)

        const matchesDays = this.checkDays(place.days)

        return matchesType && matchesBudget && matchesDays
      })
    },
  },

  methods: {
    async loadPlaces() {
      this.loading = true
      this.error = ''

      try {
        const response = await placesApi.getAll()
        this.places = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        this.error = 'Не удалось загрузить направления.'
      } finally {
        this.loading = false
      }
    },

    checkDays(days) {
      if (this.daysFilter === 'all') return true
      if (this.daysFilter === '1-3') return days >= 1 && days <= 3
      if (this.daysFilter === '4-7') return days >= 4 && days <= 7
      if (this.daysFilter === '8+') return days >= 8
      return true
    },
  },

  mounted() {
    this.loadPlaces()
  },
}
</script>
