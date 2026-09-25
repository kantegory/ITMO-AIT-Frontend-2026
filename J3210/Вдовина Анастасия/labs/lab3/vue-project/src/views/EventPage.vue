<template>
  <base-layout>
    <p v-if="isLoading" class="text-muted">Загружаем мероприятие…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>

    <nav v-else-if="currentEvent" aria-label="Хлебные крошки" class="mb-3">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><router-link :to="{ name: 'home' }">Главная</router-link></li>
        <li class="breadcrumb-item"><router-link :to="{ name: 'events' }">Мероприятия</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ currentEvent.title }}</li>
      </ol>
    </nav>

    <article v-if="currentEvent && !isLoading && !error" class="row g-4">
      <div class="col-12 col-lg-8">
        <div class="event-hero mb-3" :style="{ backgroundImage: `url('${currentEvent.image}')` }">
          <img :src="currentEvent.image" class="event-hero__image" :alt="`Афиша: ${currentEvent.title}`" />
        </div>

        <div class="d-flex flex-wrap gap-2 mb-3">
          <span v-for="badge in currentEvent.badges" :key="badge" class="badge text-bg-light">{{ badge }}</span>
        </div>

        <h1>{{ currentEvent.title }}</h1>
        <p class="text-muted">
          {{ currentEvent.dateLabel }}<span v-if="currentEvent.timeLabel">, {{ currentEvent.timeLabel }}</span>
          · {{ currentEvent.venueFull }}
        </p>

        <section aria-labelledby="descriptionHeading" class="mb-5">
          <h2 id="descriptionHeading" class="h4">Описание</h2>
          <p style="white-space: pre-line">{{ currentEvent.description }}</p>
        </section>

        <section v-if="currentEvent.priceTiers && currentEvent.priceTiers.length" aria-labelledby="pricingHeading" class="mb-5">
          <h2 id="pricingHeading" class="h4">Категории билетов</h2>

          <div class="table-responsive">
            <table class="table align-middle">
              <caption class="visually-hidden">Стоимость билетов по категориям</caption>
              <thead>
                <tr>
                  <th scope="col">Категория</th>
                  <th scope="col">Цена</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tier in currentEvent.priceTiers" :key="tier.name">
                  <td>{{ tier.name }}</td>
                  <td>{{ tier.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="currentEvent.warning" class="alert alert-warning mb-5" role="alert">
          <strong>Внимание.</strong> {{ currentEvent.warning }}
        </div>

        <section aria-labelledby="venueHeading" class="mb-5">
          <h2 id="venueHeading" class="h4">Место проведения</h2>
          <p>{{ currentEvent.venueDescription }}</p>
          <div class="venue-map" role="img" aria-label="Схема площадки">{{ currentEvent.venueMapLabel }}</div>
        </section>

        <section aria-labelledby="reviewsHeading">
          <review-list :reviews="currentEvent.reviews || []" />

          <form v-if="isAuthenticated" class="border-top pt-3 mt-3" aria-label="Оставить отзыв" @submit.prevent="onReview">
            <h3 class="h6">Оставить отзыв</h3>

            <div class="row g-2">
              <div class="col-12 col-sm-6">
                <label for="reviewAuthor" class="form-label">Ваше имя</label>
                <input id="reviewAuthor" v-model="review.author" type="text" class="form-control" required />
              </div>

              <div class="col-12 col-sm-6">
                <label for="reviewRating" class="form-label">Оценка</label>
                <select id="reviewRating" v-model.number="review.rating" class="form-select">
                  <option :value="5">5 — отлично</option>
                  <option :value="4">4 — хорошо</option>
                  <option :value="3">3 — нормально</option>
                  <option :value="2">2 — плохо</option>
                  <option :value="1">1 — ужасно</option>
                </select>
              </div>

              <div class="col-12">
                <label for="reviewText" class="form-label">Отзыв</label>
                <textarea id="reviewText" v-model="review.text" class="form-control" rows="3" required />
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-brand">Отправить отзыв</button>
              </div>
            </div>
          </form>

          <p v-else class="text-muted border-top pt-3 mt-3">
            Чтобы оставить отзыв, <router-link :to="{ name: 'login' }">войдите</router-link>.
          </p>
        </section>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card p-3 sticky-top" style="top: 1rem">
          <h2 class="h5">{{ currentEvent.free ? 'Участие' : 'Билеты' }}</h2>
          <p class="fs-4 fw-semibold">{{ currentEvent.priceLabel }}</p>

          <p v-if="currentEvent.free" class="text-muted">{{ currentEvent.participationNote }}</p>

          <template v-if="!currentEvent.free">
            <label for="ticketQuantity" class="form-label">Количество</label>
            <input
              id="ticketQuantity"
              v-model.number="quantity"
              type="number"
              class="form-control mb-3"
              min="1"
              max="10"
            />

            <p class="mb-3">Итого от: <span class="fw-semibold">{{ total }} ₽</span></p>
          </template>

          <div v-else-if="currentEvent.participationOptions" class="mb-3">
            <label for="participationOption" class="form-label">{{ currentEvent.participationOptions.label }}</label>
            <select id="participationOption" v-model="category" class="form-select">
              <option v-for="value in currentEvent.participationOptions.values" :key="value">{{ value }}</option>
            </select>
          </div>

          <button type="button" class="btn btn-brand w-100" @click="openModal">
            <icon-component name="ticket" />
            {{ currentEvent.free ? 'Записаться' : 'Купить билет' }}
          </button>

          <p v-if="ticketMessage" class="mt-3 mb-0" aria-live="polite" :class="ticketError ? 'text-danger' : 'text-success'">
            {{ ticketMessage }}
          </p>
        </div>
      </div>
    </article>

    <modal-dialog
      v-if="isModalOpen"
      :title="currentEvent.free ? `Запись на «${currentEvent.title}»` : 'Оформление билета'"
      @close="isModalOpen = false"
    >
      <p>{{ currentEvent.title }} · {{ currentEvent.dateLabel }}</p>

      <div v-if="currentEvent.free" class="mb-3">
        <label for="contactName" class="form-label">Имя и фамилия</label>
        <input id="contactName" v-model="contact.name" type="text" class="form-control" required />
      </div>

      <div v-else class="mb-3">
        <label for="modalCategory" class="form-label">Категория</label>
        <select id="modalCategory" v-model="category" class="form-select">
          <option v-for="name in categories" :key="name">{{ name }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="contactEmail" class="form-label">Email для отправки билета</label>
        <input id="contactEmail" v-model="contact.email" type="email" class="form-control" required />
      </div>

      <div v-if="modalError" class="alert alert-danger" role="alert">{{ modalError }}</div>

      <template #footer>
        <button type="button" class="btn btn-brand" @click="onBuy">
          {{ currentEvent.free ? 'Записаться' : 'Подтвердить покупку' }}
        </button>
      </template>
    </modal-dialog>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import ReviewList from '@/components/events/ReviewList.vue'
import IconComponent from '@/components/common/IconComponent.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import useEventsStore from '@/stores/events'
import useAuthStore from '@/stores/auth'
import useTicketsStore from '@/stores/tickets'
import { useRequest } from '@/composables/useRequest'

export default {
  name: 'EventPage',
  components: { BaseLayout, ReviewList, IconComponent, ModalDialog },

  setup() {
    const store = useEventsStore()
    const { isLoading, error, run } = useRequest((id) => store.loadEvent(id))

    return { isLoading, error, run }
  },

  data() {
    return {
      category: '',
      quantity: 1,
      review: { author: '', rating: 5, text: '' },
      modalError: '',
      contact: { name: '', email: '' },
      isModalOpen: false,
      ticketMessage: '',
      ticketError: false,
    }
  },

  computed: {
    ...mapState(useEventsStore, ['currentEvent']),
    ...mapState(useAuthStore, ['user', 'isAuthenticated']),

    total() {
      return ((this.quantity || 1) * (this.currentEvent?.priceFrom || 0)).toLocaleString('ru-RU')
    },

    categories() {
      const tiers = this.currentEvent?.priceTiers || []

      return tiers.length ? tiers.map(({ name }) => name) : ['Стандарт']
    },
  },

  methods: {
    ...mapActions(useTicketsStore, ['buyTicket']),
    ...mapActions(useEventsStore, ['saveReviews']),

    openModal() {
      if (!this.isAuthenticated) {
        this.ticketError = true
        this.ticketMessage = 'Нужно войти в аккаунт.'
        return
      }

      this.contact = { name: this.user.name, email: this.user.email }
      this.modalError = ''
      this.isModalOpen = true
    },

    async onBuy() {
      try {
        await this.buyTicket({
          userId: Number(this.user.id),
          eventId: this.currentEvent.id,
          category: this.category || (this.currentEvent.free ? 'Бесплатная регистрация' : 'Стандарт'),
          status: 'active',
        })
      } catch (error) {
        this.modalError = 'Не удалось оформить запись. Попробуйте ещё раз.'
        return
      }

      this.isModalOpen = false

      this.$router.push({ name: 'profile' })
    },

    async onReview() {
      const reviews = [{ author: this.review.author, rating: this.review.rating, text: this.review.text }]
        .concat(this.currentEvent.reviews || [])

      await this.saveReviews(this.currentEvent.id, reviews)

      this.review.text = ''
    },
  },

  async mounted() {
    if (this.user) this.review.author = this.user.name

    await this.run(this.$route.params.id)

    if (!this.currentEvent) return

    const options = this.currentEvent.participationOptions?.values

    this.category = this.currentEvent.free ? (options ? options[0] : 'Бесплатная регистрация') : this.categories[0]
  },
}
</script>


