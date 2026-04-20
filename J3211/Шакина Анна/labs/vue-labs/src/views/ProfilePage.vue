<template>
  <base-layout>
    <section class="events-explorer py-5">
      <div class="container pt-4 pt-lg-5">
        <div class="events-shell">
          <h1 class="events-title">Ваши записи на мероприятия</h1>
          <p class="events-counter">Записей: {{ myRegistrations.length }}</p>

          <div v-if="!isLoggedIn" class="profile-state-card">
            <p>Войдите, чтобы увидеть свои записи.</p>
            <router-link to="/login" class="site-button">Войти</router-link>
          </div>

          <div v-else-if="myRegistrations.length === 0" class="events-empty">
            <p class="events-empty-text">Вы пока не записаны ни на одно мероприятие.</p>
          </div>

          <div v-else class="row row-cols-1 row-cols-md-2 g-4">
            <event-card
                v-for="reg in myRegistrations"
                :key="reg.id"
                :event="getEventById(reg.eventId)" />
          </div>
        </div>
      </div>
    </section>
  </base-layout>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import useAuthStore from '@/stores/auth'
import useEventsStore from '@/stores/events'
import { registrationsApi } from '@/api'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'ProfilePage',
  components: { BaseLayout, EventCard },
  data() {
    return { registrations: [] }
  },
  computed: {
    ...mapState(useAuthStore, ['user', 'isLoggedIn']),
    ...mapState(useEventsStore, ['events']),
    myRegistrations() {
      return this.registrations.filter(r =>
          String(r.userId) === String(this.user?.id) && r.status === 'active'
      )
    }
  },
  methods: {
    ...mapActions(useEventsStore, ['loadEvents']),
    getEventById(id) {
      return this.events.find(e => String(e.id) === String(id)) || {}
    },
    async loadRegistrations() {
      const response = await registrationsApi.getAll()
      this.registrations = response.data
    }
  },
  async mounted() {
    await this.loadEvents()
    if (this.isLoggedIn) await this.loadRegistrations()
  }
}
</script>