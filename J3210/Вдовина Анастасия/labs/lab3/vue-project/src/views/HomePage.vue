<template>
  <base-layout>
    <template #hero>
      <section class="hero">
        <div class="container text-center">
          <h1 class="hero__title display-5">Найди своё следующее событие</h1>
          <p class="lead mb-4">Концерты и студенческие фестивали — билеты и регистрация в одном месте</p>

          <form class="row justify-content-center g-2" role="search" aria-label="Быстрый поиск мероприятий" @submit.prevent="onSearch">
            <div class="col-12 col-md-6">
              <label for="quickSearch" class="visually-hidden">Название мероприятия или город</label>
              <input
                id="quickSearch"
                v-model="query"
                type="search"
                class="form-control form-control-lg"
                placeholder="Например: Москва или «Рок-фест»"
              />
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-light btn-lg"><icon-component name="search" /> Искать</button>
            </div>
          </form>
        </div>
      </section>
    </template>

    <div class="d-flex justify-content-between align-items-end mb-4">
      <h2 class="mb-0">Ближайшие мероприятия</h2>
      <router-link class="link-secondary" :to="{ name: 'events' }">Все мероприятия →</router-link>
    </div>

    <p v-if="isLoading" class="text-muted">Загружаем мероприятия…</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>

    <div v-else class="row g-4" aria-live="polite">
      <div v-for="event in nearest" :key="event.id" class="col-12 col-sm-6 col-lg-4">
        <event-card :event="event" heading-tag="h3" />
      </div>
    </div>

    <div class="row g-4 text-center mt-4">
      <div class="col-md-4">
        <div class="p-4">
          <h3 class="h5">Организуете мероприятие?</h3>
          <p class="text-muted">Создавайте события и управляйте продажами билетов в личном кабинете организатора.</p>
          <router-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'organizer' }">
            Кабинет организатора
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-4">
          <h3 class="h5">Уже купили билет?</h3>
          <p class="text-muted">Все ваши билеты и возвраты — в личном кабинете.</p>
          <router-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'profile' }">Личный кабинет</router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-4">
          <h3 class="h5">Нет аккаунта?</h3>
          <p class="text-muted">Зарегистрируйтесь за минуту и получайте уведомления о новых событиях.</p>
          <router-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'register' }">Регистрация</router-link>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapState } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/events/EventCard.vue'
import IconComponent from '@/components/common/IconComponent.vue'
import useEventsStore from '@/stores/events'
import { useRequest } from '@/composables/useRequest'

export default {
  name: 'HomePage',
  components: { BaseLayout, EventCard, IconComponent },

  setup() {
    const store = useEventsStore()
    const { isLoading, error, run } = useRequest(() => store.loadEvents())

    return { isLoading, error, run }
  },

  data() {
    return {
      query: '',
    }
  },

  computed: {
    ...mapState(useEventsStore, ['events']),

    nearest() {
      return this.events.slice(0, 6)
    },
  },

  methods: {
    onSearch() {
      this.$router.push({ name: 'events', query: { q: this.query } })
    },
  },

  mounted() {
    this.run()
  },
}
</script>
