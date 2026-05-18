<template>
  <article class="order-card">
    <div class="order-card__top">
      <div>
        <h2 class="order-card__title">
          <RouterLink v-if="event" class="order-card__link" :to="`/events/${event.id}`">
            {{ event.title }}
          </RouterLink>
          <span v-else>Информация о мероприятии недоступна</span>
        </h2>
        <p v-if="event" class="order-card__meta">{{ event.city }} · {{ event.venue }}</p>
        <p v-if="event" class="order-card__meta">{{ formattedEventDate }} · {{ event.time }}</p>
        <p v-else class="order-card__meta">Данные о событии не удалось загрузить.</p>
      </div>

      <span class="order-card__status" :class="statusClass">
        {{ statusText }}
      </span>
    </div>

    <div class="order-card__grid">
      <div>
        <span class="order-card__label">Количество билетов</span>
        <strong>{{ entry.order.quantity }}</strong>
      </div>
      <div>
        <span class="order-card__label">Сумма</span>
        <strong>{{ formattedTotalPrice }}</strong>
      </div>
      <div>
        <span class="order-card__label">Номер заказа</span>
        <strong>#{{ entry.order.id }}</strong>
      </div>
      <div>
        <span class="order-card__label">Дата заказа</span>
        <strong>{{ formattedCreatedAt }}</strong>
      </div>
    </div>
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

const event = computed(() => props.entry.event || null);

const formattedEventDate = computed(() => {
  if (!event.value?.date) {
    return '';
  }

  const parsedDate = new Date(event.value.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return event.value.date;
  }

  return parsedDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  });
});

const formattedCreatedAt = computed(() => {
  const parsedDate = new Date(props.entry.order.createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return props.entry.order.createdAt;
  }

  return parsedDate.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const formattedTotalPrice = computed(() => {
  return `${Number(props.entry.order.totalPrice || 0).toLocaleString('ru-RU')} ₽`;
});

const statusText = computed(() => {
  if (props.entry.order.status === 'confirmed') {
    return 'Подтверждён';
  }

  if (props.entry.order.status === 'cancelled') {
    return 'Отменён';
  }

  return props.entry.order.status || 'Неизвестно';
});

const statusClass = computed(() => {
  if (props.entry.order.status === 'confirmed') {
    return 'order-card__status--success';
  }

  if (props.entry.order.status === 'cancelled') {
    return 'order-card__status--muted';
  }

  return '';
});
</script>
