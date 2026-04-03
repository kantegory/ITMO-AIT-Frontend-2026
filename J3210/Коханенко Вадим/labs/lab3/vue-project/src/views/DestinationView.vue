<template>
  <BaseLayout>
    <div v-if="destination">
      <div class="destination-hero" :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${destination.image}')` }">
        <div class="destination-hero-overlay">
          <div class="container">
            <div class="row">
              <div class="col-lg-8">
                <h1 class="destination-title">{{ destination.name }}</h1>
                <div class="d-flex align-items-center mb-3">
                  <span class="rating-large me-2">
                    <template v-for="i in 5" :key="i">
                      <svg class="icon" v-if="i <= fullStars"><use xlink:href="/sprite.svg#icon-star-fill"></use></svg>
                      <svg class="icon" v-else-if="i === fullStars + 1 && hasHalf"><use xlink:href="/sprite.svg#icon-star-half"></use></svg>
                      <svg class="icon" v-else><use xlink:href="/sprite.svg#icon-star"></use></svg>
                    </template>
                  </span>
                  <span class="fs-4 fw-bold me-2">{{ destination.rating }}</span>
                  <span class="text-white-50">({{ destination.reviews }} отзывов)</span>
                </div>
                <div class="d-flex flex-wrap gap-3">
                  <span class="badge bg-white text-dark p-2">
                    <svg class="icon"><use xlink:href="/sprite.svg#icon-calendar"></use></svg>
                    {{ destination.duration }}
                  </span>
                  <span class="badge bg-white text-dark p-2">
                    {{ destination.budget }} бюджет
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="container mt-4">
        <div class="row mb-4">
          <div class="col-12 d-flex justify-content-end">
            <button class="btn btn-success me-2" @click="openAddRouteModal">
              <svg class="icon"><use xlink:href="/sprite.svg#icon-map"></use></svg>
              Добавить в маршруты
            </button>
          </div>
        </div>
        
        <div class="row g-4 mb-5">
          <div class="col-lg-8">
            <section class="card info-card mb-4">
              <div class="card-header">
                <h2 class="h5 mb-0">
                  <svg class="icon"><use xlink:href="/sprite.svg#icon-info-circle"></use></svg>
                  О направлении
                </h2>
              </div>
              <div class="card-body">
                <p class="card-text">{{ destination.fullDescription || destination.description }}</p>
                <div class="mt-3">
                  <span v-for="tag in destination.tags" :key="tag" class="badge bg-light text-dark me-1">#{{ tag }}</span>
                </div>
              </div>
            </section>
            
            <section class="card info-card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h2 class="h5 mb-0">
                  <svg class="icon"><use xlink:href="/sprite.svg#icon-camera"></use></svg>
                  Достопримечательности
                </h2>
                <span class="badge bg-success">{{ destination.attractions.length }}+ мест</span>
              </div>
              <div class="card-body p-0">
                <div v-for="attr in destination.attractions" :key="attr.name" class="attraction-item d-flex align-items-center">
                  <div class="me-3">
                    <div class="attraction-img" :style="{ backgroundImage: `url('${attr.image}')` }"></div>
                  </div>
                  <div>
                    <h3 class="h6 mb-1">{{ attr.name }}</h3>
                    <p class="text-muted small mb-0">{{ attr.description }}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          <div class="col-lg-4">
            <QuickInfo :destination="destination" />
          </div>
        </div>
      </div>
      
      <!-- Модалка: добавить маршрут -->
      <div v-if="showRouteModal" class="modal-overlay" @click.self="closeRouteModal">
        <div class="modal-container">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <svg class="icon"><use xlink:href="/sprite.svg#icon-map"></use></svg>
              Детали маршрута
            </h5>
            <button type="button" class="btn-close-custom" @click="closeRouteModal">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRoute">
              <div class="mb-3">
                <label class="form-label">Название маршрута</label>
                <input type="text" class="form-control" v-model="routeToSave.title" readonly>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Основные точки маршрута</label>
                  <input type="text" class="form-control" v-model="routeToSave.points" readonly>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Тип маршрута</label>
                  <input type="text" class="form-control" v-model="routeToSave.type" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Длительность</label>
                  <input type="text" class="form-control" v-model="routeToSave.duration" readonly>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Бюджет</label>
                  <input type="text" class="form-control" v-model="routeToSave.budget" readonly>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Описание</label>
                <textarea class="form-control" rows="3" v-model="routeToSave.description" readonly></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeRouteModal">Отмена</button>
                <button type="submit" class="btn btn-success">Добавить в маршруты</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="destinationsStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import { useDestinationsStore } from '@/stores/destinations'
import { useRoutesStore } from '@/stores/routes'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'
import QuickInfo from '@/components/destinations/QuickInfo.vue'

const route = useRoute()
const router = useRouter()
const destinationsStore = useDestinationsStore()
const routesStore = useRoutesStore()
const { currentUser } = useAuth()
const { showNotification } = useNotification()

const destination = ref(null)
const showRouteModal = ref(false)

const fullStars = computed(() => Math.floor(destination.value?.rating || 0))
const hasHalf = computed(() => (destination.value?.rating || 0) % 1 >= 0.5)

const routeToSave = reactive({
  destinationId: null,
  title: '',
  points: '',
  type: '',
  duration: '',
  budget: '',
  description: ''
})

const openAddRouteModal = () => {
  if (!destination.value) return
  
  routeToSave.destinationId = destination.value.id
  routeToSave.title = destination.value.name
  routeToSave.points = destination.value.attractions.slice(0, 2).map(a => a.name).join(', ')
  routeToSave.type = destination.value.type
  routeToSave.duration = destination.value.duration
  routeToSave.budget = destination.value.budget
  routeToSave.description = destination.value.description
  
  showRouteModal.value = true
}

const closeRouteModal = () => {
  showRouteModal.value = false
}

const saveRoute = async () => {  
  const existingRoute = routesStore.routes.find(
    r => r.destinationId === routeToSave.destinationId && r.userId === currentUser.value.id
  )
  
  if (existingRoute) {
    showNotification('Этот маршрут уже есть в вашем личном кабинете!', true)
    closeRouteModal()
    return
  }
  
  try {
    await routesStore.saveRoute({
      ...routeToSave,
      userId: currentUser.value.id,
      id: Date.now().toString(),
      savedAt: new Date().toISOString()
    })
    
    showNotification('Маршрут добавлен в личный кабинет!')
    closeRouteModal()
  } catch (error) {
    showNotification('Ошибка при сохранении маршрута', true)
  }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const data = await destinationsStore.loadDestinationById(id)
    if (!data) {
      showNotification('Направление не найдено', true)
      router.push('/search')
      return
    }
    destination.value = data
  } catch (error) {
    showNotification('Ошибка загрузки направления', true)
    router.push('/search')
  }
})
</script>

<style scoped>
.attraction-img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
}
</style>