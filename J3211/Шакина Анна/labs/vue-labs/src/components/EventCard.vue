<template>
  <div class="col">
    <div class="card event-card-custom h-100">
      <div class="event-card-image-wrap">
        <img :src="event.image || 'img/carousel1.webp'"
             :alt="event.title"
             class="event-card-image">
      </div>
      <div class="event-card-body">
        <h5 class="event-card-title">{{ event.title }}</h5>
        <p class="event-card-text">{{ event.description }}</p>
        <div class="event-card-meta">
          <span class="event-meta-pill">{{ formatDate(event.date) }}</span>
          <span class="event-meta-pill">{{ event.place }}</span>
        </div>
        <router-link :to="`/event/${event.id}`" class="site-button mt-2">
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Дата не указана'
      return new Date(date).toLocaleDateString('ru-RU')
    }
  }
}
</script>