<template>
  <div class="table-responsive">
    <table class="table align-middle ticket-row">
      <caption class="visually-hidden">Список купленных билетов</caption>
      <thead>
        <tr>
          <th scope="col">Мероприятие</th>
          <th scope="col">Дата</th>
          <th scope="col">Тип билета</th>
          <th scope="col">Статус</th>
          <th scope="col"><span class="visually-hidden">Действия</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>
            <router-link v-if="findEvent(ticket.eventId)" :to="{ name: 'event', params: { id: ticket.eventId } }">
              {{ eventTitle(ticket.eventId) }}
            </router-link>
            <span v-else>{{ eventTitle(ticket.eventId) }}</span>
          </td>
          <td>{{ eventDate(ticket.eventId) }}</td>
          <td>{{ ticket.category }}</td>
          <td>
            <span :class="`ticket-row__status--${ticket.status}`">
              {{ ticket.status === 'active' ? 'Активен' : 'Возвращён' }}
            </span>
          </td>
          <td>
            <button
              v-if="ticket.status === 'active' && !isFree(ticket.eventId)"
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="$emit('refund', ticket)"
            >
              Оформить возврат
            </button>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TicketTable',
  props: {
    tickets: {
      type: Array,
      required: true,
    },
    events: {
      type: Array,
      required: true,
    },
  },
  emits: ['refund'],
  methods: {
    findEvent(id) {
      return this.events.find((event) => event.id === id)
    },
    eventTitle(id) {
      return this.findEvent(id)?.title || 'Мероприятие удалено'
    },
    eventDate(id) {
      return this.findEvent(id)?.dateLabel || '—'
    },
    isFree(id) {
      return Boolean(this.findEvent(id)?.free)
    },
  },
}
</script>
