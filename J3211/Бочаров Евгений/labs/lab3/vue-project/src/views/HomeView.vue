<template>
  <section class="card shadow-sm border-0 p-4 mb-4">
    <EventFilters @filter="handleFilter" @reset="handleReset" />
  </section>

  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Ближайшие события</h2>
    <select class="form-select form-select-sm" style="width:auto" @change="handleSort">
      <option value="date_asc">По дате ↑</option>
      <option value="date_desc" selected>По дате ↓</option>
    </select>
  </div>

  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2 text-muted">Загрузка...</p>
  </div>

  <div v-else-if="events.length === 0" class="text-center py-5 text-muted">
    <p>События не найдены</p>
    <button class="btn btn-outline-primary" @click="handleReset">Сбросить фильтры</button>
  </div>

  <div v-else class="row">
    <EventCard v-for="e in events" :key="e.id" :event="e" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { useRoute, useRouter } from 'vue-router'
import EventFilters from '@/components/events/EventFilters.vue'
import EventCard from '@/components/events/EventCard.vue'
import Icon from '@/components/ui/Icon.vue'

const { events, loading, fetchEvents } = useEvents()
const route = useRoute()
const router = useRouter()
const currentFilters = ref({})

const loadEvents = (filters = {}) => {
  fetchEvents({
    _sort: 'dates.0.datetime',
    _order: 'asc',
    ...filters
  })
}

const handleFilter = (filters) => {
  currentFilters.value = filters
  const query = {}
  if (filters._q) query.q = filters._q
  if (filters.type) query.type = filters.type
  if (filters.city) query.city = filters.city
  router.push({ query })
  loadEvents(filters)
}

const handleReset = () => {
  currentFilters.value = {}
  router.push({ query: {} })
  loadEvents()
}

const handleSort = (e) => {
  const order = e.target.value.includes('desc') ? 'desc' : 'asc'
  loadEvents({ ...currentFilters.value, _order: order })
}

onMounted(() => {
  loadEvents()

  const q = route.query
  if (q.q || q.type || q.city) {
    currentFilters.value = {
      _q: q.q || undefined,
      type: q.type || undefined,
      city: q.city || undefined
    }
    loadEvents(currentFilters.value)
  }
})
</script>