<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import PageLoading from "../components/common/PageLoading.vue";
import { useSession } from "../composables/useSession";
import { fetchJson } from "../services/api";
import { formatCurrency, formatDate, formatEventDateTime, formatTime, getBadgeClassByType } from "../utils/formatters";

const route = useRoute();
const router = useRouter();
const { isAuthenticated, role, getAuthHeaders } = useSession();

const isLoading = ref(true);
const errorMessage = ref("");
const successMessage = ref("");
const isSubmitting = ref(false);

const eventData = ref(null);
const reviews = ref([]);
const similarEvents = ref([]);
const selectedSeats = ref([]);
const showPurchaseConfirm = ref(false);

const selectedCount = computed(() => selectedSeats.value.length);
const selectedSeatText = computed(() => selectedSeats.value.length ? selectedSeats.value.join(", ") : "Нет");
const canPurchase = computed(() => selectedSeats.value.length > 0);
const totalPrice = computed(() => selectedSeats.value.length * Number(eventData.value?.price || 0));
const busySeats = computed(() => new Set(eventData.value?.unavailableSeats || []));

function isSeatSelected(seat) {
  return selectedSeats.value.includes(seat);
}

function toggleSeat(seat) {
  if (busySeats.value.has(seat)) {
    return;
  }

  if (isSeatSelected(seat)) {
    selectedSeats.value = selectedSeats.value.filter((item) => item !== seat);
  } else {
    selectedSeats.value = [...selectedSeats.value, seat].sort();
  }
}

function openPurchasePanel() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!isAuthenticated.value) {
    router.push({
      name: "login",
      query: { redirect: route.fullPath }
    });
    return;
  }

  if (role.value !== "user") {
    errorMessage.value = "Покупка билетов доступна только для аккаунта покупателя.";
    return;
  }

  showPurchaseConfirm.value = true;
}

async function confirmPurchase() {
  if (!eventData.value || !selectedSeats.value.length) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const response = await fetchJson("/tickets/purchase", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        eventId: eventData.value.id,
        seats: selectedSeats.value
      })
    });

    successMessage.value = response.message;
    selectedSeats.value = [];
    showPurchaseConfirm.value = false;
    await loadEvent();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}

async function loadEvent() {
  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  showPurchaseConfirm.value = false;
  selectedSeats.value = [];

  try {
    const response = await fetchJson(`/events/${route.params.id}`);
    eventData.value = response.event;
    reviews.value = response.reviews;
    similarEvents.value = response.similarEvents;
  } catch (error) {
    errorMessage.value = error.message;
    eventData.value = null;
    reviews.value = [];
    similarEvents.value = [];
  } finally {
    isLoading.value = false;
  }
}

watch(() => route.params.id, loadEvent, { immediate: true });
</script>

<template>
  <div class="container">
    <div v-if="errorMessage" class="alert alert-danger" role="status" aria-live="polite">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="alert alert-success" role="status" aria-live="polite">
      {{ successMessage }}
    </div>

    <PageLoading v-if="isLoading">Загрузка информации о событии...</PageLoading>

    <template v-else-if="eventData">
      <img class="event-cover mb-4" :src="eventData.image" :alt="eventData.title">

      <div class="row g-4">
        <section class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body p-4">
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge" :class="getBadgeClassByType(eventData.type)">{{ eventData.typeLabel }}</span>
                <span class="quick-chip">{{ formatEventDateTime(eventData.dateTime) }}</span>
                <span class="quick-chip">{{ eventData.cityLabel }}, {{ eventData.venue }}</span>
              </div>

              <h1 class="h2 fw-bold">{{ eventData.title }}</h1>
              <p class="text-secondary mb-0">{{ eventData.description }}</p>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-body p-4">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h2 class="h4 fw-bold mb-0">Схема зала</h2>
                <p class="mb-0 text-secondary">
                  {{ eventData.seatsAvailable }} из {{ eventData.allSeats.length }} мест свободно
                </p>
              </div>

              <div class="seat-zone">
                <div class="stage">СЦЕНА</div>
                <div class="seat-grid" role="group" aria-label="Выбор мест">
                  <button
                    v-for="seat in eventData.allSeats"
                    :key="seat"
                    type="button"
                    class="seat-btn"
                    :class="{ unavailable: busySeats.has(seat), selected: isSeatSelected(seat) }"
                    :disabled="busySeats.has(seat)"
                    @click="toggleSeat(seat)"
                  >
                    {{ seat }}
                  </button>
                </div>
              </div>

              <div class="mt-4 d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between">
                <div>
                  <p class="mb-1">Выбрано мест: <strong>{{ selectedCount }}</strong></p>
                  <p class="mb-0 text-secondary">Ряд/места: <span>{{ selectedSeatText }}</span></p>
                </div>
                <button class="btn btn-primary" type="button" :disabled="!canPurchase" @click="openPurchasePanel">
                  Купить билеты
                </button>
              </div>

              <div v-if="showPurchaseConfirm" class="card mt-4">
                <div class="card-body">
                  <h3 class="h5 fw-bold mb-3">Подтверждение покупки</h3>
                  <p class="mb-2">Выбранные места: <strong>{{ selectedSeatText }}</strong></p>
                  <p class="mb-3">Итого к оплате: <strong>{{ formatCurrency(totalPrice) }}</strong></p>
                  <div class="d-flex flex-wrap gap-2">
                    <button type="button" class="btn btn-outline-secondary" @click="showPurchaseConfirm = false">
                      Отмена
                    </button>
                    <button type="button" class="btn btn-primary" :disabled="isSubmitting" @click="confirmPurchase">
                      {{ isSubmitting ? "Оплачиваем..." : "Оплатить" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body p-4">
              <h2 class="h4 fw-bold mb-3">Отзывы</h2>
              <div v-if="reviews.length" class="d-grid gap-3" role="list">
                <article v-for="review in reviews" :key="review.id" class="review-card" role="listitem">
                  <h3 class="h6 mb-1">{{ review.author }}</h3>
                  <p class="small text-secondary mb-2">Оценка: {{ review.rating }}/5</p>
                  <p class="mb-0">{{ review.text }}</p>
                </article>
              </div>
              <p v-else class="mb-0 text-secondary">
                Пока нет отзывов. Станьте первым посетителем, который оценит это событие.
              </p>
            </div>
          </div>
        </section>

        <aside class="col-lg-4">
          <div class="card mb-4">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Информация</h2>
              <ul class="list-unstyled d-grid gap-2 mb-0 event-meta">
                <li><strong class="text-dark">Дата:</strong> {{ formatDate(eventData.dateTime) }}</li>
                <li><strong class="text-dark">Время:</strong> {{ formatTime(eventData.dateTime) }}</li>
                <li><strong class="text-dark">Место:</strong> {{ eventData.venue }}</li>
                <li><strong class="text-dark">Адрес:</strong> {{ eventData.address }}</li>
                <li><strong class="text-dark">Цена:</strong> от {{ formatCurrency(eventData.price) }}</li>
              </ul>
            </div>
          </div>

          <div class="card">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Похожие события</h2>
              <div v-if="similarEvents.length" class="d-grid gap-3">
                <RouterLink
                  v-for="similarEvent in similarEvents"
                  :key="similarEvent.id"
                  class="text-decoration-none d-block"
                  :to="{ name: 'event-details', params: { id: similarEvent.id } }"
                >
                  {{ similarEvent.title }}, {{ formatDate(similarEvent.dateTime) }}
                </RouterLink>
              </div>
              <p v-else class="mb-0 text-secondary">Похожие события появятся позже.</p>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
