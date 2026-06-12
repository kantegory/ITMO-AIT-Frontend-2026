<template>
  <div class="d-flex justify-content-between mb-4">
    <h1>Панель организатора</h1>
    <button class="btn btn-success" @click="showCreateModal = true">+ Создать событие</button>
  </div>

  <table class="table table-striped">
    <thead><tr><th>Название</th><th>Дата</th><th>Место</th><th>Действия</th></tr></thead>
    <tbody>
    <tr v-for="e in events" :key="e.id">
      <td>{{ e.title }}</td>
      <td>{{ e.dates?.[0]?.datetime ? new Date(e.dates[0].datetime).toLocaleDateString('ru-RU') : '-' }}</td>
      <td>{{ e.venue?.name }}</td>
      <td><button class="btn btn-sm btn-outline-danger" @click="deleteEvent(e.id)">Удалить</button></td>
    </tr>
    </tbody>
  </table>
  <div v-if="events.length===0" class="text-center text-muted py-4">Нет мероприятий</div>

  <!-- Модальное окно создания -->
  <div v-if="showCreateModal" class="modal d-block" style="background:rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header"><h5>Новое событие</h5><button class="btn-close" @click="showCreateModal = false"></button></div>
        <form @submit.prevent="createEvent" class="modal-body">
          <div class="mb-3"><input v-model="newEvent.title" class="form-control" placeholder="Название" required></div>
          <div class="row mb-3">
            <div class="col"><select v-model="newEvent.type" class="form-select">
              <option value="theater">Театр</option><option value="concert">Концерт</option>
            </select></div>
            <div class="col"><input v-model="newEvent.ageRestriction" class="form-control" placeholder="16+"></div>
          </div>
          <div class="mb-3"><textarea v-model="newEvent.description" class="form-control" placeholder="Описание" rows="2"></textarea></div>
          <div class="mb-3"><input v-model="newEvent.poster" class="form-control" placeholder="Ссылка на постер"></div>
          <div class="row mb-3">
            <div class="col"><input v-model="newVenue.name" class="form-control" placeholder="Площадка" required></div>
            <div class="col"><input v-model="newVenue.address" class="form-control" placeholder="Адрес"></div>
          </div>
          <div class="mb-3"><input v-model="newDate" type="datetime-local" class="form-control" required></div>
          <button class="btn btn-primary w-100">Создать</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { EventsAPI } from '@/api/endpoints'

const { currentUser, hasRole } = useAuth()
const events = ref([])
const showCreateModal = ref(false)

const newEvent = reactive({ title: '', type: 'theater', ageRestriction: '16+', description: '', poster: '' })
const newVenue = reactive({ name: '', address: '' })
const newDate = ref('')

onMounted(async () => {
  if (hasRole('organizer')) {
    events.value = await EventsAPI.getAll({ organizerId: currentUser.value.id })
  }
})

const deleteEvent = async (id) => {
  if (confirm('Удалить?')) {
    await EventsAPI.delete(id)
    events.value = await EventsAPI.getAll({ organizerId: currentUser.value.id })
  }
}

const createEvent = async () => {
  const eventData = {
    ...newEvent,
    venue: { ...newVenue },
    organizerId: currentUser.value.id,
    dates: [{ id: `d${Date.now()}`, datetime: new Date(newDate.value).toISOString(), available: true }],
    prices: { standard: { name: 'Стандарт', price: 1000 } },
    createdAt: new Date().toISOString()
  }

  await EventsAPI.create(eventData)
  showCreateModal.value = false
  newEvent.title = ''; newEvent.description = ''; newEvent.poster = ''
  newVenue.name = ''; newVenue.address = ''
  newDate.value = ''

  events.value = await EventsAPI.getAll({ organizerId: currentUser.value.id })
}
</script>