<template>
  <article class="favorite-card">
    <template v-if="entry.event">
      <img class="favorite-card__image" :src="entry.event.image" :alt="entry.event.title" />
      <div class="favorite-card__content">
        <h2 class="favorite-card__title">
          <RouterLink :to="`/events/${entry.event.id}`">{{ entry.event.title }}</RouterLink>
        </h2>
        <p class="favorite-card__meta">{{ entry.event.city }} · {{ entry.event.venue }}</p>
        <p class="favorite-card__meta">{{ formattedEventDate }} · {{ entry.event.time }}</p>
        <div class="favorite-card__footer">
          <span class="event-card__price">от {{ formattedPrice }}</span>
          <span class="favorite-card__added">Добавлено: {{ formattedCreatedAt }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="favorite-card__content">
        <h2 class="favorite-card__title">Информация о мероприятии недоступна</h2>
        <p class="favorite-card__meta">Событие было удалено или временно недоступно.</p>
        <div class="favorite-card__footer">
          <span class="favorite-card__added">Добавлено: {{ formattedCreatedAt }}</span>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
});

const formattedEventDate = computed(() => {
  if (!props.entry.event?.date) {
    return '';
  }

  const parsedDate = new Date(props.entry.event.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return props.entry.event.date;
  }

  return parsedDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  });
});

const formattedCreatedAt = computed(() => {
  const parsedDate = new Date(props.entry.favorite.createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return props.entry.favorite.createdAt;
  }

  return parsedDate.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const formattedPrice = computed(() => `${Number(props.entry.event?.price || 0).toLocaleString('ru-RU')} ₽`);
</script>
