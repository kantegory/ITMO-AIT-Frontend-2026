<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEvents } from '../composables/useEvents';
import { useAuth } from '../composables/useAuth';
import { useTickets } from '../composables/useTickets';
import { useAlert } from '../composables/useAlert';
import HallScheme from '../components/HallScheme.vue';
import EventReviews from '../components/EventReviews.vue';
import AlertMessage from '../components/AlertMessage.vue';

const route = useRoute();
const { fetchEventById } = useEvents();
const { currentUser, isAuthenticated } = useAuth();
const { buyTicket } = useTickets();
const { alert, showAlert } = useAlert();

const event = ref(null);
const loading = ref(true);
const buying = ref(false);

onMounted(async () => {
  loading.value = true;
  event.value = await fetchEventById(route.params.id);
  loading.value = false;
});

async function confirmPurchase() {
  if (!isAuthenticated.value) {
    showAlert('warning', 'Сначала выполните вход.');
    return;
  }
  buying.value = true;
  try {
    await buyTicket({
      userId: currentUser.value.id,
      title: event.value.title,
      date: event.value.date,
      location: event.value.location,
      status: 'Оплачен'
    });
    showAlert('success', 'Билет успешно куплен.');
  } catch {
    showAlert('danger', 'Не удалось оформить покупку.');
  } finally {
    buying.value = false;
  }
}
</script>

<template>
  <main class="py-5">
    <div class="container">
      <div v-if="loading" class="alert alert-info">Загружаем мероприятие...</div>
      <div v-else-if="!event" class="alert alert-danger">Мероприятие не найдено.</div>

      <div v-else class="row g-4">
        <section class="col-lg-8">
          <article class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <img :src="event.image" class="event-banner" :alt="event.title">
            <div class="card-body p-4 p-lg-5">
              <header class="mb-3">
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge text-bg-primary">{{ event.type }}</span>
                  <span class="badge text-bg-light">{{ event.date }}</span>
                  <span class="badge text-bg-light">{{ event.location }}</span>
                </div>
                <h1 class="fw-bold mb-3">{{ event.title }}</h1>
              </header>

              <p class="text-secondary">{{ event.description }}</p>

              <div class="row g-3 mt-1">
                <div class="col-md-6">
                  <section class="info-box rounded-4 p-3 h-100">
                    <h5 class="fw-semibold">Место проведения</h5>
                    <p class="text-secondary mb-0">{{ event.place }}, {{ event.location }}</p>
                  </section>
                </div>
                <div class="col-md-6">
                  <section class="info-box rounded-4 p-3 h-100">
                    <h5 class="fw-semibold">Стоимость билета</h5>
                    <p class="text-secondary mb-0">{{ event.price }}</p>
                  </section>
                </div>
              </div>

              <button
                class="btn btn-primary btn-lg mt-4"
                data-bs-toggle="modal"
                data-bs-target="#ticketModal"
              >Купить билет</button>

              <div class="mt-3">
                <AlertMessage :type="alert.type" :text="alert.text" />
              </div>
            </div>
          </article>

          <section class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <h2 class="h4 fw-bold mb-3">Схема зала</h2>
              <HallScheme />
            </div>
          </section>

          <EventReviews />
        </section>

        <aside class="col-lg-4">
          <section class="card border-0 shadow-sm rounded-4 sticky-card">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold">Краткая информация</h2>
              <ul class="list-group list-group-flush">
                <li class="list-group-item px-0">Дата: {{ event.date }}</li>
                <li class="list-group-item px-0">Начало: 19:00</li>
                <li class="list-group-item px-0">Возраст: 12+</li>
                <li class="list-group-item px-0">Место: {{ event.place }}</li>
              </ul>
              <router-link :to="{ name: 'profile' }" class="btn btn-outline-primary w-100 mt-3">
                Перейти в мои билеты
              </router-link>
            </div>
          </section>
        </aside>
      </div>
    </div>

    <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="ticketModalLabel">Покупка билета</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body text-secondary">
            Подтвердите покупку билета на «{{ event?.title }}».
          </div>
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-primary"
              :disabled="buying"
              data-bs-dismiss="modal"
              @click="confirmPurchase"
            >
              {{ buying ? 'Обрабатываем...' : 'Подтвердить покупку' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
