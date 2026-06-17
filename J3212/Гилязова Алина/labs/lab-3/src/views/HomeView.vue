<template>
  <base-layout>
    <h1 class="mb-4">Купить билет на мероприятие</h1>

    
    <event-filters
      :search="search"
      :type-filter="typeFilter"
      :city-filter="cityFilter"
      @update:search="search = $event"
      @update:type-filter="typeFilter = $event"
      @update:city-filter="cityFilter = $event"
      @reset="resetFilters"
    />

    
    <section aria-labelledby="events-title" aria-live="polite" :aria-busy="loading">
      <h2 id="events-title" class="mb-4">Мероприятия</h2>

      <div v-if="loading" class="alert alert-info mb-0">Загрузка мероприятий...</div>
      <div v-else-if="error" class="alert alert-danger mb-0">
        Не удалось загрузить мероприятия: {{ error }}
      </div>
      <div v-else-if="!filteredEvents.length" class="alert alert-secondary mb-0">
        Мероприятий не найдено. Попробуйте сбросить фильтры.
      </div>
      <div v-else class="row g-4">
        <event-card v-for="event in filteredEvents" :key="event.id" :event="event" />
      </div>
    </section>
  </base-layout>
</template>

<script>

import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'
import EventFilters from '@/components/EventFilters.vue'
import useEventsStore from '@/stores/events'
import useEventFilters from '@/composables/useEventFilters'

export default {
  name: 'HomeView',
  components: { BaseLayout, EventCard, EventFilters },
  setup() {
    const filters = useEventFilters()
    return {
      search: filters.search,
      typeFilter: filters.typeFilter,
      cityFilter: filters.cityFilter,
      applyFilters: filters.applyFilters,
      resetFilters: filters.resetFilters
    }
  },
  data() {
    return { loading: false, error: '' }
  },
  computed: {
    ...mapState(useEventsStore, ['events']),
    filteredEvents() {
      return this.applyFilters(this.events)
    }
  },
  methods: {
    ...mapActions(useEventsStore, ['loadEvents'])
  },
  async mounted() {
    this.loading = true
    this.error = ''
    try {
      await this.loadEvents()
    } catch (e) {
      this.error = e.message
    } finally {
      this.loading = false
    }
  }
}

</script>
