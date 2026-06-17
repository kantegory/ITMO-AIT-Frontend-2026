<template>
  <BaseLayout>
    <AppNavbar />

    <div v-if="loading" class="alert alert-light border">Загрузка направления...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <section v-else-if="place" class="card shadow-sm border-0">
      <div class="card-body p-4">
        <span class="badge text-bg-light border mb-3">
          {{ place.type === 'city' ? 'Город' : 'Природа' }}
        </span>

        <h1 class="fw-bold mb-3">{{ place.title }}</h1>
        <p class="text-muted mb-3">
          {{ place.days }} дн. · до {{ place.budget }} $ · {{ place.badge }}
        </p>
        <p class="lead">{{ place.description }}</p>

        <hr>

        <h2 class="h5 mb-3">Что посмотреть</h2>
        <ul>
          <li v-for="item in place.placesList" :key="item">{{ item }}</li>
        </ul>

        <h2 class="h5 mt-4 mb-3">Советы</h2>
        <ul>
          <li v-for="item in place.tipsList" :key="item">{{ item }}</li>
        </ul>

        <h2 class="h5 mt-4 mb-3">Что включено</h2>
        <ul>
          <li v-for="item in place.includedList" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>

    <div v-else class="alert alert-warning">Направление не найдено.</div>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'
import { placesApi } from '../api/index.js'

export default {
  name: 'DestinationPage',
  components: { BaseLayout, AppNavbar },

  data() {
    return {
      place: null,
      loading: false,
      error: '',
    }
  },

  methods: {
    async loadPlace() {
      this.loading = true
      this.error = ''

      try {
        const response = await placesApi.getByKey(this.$route.params.placeKey)
        this.place = response.data
      } catch (error) {
        this.error = 'Не удалось загрузить направление.'
      } finally {
        this.loading = false
      }
    },
  },

  mounted() {
    this.loadPlace()
  },
}
</script>
