<template>
  <article class="event-card">
    <img class="event-card__image" :src="event.image" :alt="event.title" />
    <div class="event-card__content">
      <div class="event-card__header">
        <div>
          <h2 class="event-card__title">{{ event.title }}</h2>
          <p class="event-card__meta event-card__meta--with-icon">
            <SvgIcon name="icon-location" />
            <span>{{ event.city }} · {{ event.venue }}</span>
          </p>
          <p class="event-card__meta event-card__meta--with-icon">
            <SvgIcon name="icon-calendar" />
            <span>{{ formattedDate }} · {{ event.time }}</span>
          </p>
        </div>
        <span class="event-card__category">{{ event.category }}</span>
      </div>

      <p class="event-card__description">{{ event.description }}</p>

      <div class="event-card__footer">
        <span class="event-card__price">от {{ formattedPrice }}</span>
        <RouterLink class="button-link button-link--ghost" :to="`/events/${event.id}`">
          Подробнее
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});

const formattedDate = computed(() => {
  const parsedDate = new Date(props.event.date);

  if (Number.isNaN(parsedDate.getTime())) {
    return props.event.date;
  }

  return parsedDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  });
});

const formattedPrice = computed(() => `${Number(props.event.price || 0).toLocaleString('ru-RU')} ₽`);
</script>
