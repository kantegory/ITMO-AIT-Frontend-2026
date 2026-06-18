<template>
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card ticket-platform__card h-100">
      <img :src="event.poster" class="ticket-platform__event-image card-img-top" :alt="`Афиша «${event.title}»`">
      <div class="card-body d-flex flex-column">
        <h3 class="card-title">{{ event.title }}</h3>
        <p class="mb-2"><strong><SvgIcon name="activity" custom-class="me-1" />Тип:</strong> {{ event.type }}</p>
        <p class="mb-2"><strong><SvgIcon name="calendar" custom-class="me-1" />Дата:</strong> {{ event.date }}</p>
        <p class="mb-2"><strong><SvgIcon name="location" custom-class="me-1" />Место:</strong> {{ event.location }}</p>
        <p class="card-text ticket-platform__text-truncate">{{ event.description }}</p>
        <div class="mt-auto">
          <RouterLink :to="`/event/${event.id}`" class="btn btn-primary w-100">Подробнее</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SvgIcon from './SvgIcon.vue'
defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>
