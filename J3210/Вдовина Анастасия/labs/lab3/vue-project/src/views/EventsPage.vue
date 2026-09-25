<template>
  <base-layout>
    <h1 class="mb-4">Мероприятия</h1>

    <event-filters v-model="filters" @apply="applyFilters" @reset="resetFilters" />

    <p v-if="isLoading" class="text-muted">Загружаем мероприятия…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
    <p v-else-if="events.length === 0" class="text-muted">
      По заданным фильтрам мероприятий не найдено. Попробуйте изменить параметры поиска.
    </p>

    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4" aria-live="polite">
      <div v-for="event in events" :key="event.id" class="col">
        <event-card :event="event" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/events/EventCard.vue'
import EventFilters from '@/components/events/EventFilters.vue'
import useEventsStore from '@/stores/events'
import { useRequest } from '@/composables/useRequest'

export default {
  name: 'EventsPage',
  components: { BaseLayout, EventCard, EventFilters },

  setup() {
    const store = useEventsStore()
    const { isLoading, error, run } = useRequest((params) => store.loadEvents(params))

    return { isLoading, error, run }
  },

  data() {
    return {
      filters: { query: '', type: '', city: '', date: '' },
    }
  },

  computed: {
    ...mapState(useEventsStore, ['events']),
  },

  methods: {
    ...mapActions(useEventsStore, ['loadEvents']),

    applyFilters() {
      const params = {}

      if (this.filters.query) params.q = this.filters.query
      if (this.filters.type) params.type = this.filters.type
      if (this.filters.city) params.city = this.filters.city
      if (this.filters.date) params.date_gte = this.filters.date

      this.run(params)
    },

    resetFilters() {
      this.filters = { query: '', type: '', city: '', date: '' }
      this.run({})
    },
  },

  mounted() {
    const query = this.$route.query.q

    if (query) {
      this.filters.query = query
      this.applyFilters()
      return
    }

    this.run({})
  },
}
</script>
