<template>
  <section class="view-section">
    <p class="eyebrow">Мероприятие</p>
    <div v-if="isLoading" class="state-box">Загрузка мероприятия...</div>
    <div v-else-if="error" class="state-box state-box--error">
      {{ error }}
      <div class="state-box__actions">
        <RouterLink class="button-link button-link--ghost" to="/">Вернуться в каталог</RouterLink>
      </div>
    </div>
    <template v-else-if="event">
      <div class="event-layout">
        <div class="event-layout__main">
          <h1>{{ event.title }}</h1>
          <p class="view-description">{{ event.description }}</p>

          <div class="details-grid">
            <div class="details-card">
              <span class="details-card__label">Дата</span>
              <strong>{{ formattedDate }}</strong>
            </div>
            <div class="details-card">
              <span class="details-card__label">Время</span>
              <strong>{{ event.time }}</strong>
            </div>
            <div class="details-card">
              <span class="details-card__label">Город</span>
              <strong>{{ event.city }}</strong>
            </div>
            <div class="details-card">
              <span class="details-card__label">Площадка</span>
              <strong>{{ event.venue }}</strong>
            </div>
            <div class="details-card">
              <span class="details-card__label">Категория</span>
              <strong>{{ event.category }}</strong>
            </div>
            <div class="details-card">
              <span class="details-card__label">Цена</span>
              <strong>{{ formattedPrice }}</strong>
            </div>
            <div class="details-card">
              <span class="details-card__label">Доступно билетов</span>
              <strong>{{ ticketsText }}</strong>
            </div>
            <div v-if="event.age" class="details-card">
              <span class="details-card__label">Возраст</span>
              <strong>{{ event.age }}</strong>
            </div>
          </div>

          <div class="event-actions">
            <button class="button-link button-link--ghost" type="button" @click="handleFavoriteToggle">
              {{ currentFavorite ? '★ В избранном' : '☆ В избранное' }}
            </button>
          </div>

          <div v-if="favoriteSuccessMessage" class="state-box state-box--success">{{ favoriteSuccessMessage }}</div>
          <div v-if="favoriteError" class="state-box state-box--error">{{ favoriteError }}</div>

          <div class="event-banner">
            <img class="event-banner__image" :src="event.image" :alt="event.title" />
          </div>
        </div>

        <PurchasePanel
          :event="event"
          :quantity="quantity"
          :is-authenticated="isAuthenticated"
          :is-submitting="isSubmitting"
          :error-message="purchaseError"
          :processing-message="processingMessage"
          :success-message="purchaseSuccessMessage"
          :login-link="loginLink"
          @update:quantity="quantity = $event"
          @purchase="handlePurchase"
        />
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import PurchasePanel from '../components/PurchasePanel.vue';
import { useAuth } from '../composables/useAuth';
import { useEvents } from '../composables/useEvents';
import { useFavorites } from '../composables/useFavorites';
import { useOrders } from '../composables/useOrders';

const router = useRouter();
const route = useRoute();
const { currentEvent: event, isLoading, error, loadEventById } = useEvents();
const { currentUser, isAuthenticated } = useAuth();
const {
  currentFavorite,
  error: favoriteError,
  successMessage: favoriteSuccessMessage,
  clearStatus: clearFavoriteStatus,
  loadFavoriteByUserAndEvent,
  toggleFavorite
} = useFavorites();
const {
  isSubmitting,
  error: purchaseError,
  successMessage: purchaseSuccessMessage,
  clearStatus,
  purchaseTickets
} = useOrders();
const quantity = ref(1);
const processingMessage = ref('');

const formattedDate = computed(() => {
  if (!event.value) {
    return '';
  }

  const parsedDate = new Date(event.value.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return event.value.date;
  }

  return parsedDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
});

const formattedPrice = computed(() => `${Number(event.value?.price || 0).toLocaleString('ru-RU')} ₽`);
const ticketsText = computed(() => {
  const availableTickets = Number(event.value?.availableTickets || 0);
  return availableTickets > 0 ? `${availableTickets} шт.` : 'Нет в наличии';
});
const loginLink = computed(() => ({
  name: 'login',
  query: {
    redirect: route.fullPath
  }
}));

async function fetchCurrentEvent() {
  clearStatus();
  clearFavoriteStatus();
  quantity.value = 1;

  try {
    await loadEventById(route.params.id);

    if (currentUser.value?.id && event.value?.id) {
      await loadFavoriteByUserAndEvent(currentUser.value.id, event.value.id);
    } else {
      currentFavorite.value = null;
    }
  } catch (requestError) {
    // Error state is handled inside the composable.
  }
}

async function handlePurchase() {
  if (!event.value) {
    return;
  }

  if (!isAuthenticated.value) {
    await router.push(loginLink.value);
    return;
  }

  try {
    processingMessage.value = 'Перенаправляем на страницу оплаты...';
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    processingMessage.value = 'Оплата подтверждена. Завершаем оформление билета...';

    const { updatedEvent } = await purchaseTickets({
      user: currentUser.value,
      event: event.value,
      quantity: quantity.value
    });

    event.value = {
      ...event.value,
      ...updatedEvent
    };
    quantity.value = 1;
  } catch (requestError) {
    if (requestError.code === 'EVENT_NOT_FOUND' || requestError.response?.status === 404) {
      try {
        await fetchCurrentEvent();
      } catch (reloadError) {
        // Error state is already handled in the composable.
      }
    } else if (requestError.event) {
      event.value = {
        ...event.value,
        ...requestError.event
      };
    }
  } finally {
    processingMessage.value = '';
  }
}

async function handleFavoriteToggle() {
  if (!event.value) {
    return;
  }

  if (!isAuthenticated.value) {
    await router.push(loginLink.value);
    return;
  }

  clearFavoriteStatus();

  try {
    await toggleFavorite({
      user: currentUser.value,
      event: event.value
    });
  } catch (requestError) {
    // Error state is handled in the composable.
  }
}

onMounted(fetchCurrentEvent);
watch(() => route.params.id, fetchCurrentEvent);
watch(() => currentUser.value?.id, fetchCurrentEvent);
</script>
