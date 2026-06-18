<template>
  <PageShell>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Мои мероприятия</h2>
      <button class="btn btn-primary" type="button" @click="showForm = !showForm">Создать мероприятие</button>
    </div>
    <ul class="ticket-platform__list">
      <li v-if="!organizerEvents.length" class="ticket-platform__list-item">У вас пока нет созданных мероприятий.</li>
      <li v-for="event in organizerEvents" :key="event.id" class="ticket-platform__list-item d-flex justify-content-between align-items-center flex-wrap">
        <div class="me-2">
          <strong>{{ event.title }}</strong><br>
          <span>{{ event.date }} - {{ event.location }}</span><br>
          <small class="text-muted">Продано: {{ stats[event.id]?.sold || 0 }}, Возвраты: {{ stats[event.id]?.returns || 0 }}</small>
        </div>
      </li>
    </ul>
    <div v-if="showForm" class="mt-4">
      <h4>Новое мероприятие</h4>
      <form @submit.prevent="submitEvent">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="newEventTitle" class="form-label">Название</label>
            <input id="newEventTitle" v-model.trim="form.title" type="text" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label for="newEventType" class="form-label">Тип</label>
            <select id="newEventType" v-model="form.type" class="form-select" required>
              <option value="Концерт">Концерт</option>
              <option value="Экскурсия">Экскурсия</option>
              <option value="Другое">Другое</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="newEventDate" class="form-label">Дата</label>
            <input id="newEventDate" v-model="form.date" type="text" class="form-control" placeholder="ГГГГ-ММ-ДД" required>
          </div>
          <div class="col-md-4">
            <label for="newEventLocation" class="form-label">Место</label>
            <input id="newEventLocation" v-model.trim="form.location" type="text" class="form-control" placeholder="Город" required>
          </div>
          <div class="col-md-4">
            <label for="newEventPrice" class="form-label">Цена (₽)</label>
            <input id="newEventPrice" v-model.number="form.price" type="number" class="form-control" min="0" step="1" required>
          </div>
          <div class="col-12">
            <label for="newEventDesc" class="form-label">Описание</label>
            <textarea id="newEventDesc" v-model.trim="form.description" class="form-control" rows="3" required></textarea>
          </div>
          <div class="col-12">
            <label for="newEventPoster" class="form-label">Ссылка на афишу (изображение в jpg)</label>
            <input id="newEventPoster" v-model.trim="form.poster" type="url" class="form-control">
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button type="submit" class="btn btn-primary">Сохранить</button>
          <button type="button" class="btn btn-secondary" @click="showForm = false">Отмена</button>
        </div>
      </form>
    </div>
  </PageShell>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import { useAuth } from '../composables/useAuth'
import { useEvents } from '../composables/useEvents'
import { useTickets } from '../composables/useTickets'
const { user } = useAuth()
const { events, loadEvents, createEvent } = useEvents()
const { loadTicketsByEvent, loadReturnsByEvent } = useTickets()
const showForm = ref(false)
const stats = reactive({})
const form = reactive({
  title: '',
  type: 'Концерт',
  date: '',
  location: '',
  price: 0,
  description: '',
  poster: ''
})
const organizerEvents = computed(() => events.value.filter((event) => event.userId === user.value?.id))
async function loadOrganizerData() {
  await loadEvents({ userId: user.value.id })
  for (const event of events.value) {
    const [sold, returned] = await Promise.all([
      loadTicketsByEvent(event.id),
      loadReturnsByEvent(event.id)
    ])
    stats[event.id] = {
      sold: sold.length,
      returns: returned.length
    }
  }
}
function resetForm() {
  form.title = ''
  form.type = 'Концерт'
  form.date = ''
  form.location = ''
  form.price = 0
  form.description = ''
  form.poster = ''
}
async function submitEvent() {
  try {
    await createEvent({
      title: form.title,
      type: form.type,
      date: form.date,
      location: form.location,
      price: Number(form.price),
      description: form.description,
      poster: form.poster,
      userId: user.value.id
    })
    resetForm()
    showForm.value = false
    await loadOrganizerData()
  } catch (err) {
    alert(err.response?.data || err.message || 'Не удалось создать мероприятие')
  }
}
onMounted(loadOrganizerData)
</script>
