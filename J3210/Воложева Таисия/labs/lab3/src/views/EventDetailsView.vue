<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useImageHelper } from "../composables/useImageHelper";
import { useModal } from "../composables/useModal";

const route = useRoute();
const router = useRouter();

const { getImageSrc } = useImageHelper();
const buyTicketModal = useModal("buyTicketsModal");
const hallModal = useModal("hallModal");

const event = ref(null);
const reviews = ref([]);
const loading = ref(true);
const selectedQuantity = ref(1);
const purchaseLoading = ref(false);

const user = computed(() => JSON.parse(localStorage.getItem("user") || "null"));

const availableTickets = computed(() => {
  if (!event.value) return 0;
  return event.value.totalTickets - (event.value.soldTickets || 0);
});

const canBuy = computed(() => {
  if (!event.value) return false;
  const eventDate = new Date(event.value.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = eventDate < today;
  const isSoldOut = availableTickets.value <= 0;
  const isOrganizer = user.value?.role === "organizer";
  return !isPast && !isSoldOut && !isOrganizer;
});

const fetchEventData = async () => {
  loading.value = true;
  const id = route.params.id;
  try {
    const [eventRes, reviewsRes, ticketsRes] = await Promise.all([
      axios.get(`http://localhost:3000/events/${id}`),
      axios.get(`http://localhost:3000/reviews?eventId=${id}`),
      axios.get(`http://localhost:3000/tickets?eventId=${id}&status=active`),
    ]);

    event.value = eventRes.data;
    event.value.soldTickets = ticketsRes.data.length;
    reviews.value = reviewsRes.data;
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  } finally {
    loading.value = false;
  }
};

const openPurchaseModal = () => {
  if (!user.value) {
    if (confirm("Для покупки билетов необходимо войти в аккаунт. Перейти на страницу входа?")) {
      router.push("/login");
    }
    return;
  }
  selectedQuantity.value = 1;
  buyTicketModal.show();
};

const handlePurchase = async () => {
  purchaseLoading.value = true;
  try {
    const tickets = Array.from({ length: selectedQuantity.value }).map(() => ({
      userId: user.value.id,
      eventId: event.value.id,
      eventTitle: event.value.title,
      price: event.value.price,
      date: event.value.date,
      place: event.value.place,
      status: "active",
      purchaseDate: new Date().toISOString().split("T")[0],
    }));

    await Promise.all(tickets.map((t) => axios.post("http://localhost:3000/tickets", t)));

    await axios.patch(`http://localhost:3000/events/${event.value.id}`, {
      soldTickets: (event.value.soldTickets || 0) + selectedQuantity.value,
    });

    alert(`Успешно! Куплено билетов: ${selectedQuantity.value}`);
    buyTicketModal.hide();
    fetchEventData();
  } catch (err) {
    alert("Произошла ошибка при оформлении заказа.");
  } finally {
    purchaseLoading.value = false;
  }
};

onMounted(fetchEventData);
</script>

<template>
  <div class="event-page py-5">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-rose"></div>
        <p class="mt-2 text-rose">Загрузка данных...</p>
      </div>

      <div v-else-if="event">
        <div class="row g-5 align-items-start">
          <!-- Афиша (только если есть) -->
          <div v-if="event.posterUrl" class="col-lg-6">
            <div class="poster-container">
              <img
                :src="getImageSrc(event.posterUrl)"
                class="img-fluid rounded-4 shadow-lg border-rose-light"
                :alt="event.title"
              />
            </div>
          </div>

          <!-- Информация о событии -->
          <div :class="event.posterUrl ? 'col-lg-6' : 'col-lg-12'">
            <article class="p-4 border-0 rounded-4 bg-white shadow-sm event-card">
              <h1 class="h2 fw-bold mb-4 text-dark">{{ event.title }}</h1>

              <div class="event-info mb-4">
                <p class="mb-2">
                  <i class="bi bi-calendar3 me-2 text-rose"></i> <b>Дата:</b> {{ event.date }}
                </p>
                <p class="mb-2">
                  <i class="bi bi-geo-alt me-2 text-rose"></i> <b>Место:</b> {{ event.place }}
                </p>
                <p class="mb-2">
                  <i class="bi bi-wallet2 me-2 text-rose"></i> <b>Цена:</b>
                  <span class="text-rose fw-bold">{{ event.price.toLocaleString() }} ₽</span>
                </p>
                <p class="mb-0">
                  <i class="bi bi-ticket-perforated me-2 text-rose"></i> <b>Свободно:</b>
                  {{ availableTickets }} / {{ event.totalTickets }}
                </p>
              </div>

              <div class="description-box mb-4 p-3 rounded-3 bg-rose-light">
                <p class="mb-0 text-muted">{{ event.description }}</p>
              </div>

              <div class="d-grid gap-3 d-sm-flex">
                <button
                  @click="openPurchaseModal"
                  class="btn btn-rose btn-lg flex-grow-1 py-3"
                  :disabled="!canBuy"
                >
                  {{ availableTickets <= 0 ? "Билетов нет" : "Купить билеты" }}
                </button>
                <button
                  v-if="event.hallSchemeUrl"
                  class="btn btn-outline-rose btn-lg flex-grow-1 py-3"
                  @click="hallModal.show()"
                >
                  <i class="bi bi-map me-2"></i>Схема зала
                </button>
              </div>

              <div
                v-if="availableTickets > 0 && availableTickets <= 10"
                class="alert-rose mt-4 mb-0"
              >
                <i class="bi bi-exclamation-triangle me-2"></i>Поторопитесь! Места заканчиваются.
              </div>
            </article>
          </div>
        </div>

        <section class="mt-5 pt-5">
          <h3 class="text-center mb-5 text-dark fw-bold">Отзывы гостей</h3>
          <div class="row g-4">
            <div v-if="reviews.length === 0" class="col-12 text-center text-muted py-5">
              <p>Здесь пока пусто. Станьте первым, кто оставит отзыв!</p>
            </div>
            <article v-for="review in reviews" :key="review.id" class="col-md-4">
              <div class="card h-100 review-card border-0 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="h6 mb-0 fw-bold">{{ review.author }}</h4>
                    <span class="rating-stars">
                      {{ "★".repeat(review.rating)
                      }}<span class="text-muted opacity-25">{{
                        "★".repeat(5 - review.rating)
                      }}</span>
                    </span>
                  </div>
                  <p class="card-text italic">"{{ review.text }}"</p>
                  <hr class="opacity-10" />
                  <time class="text-muted x-small">{{ review.date }}</time>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- Модальное окно покупки -->
        <div class="modal fade" id="buyTicketsModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
              <div class="modal-header border-0 pb-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body text-center p-4">
                <h5 class="fw-bold mb-1">{{ event.title }}</h5>
                <p class="text-muted small mb-4">{{ event.date }} • {{ event.place }}</p>

                <div class="quantity-control mb-4">
                  <button @click="selectedQuantity > 1 && selectedQuantity--" class="qty-btn">
                    −
                  </button>
                  <span class="qty-val">{{ selectedQuantity }}</span>
                  <button
                    @click="selectedQuantity < availableTickets && selectedQuantity++"
                    class="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div class="total-box p-3 rounded-3 mb-4">
                  <span class="text-muted d-block small mb-1">Итого к оплате</span>
                  <span class="h3 fw-bold text-rose"
                    >{{ (event.price * selectedQuantity).toLocaleString() }} ₽</span
                  >
                </div>

                <button
                  @click="handlePurchase"
                  class="btn btn-rose w-100 py-3 rounded-3"
                  :disabled="purchaseLoading"
                >
                  {{ purchaseLoading ? "Оформление..." : "Подтвердить заказ" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Модальное окно схемы зала (только если есть URL) -->
        <div
          v-if="event.hallSchemeUrl"
          class="modal fade"
          id="hallModal"
          tabindex="-1"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
              <div class="modal-header border-0">
                <h5 class="modal-title fw-bold">План зала</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body text-center p-4">
                <img
                  :src="getImageSrc(event.hallSchemeUrl)"
                  class="img-fluid rounded-3"
                  alt="Схема"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="alert-rose text-center">Событие не найдено.</div>
    </div>
  </div>
</template>
