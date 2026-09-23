<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import PageLoading from "../components/common/PageLoading.vue";
import { useSession } from "../composables/useSession";
import { fetchJson } from "../services/api";
import { formatEventDateTime, getReturnStatusLabel } from "../utils/formatters";

const { getAuthHeaders } = useSession();

const isLoading = ref(true);
const errorMessage = ref("");
const profile = ref(null);
const stats = ref({ ticketsCount: 0 });
const tickets = ref([]);
const returns = ref([]);

const activeTickets = computed(() => tickets.value.filter((ticket) => ticket.status === "paid"));

async function loadCabinet() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const [profileResponse, ticketsResponse] = await Promise.all([
      fetchJson("/auth/profile", { headers: getAuthHeaders() }),
      fetchJson("/tickets/my", { headers: getAuthHeaders() })
    ]);

    profile.value = profileResponse.user;
    stats.value = profileResponse.stats;
    tickets.value = ticketsResponse.tickets;
    returns.value = ticketsResponse.returns;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

async function handleReturn(ticket) {
  const isConfirmed = window.confirm(`Вы действительно хотите оформить возврат по заказу ${ticket.orderNumber}?`);
  if (!isConfirmed) {
    return;
  }

  try {
    await fetchJson(`/tickets/${ticket.id}/return`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    await loadCabinet();
  } catch (error) {
    errorMessage.value = error.message;
  }
}

onMounted(loadCabinet);
</script>

<template>
  <div class="container">
    <div v-if="errorMessage" class="alert alert-danger" role="status" aria-live="polite">
      {{ errorMessage }}
    </div>

    <PageLoading v-if="isLoading">Загрузка личного кабинета...</PageLoading>

    <div v-else class="row g-4">
      <section class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body p-4">
            <h1 class="h3 fw-bold mb-3">Личный кабинет пользователя</h1>
            <p class="text-secondary mb-0">
              Здесь отображаются купленные билеты, даты мероприятий и статус возврата из mock API.
            </p>
          </div>
        </div>

        <div v-if="activeTickets.length" class="d-grid gap-3" role="list">
          <article
            v-for="ticket in activeTickets"
            :key="ticket.id"
            class="card ticket-card"
            role="listitem"
          >
            <div class="card-body p-4">
              <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
                <h2 class="h5 mb-0">{{ ticket.event?.title || "Событие" }}</h2>
                <span class="badge text-bg-success ticket-status">Оплачен</span>
              </div>

              <p class="event-meta mb-2">
                {{ formatEventDateTime(ticket.event?.dateTime) }} · {{ ticket.event?.venue || "-" }} · Места:
                {{ ticket.seats.join(", ") }}
              </p>

              <p class="small mb-3">Номер заказа: <strong>{{ ticket.orderNumber }}</strong></p>

              <div class="d-flex flex-wrap gap-2">
                <RouterLink class="btn btn-outline-primary btn-sm" :to="{ name: 'event-details', params: { id: ticket.eventId } }">
                  Открыть событие
                </RouterLink>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="handleReturn(ticket)">
                  Оформить возврат
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="card">
          <div class="card-body p-4 text-secondary">Активных билетов пока нет.</div>
        </div>
      </section>

      <aside class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body p-4">
            <h2 class="h5 fw-bold mb-3">Профиль</h2>
            <ul class="list-unstyled d-grid gap-2 mb-0 event-meta">
              <li><strong class="text-dark">Пользователь:</strong> {{ profile?.firstName }} {{ profile?.lastName }}</li>
              <li><strong class="text-dark">Email:</strong> {{ profile?.email }}</li>
              <li><strong class="text-dark">Телефон:</strong> {{ profile?.phone }}</li>
              <li><strong class="text-dark">Билетов куплено:</strong> {{ stats.ticketsCount }}</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-4">
            <h2 class="h5 fw-bold mb-3">История возвратов</h2>
            <ul class="list-group list-group-flush">
              <li v-for="item in returns" :key="item.id" class="list-group-item px-0">
                {{ item.ticket?.orderNumber || "Заказ" }} · Статус: {{ getReturnStatusLabel(item.status) }}
              </li>
              <li v-if="!returns.length" class="list-group-item px-0 text-secondary">
                История возвратов пока пуста.
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
