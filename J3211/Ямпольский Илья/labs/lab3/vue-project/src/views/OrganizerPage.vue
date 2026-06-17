<template>
  <BaseLayout>
    <section class="organizer-content container py-4">
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h1>Кабинет организатора</h1>
        <button type="button" class="btn btn-primary" @click="showCreateModal = true">+ Создать событие</button>
      </header>
      <article class="row g-3 mb-4">
        <div class="col-md-4">
          <StatBox icon="icon-calendar" sub-icon="icon-ticket">
            <template #value>{{ events.length }}</template>
            <template #label>Событий</template>
          </StatBox>
        </div>
        <div class="col-md-4">
          <StatBox icon="icon-ticket" sub-icon="icon-seats">
            <template #value>{{ totalTicketsSold }}</template>
            <template #label>Продано билетов</template>
          </StatBox>
        </div>
        <div class="col-md-4">
          <StatBox icon="icon-chart" sub-icon="icon-star">
            <template #value>{{ formatPrice(totalRevenue) }} ₽</template>
            <template #label>Выручка</template>
          </StatBox>
        </div>
      </article>
      <article class="card shadow-sm">
        <section class="card-body">
          <header>
            <h2 class="h5 mb-3">Мои мероприятия</h2>
          </header>
          <div class="table-responsive">
            <table class="table">
              <thead>
              <tr>
                <th style="min-width: 200px;">Событие</th>
                <th style="min-width: 120px;">Дата</th>
                <th style="min-width: 100px;">Город</th>
                <th style="min-width: 150px;">Место</th>
                <th style="min-width: 100px;">Цена</th>
                <th style="min-width: 120px;">Продано</th>
                <th style="min-width: 120px;">Выручка</th>
                <th style="min-width: 100px;">Действия</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="event in events" :key="event.id">
                <td>
                  <SvgIcon name="icon-ticket" size="sm" class="me-2"/>
                  {{ event.title }}
                </td>
                <td>
                  <SvgIcon name="icon-calendar" size="sm" class="me-2"/>
                  {{ formatDate(event.date) }}
                </td>
                <td>
                  <SvgIcon name="icon-location" size="sm" class="me-2"/>
                  {{ event.city }}
                </td>
                <td>{{ event.venue || '-' }}</td>
                <td>{{ formatPrice(event.price) }} ₽</td>
                <td>
                  <SvgIcon name="icon-seats" size="sm" class="me-2"/>
                  {{ getSoldCount(event.id) }} / {{ event.capacity || 50 }}
                </td>
                <td>
                  <SvgIcon name="icon-chart" size="sm" class="me-2"/>
                  {{ formatPrice(getEventRevenue(event)) }} ₽
                </td>
                <td>
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">
                    <SvgIcon name="icon-close" size="sm"/>
                    Удалить
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </section>

    <CreateEventModal
      :model-value="showCreateModal"
      @update:model-value="showCreateModal = $event"
      @event-created="loadData"
    />
  </BaseLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import BaseLayout from '@/layouts/BaseLayout.vue'
import StatBox from '@/components/StatBox.vue'
import SvgIcon from '@/components/icons/SvgIcon.vue'
import CreateEventModal from '@/components/CreateEventModal.vue'

export default {
  name: 'OrganizerPage',
  components: { BaseLayout, StatBox, SvgIcon, CreateEventModal },
  setup() {
    const auth = useAuthStore()
    const eventsStore = useEventsStore()
    const events = ref([])
    const tickets = ref([])
    const showCreateModal = ref(false)

    auth.loadFromStorage()

    const totalTicketsSold = computed(() => {
      let count = 0
      events.value.forEach(event => {
        count += getSoldCount(event.id)
      })
      return count
    })

    const totalRevenue = computed(() => {
      let revenue = 0
      events.value.forEach(event => {
        revenue += getSoldCount(event.id) * event.price
      })
      return revenue
    })

    const getSoldCount = (eventId) => {
      const eventTickets = tickets.value.filter(t => t.eventId === eventId)
      let count = 0
      eventTickets.forEach(ticket => {
        if (ticket.seats) {
          count += ticket.seats.split(',').length
        }
      })
      return count
    }

    const getEventRevenue = (event) => {
      return getSoldCount(event.id) * event.price
    }

    const formatDate = (date) => {
      if (!date) return ''
      if (date.includes('-')) {
        const parts = date.split('-')
        if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`
        return date
      }
      return date
    }

    const formatPrice = (price) => {
      return price.toLocaleString('ru-RU')
    }

    const deleteEvent = async (id) => {
      if (confirm('Удалить событие?')) {
        await eventsStore.deleteEvent(id)
        await loadData()
      }
    }

    const loadData = async () => {
      try {
        const eventsResponse = await eventsStore.loadEvents()
        events.value = eventsResponse.data || []

        const ticketsResponse = await fetch('http://localhost:3000/tickets')
        tickets.value = await ticketsResponse.json()
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        events.value = []
        tickets.value = []
      }
    }

    onMounted(async () => {
      await loadData()
    })

    return {
      events,
      showCreateModal,
      formatDate,
      formatPrice,
      getSoldCount,
      getEventRevenue,
      deleteEvent,
      totalTicketsSold,
      totalRevenue,
      loadData
    }
  }
}
</script>

<style scoped>
.organizer-content table {
  width: 100% !important;
  min-width: 1200px !important;
  table-layout: fixed !important;
}

.organizer-content table th,
.organizer-content table td {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  padding: 12px 8px !important;
  vertical-align: middle !important;
}

.table-responsive {
  overflow-x: auto !important;
}
</style>
