<template>
  <base-layout>
    <h1 class="mb-4">Личный кабинет</h1>

    
    <section aria-labelledby="profile-title" class="mb-4">
      <h2 id="profile-title" class="visually-hidden">Информация о пользователе</h2>
      <div class="card border-0 shadow-sm p-4">
        <h4 class="mb-2 profile-card-line">
          <base-icon name="user" />
          <span>
            {{ user.name }}
            <span v-if="isOrganizer" class="badge bg-warning text-dark ms-2">Организатор</span>
            <span v-else class="badge bg-secondary ms-2">Пользователь</span>
          </span>
        </h4>
        <p class="mb-0 text-muted profile-card-line">
          <base-icon name="login" />
          <span>{{ user.email }}</span>
        </p>
      </div>
    </section>

    
    <section v-if="isOrganizer" aria-labelledby="organizer-title" class="mb-5">
      <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
        <h2 id="organizer-title" class="mb-0">Мои мероприятия</h2>
        <button
          type="button"
          class="btn btn-success btn-icon"
          aria-label="Добавить новое мероприятие"
          @click="openAddEventModal"
        >
          <base-icon name="plus" />
          <span>Добавить мероприятие</span>
        </button>
      </div>

      <div v-if="organizerLoading" class="card p-4 border-0 shadow-sm">
        <p class="mb-0 text-muted">Загрузка мероприятий...</p>
      </div>
      <div v-else-if="!organizerEvents.length" class="card p-4 border-0 shadow-sm">
        <h5 class="mb-2">Пока нет мероприятий</h5>
        <p class="mb-0 text-muted">Нажмите «Добавить мероприятие» и заполните форму.</p>
      </div>
      <div v-else>
        
        <organizer-event-item
          v-for="event in organizerEvents"
          :key="event.id"
          :event="event"
          @edit="onEditEvent"
          @delete="onDeleteEvent"
        />
      </div>

      
      <event-form ref="eventForm" @submit="onFormSubmit" />
    </section>

    
    <section aria-labelledby="tickets-title" aria-live="polite" :aria-busy="ticketsLoading">
      <h2 id="tickets-title" class="mb-3">Мои билеты</h2>
      <div v-if="ticketsLoading" class="card border-0 shadow-sm p-4">
        <p class="mb-0 text-muted">Загрузка билетов...</p>
      </div>
      <div v-else-if="!activeTickets.length" class="card border-0 shadow-sm p-4">
        <p class="mb-0 text-muted">У вас пока нет купленных билетов.</p>
      </div>
      <div v-else>
        <ticket-card
          v-for="ticket in activeTickets"
          :key="ticket.id"
          :ticket="ticket"
          :event="eventById(ticket.eventId)"
          @refund="onRefund"
        />
      </div>
    </section>
  </base-layout>
</template>

<script>

import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import EventForm from '@/components/EventForm.vue'
import OrganizerEventItem from '@/components/OrganizerEventItem.vue'
import TicketCard from '@/components/TicketCard.vue'
import useAuth from '@/composables/useAuth'
import useToast from '@/composables/useToast'
import useEventsStore from '@/stores/events'
import useTicketsStore from '@/stores/tickets'

export default {
  name: 'ProfileView',
  components: { BaseLayout, BaseIcon, EventForm, OrganizerEventItem, TicketCard },
  setup() {

    const { user, isOrganizer } = useAuth()
    const { showToast } = useToast()
    return { user, isOrganizer, showToast }
  },
  data() {
    return { ticketsLoading: false, organizerLoading: false }
  },
  computed: {
    ...mapState(useEventsStore, ['events', 'organizerEvents']),
    ...mapState(useTicketsStore, ['activeTickets']),

    eventById() {
      const map = new Map(this.events.map((e) => [String(e.id), e]))
      return (id) => map.get(String(id)) || null
    }
  },
  methods: {
    ...mapActions(useEventsStore, [
      'loadEvents',
      'loadOrganizerEvents',
      'createEvent',
      'updateEvent',
      'deleteEvent'
    ]),
    ...mapActions(useTicketsStore, ['loadTickets', 'refundTicket']),

    openAddEventModal() {

      this.$refs.eventForm.show()
    },

    onEditEvent(event) {

      this.$refs.eventForm.show(event)
    },

    async onFormSubmit({ payload, id, isEdit }) {
      try {
        if (isEdit) {
          await this.updateEvent(id, payload)
          this.showToast('Мероприятие обновлено')
        } else {
          await this.createEvent({
            ...payload,
            creatorId: this.user.id,
            userId: this.user.id,
            isDefault: false
          })
          this.showToast('Мероприятие успешно создано')
        }

        await this.loadEvents()
      } catch (e) {
        this.showToast(`Ошибка: ${e.message}`)
      }
    },

    async onDeleteEvent(id) {
      try {
        await this.deleteEvent(id)
        this.showToast('Мероприятие удалено')
      } catch (e) {
        this.showToast(`Не удалось удалить мероприятие: ${e.message}`)
      }
    },

    async onRefund(id) {
      try {
        await this.refundTicket(id)
        this.showToast('Билет возвращён')
      } catch (e) {
        this.showToast(`Не удалось вернуть билет: ${e.message}`)
      }
    }
  },
  async mounted() {

    this.ticketsLoading = true
    try {
      await Promise.all([
        this.loadTickets(this.user.id),
        this.loadEvents()
      ])
    } finally {
      this.ticketsLoading = false
    }

    if (this.isOrganizer) {
      this.organizerLoading = true
      try {
        await this.loadOrganizerEvents(this.user.id)
      } finally {
        this.organizerLoading = false
      }
    }
  }
}

</script>
