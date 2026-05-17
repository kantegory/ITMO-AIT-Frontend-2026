<template>
  <BaseLayout>
    <div class="hero-search">
      <div class="container text-center">
        <h1 class="display-5 mb-3">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-compass"></use></svg>
          Куда отправимся?
        </h1>
        <p class="lead mb-4">Найдите идеальное путешествие среди тысяч направлений</p>
        
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-white border-0">
                <svg class="icon text-success"><use xlink:href="/sprite.svg#icon-search"></use></svg>
              </span>
              <input type="text" class="form-control border-0" v-model="searchQuery" placeholder="Поиск по странам, городам, направлениям…">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="filter-title">Тип направления</div>
          <div class="d-flex flex-wrap gap-2">
            <div v-for="type in typeFilters" :key="type.value" class="form-check form-check-inline">
              <input type="radio" class="btn-check" :id="`type${type.value}`" :value="type.value" v-model="typeFilter">
              <label class="btn btn-outline-success" :for="`type${type.value}`">
                <svg class="icon"><use :xlink:href="`/sprite.svg#${type.icon}`"></use></svg>
                {{ type.label }}
              </label>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <label class="filter-title">Бюджет</label>
          <select class="form-select" v-model="budgetFilter">
            <option value="all">Любой бюджет</option>
            <option value="Низкий">Низкий (до 50 000 рублей)</option>
            <option value="Средний">Средний (50 000 — 100 000 рублей)</option>
            <option value="Высокий">Высокий (от 100 000 рублей)</option>
          </select>
        </div>
        
        <div class="col-lg-4">
          <label class="filter-title">Длительность</label>
          <select class="form-select" v-model="durationFilter">
            <option value="all">Любая длительность</option>
            <option value="1-3 дня">1-3 дня</option>
            <option value="4-7 дней">4-7 дней</option>
            <option value="8+ дней">8+ дней</option>
          </select>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-12 d-flex justify-content-end align-items-center gap-3">
          <button class="btn btn-outline-secondary" @click="resetFilters">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-arrow-repeat"></use></svg>
            Сбросить
          </button>
          <span class="text-muted">Найдено: {{ filteredDestinations.length }} направлений</span>
        </div>
      </div>
    </div>
    
    <div v-if="destinationsStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    
    <div v-else-if="filteredDestinations.length === 0" class="empty-state">
      <svg class="icon"><use xlink:href="/sprite.svg#icon-search"></use></svg>
      <h3 class="mt-3">Ничего не найдено</h3>
      <p class="text-muted">Попробуйте изменить параметры фильтрации</p>
    </div>
    
    <div v-else class="row g-4">
      <div v-for="dest in filteredDestinations" :key="dest.id" class="col-lg-6 col-xl-3 col-md-6">
        <DestinationCard :destination="dest" />
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import DestinationCard from '@/components/destinations/DestinationCard.vue'
import { useDestinationsStore } from '@/stores/destinations'

const destinationsStore = useDestinationsStore()

const searchQuery = ref('')
const typeFilter = ref('all')
const budgetFilter = ref('all')
const durationFilter = ref('all')

const typeFilters = [
  { value: 'all', label: 'Все', icon: 'icon-geo-alt' },
  { value: 'Город', label: 'Город', icon: 'icon-building' },
  { value: 'Природа', label: 'Природа', icon: 'icon-tree' },
  { value: 'Смешанный', label: 'Смешанный', icon: 'icon-arrow-repeat' }
]

const filteredDestinations = computed(() => {
  let filtered = destinationsStore.destinations
  
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(d => d.type === typeFilter.value)
  }
  
  if (budgetFilter.value !== 'all') {
    filtered = filtered.filter(d => d.budget === budgetFilter.value)
  }
  
  if (durationFilter.value !== 'all') {
    filtered = filtered.filter(d => d.duration === durationFilter.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d => {
      const searchable = `${d.name} ${d.description} ${d.tags.join(' ')}`.toLowerCase()
      return searchable.includes(query)
    })
  }
  
  return filtered
})

const resetFilters = () => {
  typeFilter.value = 'all'
  budgetFilter.value = 'all'
  durationFilter.value = 'all'
  searchQuery.value = ''
}

onMounted(async () => {
  await destinationsStore.loadDestinations()
})
</script>