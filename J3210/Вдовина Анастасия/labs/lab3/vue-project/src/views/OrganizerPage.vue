<template>
  <base-layout>
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <h1 class="mb-0">Кабинет организатора</h1>
      <button type="button" class="btn btn-brand" @click="isModalOpen = true">+ Создать мероприятие</button>
    </div>

    <p v-if="isLoading" class="text-muted">Загружаем данные…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>

    <template v-else>
      <div class="row g-4 mb-5">
        <div class="col-6 col-md-3">
          <div class="card text-center p-3">
            <span class="fs-3 fw-bold">{{ events.length }}</span>
            <span class="text-muted">Активных события</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center p-3">
            <span class="fs-3 fw-bold">{{ activeTickets.length }}</span>
            <span class="text-muted">Продано билетов</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center p-3">
            <span class="fs-3 fw-bold">{{ revenue }} ₽</span>
            <span class="text-muted">Выручка</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center p-3">
            <span class="fs-3 fw-bold">{{ refunds.length }}</span>
            <span class="text-muted">Возврата</span>
          </div>
        </div>
      </div>

      <h2 class="h4 mb-3">Мои мероприятия</h2>

      <div class="table-responsive">
        <table class="table align-middle">
          <caption class="visually-hidden">Список созданных мероприятий и продажи по ним</caption>
          <thead>
            <tr>
              <th scope="col">Название</th>
              <th scope="col">Дата</th>
              <th scope="col">Продано / всего</th>
              <th scope="col">Статус</th>
              <th scope="col"><span class="visually-hidden">Действия</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>
                <router-link :to="{ name: 'event', params: { id: event.id } }">{{ event.title }}</router-link>
              </td>
              <td>{{ event.dateLabel || event.dateShort }}</td>
              <td>{{ soldCount(event.id) }} {{ event.free ? 'записалось' : 'продано' }}</td>
              <td>
                <span class="badge text-bg-success">
                  {{ event.free ? 'Регистрация открыта' : 'Продажи открыты' }}
                </span>
              </td>
              <td class="text-nowrap">
                <button type="button" class="btn btn-sm btn-outline-secondary">Редактировать</button>
                <button type="button" class="btn btn-sm btn-outline-danger">Отменить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <modal-dialog v-if="isModalOpen" title="Новое мероприятие" size="modal-lg" @close="isModalOpen = false">
      <form class="row g-3" aria-label="Новое мероприятие">
        <div class="col-12">
          <label for="eventTitle" class="form-label">Название</label>
          <input id="eventTitle" v-model="form.title" type="text" class="form-control" required />
        </div>

        <div class="col-12 col-md-6">
          <label for="eventType" class="form-label">Тип</label>
          <select id="eventType" v-model="form.type" class="form-select">
            <option value="concert">Концерт</option>
            <option value="festival">Фестиваль</option>
          </select>
        </div>

        <div class="col-12 col-md-6">
          <label for="eventVenue" class="form-label">Место проведения</label>
          <input id="eventVenue" v-model="form.venue" type="text" class="form-control" placeholder="Например: КСК «Арена»" required />
        </div>

        <div class="col-12 col-md-6">
          <label for="eventDate" class="form-label">Дата</label>
          <input id="eventDate" v-model="form.date" type="date" class="form-control" required />
        </div>

        <div class="col-12 col-md-6">
          <label for="eventPrice" class="form-label">Цена билета, ₽ (0 — бесплатно)</label>
          <input id="eventPrice" v-model.number="form.price" type="number" class="form-control" min="0" required />
        </div>

        <div class="col-12">
          <label for="eventDescription" class="form-label">Описание</label>
          <textarea id="eventDescription" v-model="form.description" class="form-control" rows="3" />
        </div>
      </form>

      <div v-if="formError" class="alert alert-danger mt-3" role="alert">{{ formError }}</div>

      <template #footer>
        <button type="button" class="btn btn-brand" @click="onCreate">Создать (черновик)</button>
      </template>
    </modal-dialog>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import useEventsStore from '@/stores/events'
import useTicketsStore from '@/stores/tickets'
import { useRequest } from '@/composables/useRequest'

export default {
  name: 'OrganizerPage',
  components: { BaseLayout, ModalDialog },

  setup() {
    const events = useEventsStore()
    const tickets = useTicketsStore()

    const { isLoading, error, run } = useRequest(async () => {
      await events.loadEvents()
      await tickets.loadAllTickets()
      await tickets.loadAllRefunds()
    })

    return { isLoading, error, run }
  },

  data() {
    return {
      form: { title: '', type: 'concert', venue: '', date: '', price: 0, description: '' },
      formError: '',
      isModalOpen: false,
    }
  },

  computed: {
    ...mapState(useEventsStore, ['events']),
    ...mapState(useTicketsStore, ['tickets', 'refunds']),

    activeTickets() {
      return this.tickets.filter(({ status }) => status === 'active')
    },

    revenue() {
      const total = this.activeTickets.reduce((sum, ticket) => {
        const event = this.events.find(({ id }) => id === ticket.eventId)

        return sum + (event && !event.free ? event.priceFrom : 0)
      }, 0)

      return total.toLocaleString('ru-RU')
    },
  },

  methods: {
    ...mapActions(useEventsStore, ['createEvent']),

    soldCount(id) {
      return this.activeTickets.filter((ticket) => ticket.eventId === id).length
    },

    async onCreate() {
      const { title, type, venue, date, price, description } = this.form

      if (!title || !venue || !date) {
        this.formError = 'Заполните название, место проведения и дату.'
        return
      }

      // id уходит в адрес страницы, поэтому оставляем в нём только латиницу и цифры
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const dateLabel = new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

      await this.createEvent({
        id: `${slug || 'event'}-${Date.now()}`,
        title,
        type,
        typeLabel: type === 'festival' ? 'Фестиваль' : 'Концерт',
        city: 'spb',
        cityLabel: 'Санкт-Петербург',
        date,
        dateLabel,
        dateShort: dateLabel.replace(' г.', ''),
        timeLabel: null,
        venueShort: venue,
        venueFull: venue,
        image: '/img/vselennaya.jpeg',
        free: price === 0,
        priceFrom: price,
        priceLabel: price === 0 ? 'Бесплатно' : `от ${price.toLocaleString('ru-RU')} ₽`,
        badges: [type === 'festival' ? 'Фестиваль' : 'Концерт', price === 0 ? 'Бесплатно' : 'Платно'],
        description: description || 'Описание появится позже.',
        venueDescription: venue,
        venueMapLabel: 'Схема зала уточняется',
        participationNote: 'Регистрация не обязательна.',
        priceTiers: [],
        reviews: [],
      })

      this.form = { title: '', type: 'concert', venue: '', date: '', price: 0, description: '' }
      this.formError = ''
      this.isModalOpen = false

      await this.run()
    },
  },

  mounted() {
    this.run()
  },
}
</script>
