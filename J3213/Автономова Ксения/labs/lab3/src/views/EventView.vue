<template>
  <PageShell main-class="container my-4 flex-grow-1">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="eventItem" class="row">
      <div class="col-md-4">
        <img :src="eventItem.poster" class="img-fluid rounded" :alt="eventItem.title ? `Афиша «${eventItem.title}»` : 'Афиша'">
      </div>
      <div class="col-md-8">
        <h2>{{ eventItem.title }}</h2>
        <p><strong><SvgIcon name="activity" custom-class="me-1" />Тип:</strong> {{ eventItem.type }}</p>
        <p><strong><SvgIcon name="calendar" custom-class="me-1" />Дата:</strong> {{ eventItem.date }}</p>
        <p><strong><SvgIcon name="location" custom-class="me-1" />Место:</strong> {{ eventItem.location }}</p>
        <p><strong>Цена:</strong> {{ eventItem.price }} ₽</p>
        <p class="ticket-platform__text-wrap">{{ eventItem.description }}</p>
        <div class="mt-3">
          <button class="btn" :class="userRole === 'organizer' ? 'btn-secondary' : 'btn-success'" type="button" :disabled="userRole === 'organizer' || buying" @click="handleBuyTicket">
            {{ userRole === 'organizer' ? 'Организатор не может покупать билеты' : buying ? 'Покупка...' : 'Купить билет' }}
          </button>
        </div>
        <div v-if="message" class="alert alert-success mt-3" role="alert">{{ message }}</div>
      </div>
    </div>
    <SeatMap v-if="eventItem" v-model:selected-seat="selectedSeat" :show="eventItem.type === 'Концерт'" :taken-seats="takenSeats" />
    <div v-if="eventItem" class="mt-4">
      <h3>Отзывы</h3>
      <div v-if="!reviews.length">
        <p class="text-muted">Отзывов пока нет.</p>
      </div>
      <div v-for="review in reviews" :key="review.id" class="mb-3">
        <strong>{{ review.author }}</strong><br>
        <span>{{ review.text }}</span>
      </div>
      <form class="mt-3" @submit.prevent="submitReview">
        <div class="mb-3">
          <label for="reviewAuthor" class="form-label">Ваше имя</label>
          <input id="reviewAuthor" v-model.trim="reviewForm.author" type="text" class="form-control" placeholder="Имя">
        </div>
        <div class="mb-3">
          <label for="reviewText" class="form-label">Ваш отзыв</label>
          <textarea id="reviewText" v-model.trim="reviewForm.text" class="form-control" rows="3" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Отправить отзыв</button>
      </form>
    </div>
  </PageShell>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageShell from '../components/PageShell.vue'
import SeatMap from '../components/SeatMap.vue'
import SvgIcon from '../components/SvgIcon.vue'
import { useAuth } from '../composables/useAuth'
import { useEvents } from '../composables/useEvents'
import { useReviews } from '../composables/useReviews'
import { useTickets } from '../composables/useTickets'
const route = useRoute()
const { user, userRole } = useAuth()
const { eventItem, loading, loadEvent } = useEvents()
const { reviews, loadReviews, createReview } = useReviews()
const { loadTicketsByEvent, loadReturnsByEvent, buyTicket } = useTickets()
const selectedSeat = ref(null)
const takenSeats = ref([])
const message = ref('')
const buying = ref(false)
const reviewForm = reactive({
  author: '',
  text: ''
})
const eventId = computed(() => Number(route.params.id))
async function loadTakenSeats() {
  const [sold, returned] = await Promise.all([
    loadTicketsByEvent(eventId.value),
    loadReturnsByEvent(eventId.value)
  ])
  const returnedKeys = new Set(returned.filter((item) => item.seat).map((item) => `${item.eventId}:${item.seat}`))
  takenSeats.value = sold.filter((ticket) => ticket.seat && !returnedKeys.has(`${ticket.eventId}:${ticket.seat}`)).map((ticket) => String(ticket.seat))
}
async function handleBuyTicket() {
  if (!eventItem.value) return
  if (eventItem.value.type === 'Концерт' && !selectedSeat.value) {
    alert('Выберите место для покупки')
    return
  }
  buying.value = true
  try {
    await buyTicket({
      eventId: eventId.value,
      seat: eventItem.value.type === 'Концерт' ? selectedSeat.value : null,
      purchaseDate: new Date().toISOString(),
      userId: user.value.id
    })
    message.value = `Билет на «${eventItem.value.title}» успешно приобретён! Его можно посмотреть в разделе «Мои билеты».`
    selectedSeat.value = null
    await loadTakenSeats()
  } catch (err) {
    alert(err.response?.data || err.message || 'Не удалось приобрести билет')
  } finally {
    buying.value = false
  }
}
async function submitReview() {
  if (!reviewForm.text) return
  try {
    await createReview({
      eventId: eventId.value,
      author: reviewForm.author || 'Аноним',
      text: reviewForm.text,
      date: new Date().toLocaleDateString('ru-RU'),
      userId: user.value.id
    })
    reviewForm.author = ''
    reviewForm.text = ''
    await loadReviews(eventId.value)
  } catch (err) {
    alert(err.response?.data || err.message || 'Не удалось отправить отзыв')
  }
}
onMounted(async () => {
  await loadEvent(eventId.value)
  await Promise.all([loadTakenSeats(), loadReviews(eventId.value)])
})
</script>
