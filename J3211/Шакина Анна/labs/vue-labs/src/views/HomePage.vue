<template>
  <base-layout>
    <section class="events-explorer py-5">
      <div class="container pt-4">
        <div class="events-shell">
          <div class="events-intro">
            <h1 class="events-title">Мероприятия</h1>
          </div>

          <!-- Поиск -->
          <input
              v-model="search"
              type="text"
              class="search-input form-control mb-3"
              placeholder="Поиск мероприятий...">

          <p class="events-counter">Найдено: {{ filteredEvents.length }}</p>

          <!-- Список мероприятий -->
          <div v-if="filteredEvents.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <event-card
                v-for="event in filteredEvents"
                :key="event.id"
                :event="event" />
          </div>

          <div v-else class="events-empty">
            <p class="events-empty-text">Мероприятия не найдены.</p>
          </div>
        </div>
      </div>
    </section>
  </base-layout>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import useEventsStore from '@/stores/events'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'HomePage',
  components: { BaseLayout, EventCard },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState(useEventsStore, ['events']),
    filteredEvents() {
      if (!this.search.trim()) return this.events
      const q = this.search.toLowerCase()
      return this.events.filter(e =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      )
    }
  },
  methods: {
    ...mapActions(useEventsStore, ['loadEvents'])
  },
  mounted() {
    this.loadEvents()
  }
}
</script>