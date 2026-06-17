<template>
  <base-layout>
    <div v-if="loading" class="alert alert-info">Загрузка мероприятия...</div>
    <div v-else-if="error" class="alert alert-danger">Мероприятие не найдено. {{ error }}</div>
    
    <article v-else-if="event" aria-labelledby="eventPageTitle">
      <div class="card hero-card border-0 shadow-sm">
        
        <event-image :src="event.image" :alt="event.title" image-class="event-hero-image" />
      </div>
      <div class="card border-0 shadow-sm p-4 event-content-card">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <span class="badge text-bg-light">{{ typeLabel(event.type) }}</span>
        </div>
        <h1 id="eventPageTitle" class="mb-2">{{ event.title }}</h1>
        <p class="text-muted mb-3 meta-with-icon">
          <base-icon name="calendar" />
          <span>{{ event.cityLabel || event.city }} • {{ event.date }} • {{ event.place }}</span>
        </p>
        <p class="mb-4">{{ event.description }}</p>
        <button
          type="button"
          class="btn btn-success btn-icon"
          :aria-label="`Купить билет на мероприятие ${event.title}`"
          @click="onBuy"
        >
          <base-icon name="ticket" />
          <span>Купить билет</span>
        </button>
      </div>
    </article>
  </base-layout>
</template>

<script>

import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventImage from '@/components/EventImage.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import useEventsStore from '@/stores/events'
import useTicketsStore from '@/stores/tickets'
import useAuth from '@/composables/useAuth'
import useToast from '@/composables/useToast'
import useEventTypes from '@/composables/useEventTypes'

export default {
  name: 'EventView',
  components: { BaseLayout, EventImage, BaseIcon },

  props: { id: { type: [String, Number], required: true } },
  setup() {

    const { isAuthenticated, user } = useAuth()
    const { showToast } = useToast()
    const { typeLabel } = useEventTypes()
    return { isAuthenticated, user, showToast, typeLabel }
  },
  data() {
    return { loading: false, error: '' }
  },
  computed: {

    ...mapState(useEventsStore, { event: 'currentEvent' })
  },
  methods: {
    ...mapActions(useEventsStore, ['loadEventById']),
    ...mapActions(useTicketsStore, ['buyTicket']),
    async load() {
      this.loading = true
      this.error = ''
      try { await this.loadEventById(this.id) }
      catch (e) { this.error = e.message }
      finally { this.loading = false }
    },
    async onBuy() {
      if (!this.isAuthenticated) {
        this.showToast('Чтобы купить билет, сначала войдите в аккаунт')

        setTimeout(() => this.$router.push({ name: 'login' }), 900)
        return
      }
      try {
        await this.buyTicket({ userId: this.user.id, eventId: this.event.id })
        this.showToast('Билет успешно куплен')
      } catch (e) {
        this.showToast(`Не удалось купить билет: ${e.message}`)
      }
    }
  },

  watch: {
    id: { immediate: true, handler() { this.load() } }
  }
}

</script>
