<template>
  <PageShell>
    <h2 class="mb-3">Найти мероприятие</h2>
    <form class="row g-3 mb-4" @submit.prevent>
      <div class="col-md-3">
        <label for="filterType" class="form-label">
          <SvgIcon name="activity" custom-class="me-1" />Тип
        </label>
        <select id="filterType" v-model="filters.type" class="form-select">
          <option value="">Все</option>
          <option value="Концерт">Концерт</option>
          <option value="Экскурсия">Экскурсия</option>
          <option value="Другое">Другое</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="filterDate" class="form-label">
          <SvgIcon name="calendar" custom-class="me-1" />С даты
        </label>
        <input id="filterDate" v-model="filters.date" type="date" class="form-control">
      </div>
      <div class="col-md-3">
        <label for="filterLocation" class="form-label">
          <SvgIcon name="location" custom-class="me-1" />Место
        </label>
        <input id="filterLocation" v-model.trim="filters.location" type="text" class="form-control" placeholder="Город или место">
      </div>
    </form>
    <div v-if="loading" class="text-center mt-4">Загрузка...</div>
    <div v-else class="row">
      <p v-if="!filteredEvents.length" class="text-center mt-4">По вашему запросу ничего не найдено.</p>
      <EventCard v-for="event in filteredEvents" :key="event.id" :event="event" />
    </div>
  </PageShell>
</template>
<script setup>
import { computed, onMounted, reactive } from 'vue'
import EventCard from '../components/EventCard.vue'
import PageShell from '../components/PageShell.vue'
import SvgIcon from '../components/SvgIcon.vue'
import { useEvents } from '../composables/useEvents'
const { events, loading, loadEvents } = useEvents()
const filters = reactive({
  type: '',
  date: '',
  location: ''
})
const filteredEvents = computed(() => events.value.filter((event) => {
  const typeMatch = !filters.type || event.type === filters.type
  const dateMatch = !filters.date || (event.date || '') >= filters.date
  const locationMatch = !filters.location || (event.location || '').toLowerCase().includes(filters.location.toLowerCase())
  return typeMatch && dateMatch && locationMatch
}))
onMounted(() => {
  loadEvents()
})
</script>
