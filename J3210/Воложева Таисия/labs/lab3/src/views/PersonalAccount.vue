<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { useModal } from "../composables/useModal";

const auth = useAuthStore();
const currentUser = computed(() => auth.user);

const tickets = ref([]);
const userReviews = ref([]); // все отзывы пользователя
const loading = ref(true);

// Модальные окна
const returnModal = useModal("returnQuantityModal");
const reviewModal = useModal("reviewModal");

// Группировка билетов по событиям
const groupedActive = computed(() =>
  groupTicketsByEvent(
    tickets.value.filter(
      (t) => t.status === "active" && t.date >= new Date().toISOString().split("T")[0],
    ),
  ),
);
const groupedPast = computed(() =>
  groupTicketsByEvent(
    tickets.value.filter(
      (t) => t.status === "active" && t.date < new Date().toISOString().split("T")[0],
    ),
  ),
);
const returnedTickets = computed(() =>
  groupReturnedTickets(tickets.value.filter((t) => t.status === "returned")),
);

// --- Профиль ---
const isEditing = ref(false);
const profileForm = ref({
  name: "",
  surname: "",
  pigeonId: "",
  organizationName: "",
  phone: "",
  currentPassword: "",
  newPassword: "",
});

// --- Возврат билетов ---
const returnData = ref({
  eventId: null,
  eventTitle: "",
  price: 0,
  maxQuantity: 0,
  quantity: 1,
});

// --- Отзывы ---
const reviewData = ref({
  eventId: null,
  rating: 5,
  text: "",
});
const reviewSubmitting = ref(false);

// Вспомогательные функции
function groupTicketsByEvent(ticketsArray) {
  const map = {};
  ticketsArray.forEach((t) => {
    const key = `${t.eventId}_${t.eventTitle}`;
    if (!map[key]) {
      map[key] = {
        eventId: t.eventId,
        eventTitle: t.eventTitle,
        place: t.place,
        price: t.price,
        date: t.date,
        totalQuantity: 0,
      };
    }
    map[key].totalQuantity++;
  });
  return Object.values(map);
}

function groupReturnedTickets(ticketsArray) {
  const map = {};
  ticketsArray.forEach((t) => {
    const key = `${t.eventId}_${t.eventTitle}`;
    if (!map[key]) {
      map[key] = {
        eventId: t.eventId,
        eventTitle: t.eventTitle,
        date: t.date,
        price: t.price,
        totalQuantity: 0,
        totalPrice: 0,
        status: t.returnStatus === "pending" ? "pending" : "approved",
      };
    }
    map[key].totalQuantity++;
    map[key].totalPrice += t.price;
  });
  return Object.values(map);
}

// Загрузка данных пользователя
const fetchTickets = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:3000/tickets");
    tickets.value = res.data.filter((t) => String(t.userId) === String(currentUser.value.id));
  } catch (err) {
    console.error("Ошибка загрузки билетов:", err);
    tickets.value = [];
  }
};

const fetchUserReviews = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/reviews?userId=${currentUser.value.id}`);
    userReviews.value = res.data;
  } catch (err) {
    console.error("Ошибка загрузки отзывов:", err);
    userReviews.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchTickets();
  await fetchUserReviews();
});

// --- Профиль ---
const startEditing = () => {
  const u = currentUser.value;
  profileForm.value = {
    name: u.name || "",
    surname: u.surname || "",
    pigeonId: u.pigeonId || "",
    organizationName: u.organizationName || "",
    phone: u.phone || "",
    currentPassword: "",
    newPassword: "",
  };
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  profileForm.value.currentPassword = "";
  profileForm.value.newPassword = "";
};

const saveProfile = async () => {
  if (!profileForm.value.currentPassword) {
    alert("Укажите текущий пароль");
    return;
  }
  try {
    const res = await axios.get(`http://localhost:3000/users/${currentUser.value.id}`);
    const serverUser = res.data;
    if (profileForm.value.currentPassword !== serverUser.password) {
      alert("Неверный текущий пароль");
      return;
    }
  } catch (e) {
    alert("Ошибка проверки пароля");
    return;
  }

  if (profileForm.value.newPassword && profileForm.value.newPassword.length < 6) {
    alert("Новый пароль должен быть минимум 6 символов");
    return;
  }

  const updatedData = {
    name: profileForm.value.name,
    surname: profileForm.value.surname,
    pigeonId: profileForm.value.pigeonId,
  };
  if (currentUser.value.role === "organizer") {
    updatedData.organizationName = profileForm.value.organizationName;
    updatedData.phone = profileForm.value.phone;
  }
  if (profileForm.value.newPassword) {
    updatedData.password = profileForm.value.newPassword;
  }

  try {
    const putRes = await axios.put(
      `http://localhost:3000/users/${currentUser.value.id}`,
      updatedData,
    );
    auth.updateUser(putRes.data);
    alert("Профиль обновлён");
    isEditing.value = false;
    profileForm.value.currentPassword = "";
    profileForm.value.newPassword = "";
  } catch (err) {
    alert("Ошибка при сохранении профиля");
  }
};

// --- Возврат билетов ---
const openReturnModal = (group) => {
  returnData.value = {
    eventId: group.eventId,
    eventTitle: group.eventTitle,
    price: group.price,
    maxQuantity: group.totalQuantity,
    quantity: 1,
  };
  returnModal.show();
};

const changeReturnQuantity = (delta) => {
  const newVal = returnData.value.quantity + delta;
  if (newVal >= 1 && newVal <= returnData.value.maxQuantity) {
    returnData.value.quantity = newVal;
  }
};

const returnTotalPrice = computed(() => {
  return returnData.value.price * returnData.value.quantity;
});

const confirmReturn = async () => {
  const { eventId, quantity, maxQuantity } = returnData.value;
  if (!eventId || quantity < 1 || quantity > maxQuantity) return;

  try {
    const allTickets = tickets.value.filter(
      (t) => String(t.eventId) === String(eventId) && t.status === "active",
    );
    if (quantity > allTickets.length) {
      alert(`Доступно только ${allTickets.length} билетов`);
      return;
    }
    const ticketsToReturn = allTickets.slice(0, quantity);

    const updatePromises = ticketsToReturn.map((ticket) => {
      ticket.status = "returned";
      ticket.returnStatus = "pending";
      ticket.returnDate = new Date().toISOString().split("T")[0];
      return axios.put(`http://localhost:3000/tickets/${ticket.id}`, ticket);
    });
    await Promise.all(updatePromises);

    try {
      const eventRes = await axios.get(`http://localhost:3000/events/${eventId}`);
      const eventData = eventRes.data;
      eventData.soldTickets = Math.max(0, (eventData.soldTickets || 0) - quantity);
      await axios.put(`http://localhost:3000/events/${eventId}`, eventData);
    } catch (e) {
      console.error("Ошибка обновления счётчика события:", e);
    }

    alert(`Заявка на возврат ${quantity} билет(ов) оформлена.`);
    returnModal.hide();
    await fetchTickets();
  } catch (err) {
    alert("Ошибка при оформлении возврата");
  }

  returnData.value = {
    eventId: null,
    eventTitle: "",
    price: 0,
    maxQuantity: 0,
    quantity: 1,
  };
};

// --- Отзывы ---
const hasUserReview = (eventId) => {
  return userReviews.value.some((r) => String(r.eventId) === String(eventId));
};

const openReviewModal = (group) => {
  if (hasUserReview(group.eventId)) {
    alert("Вы уже оставляли отзыв к этому событию");
    return;
  }
  reviewData.value = {
    eventId: group.eventId,
    rating: 5,
    text: "",
  };
  reviewModal.show();
};

const setRating = (star) => {
  reviewData.value.rating = star;
};

const submitReview = async () => {
  if (!reviewData.value.text.trim()) {
    alert("Введите текст отзыва");
    return;
  }
  reviewSubmitting.value = true;
  try {
    const newReview = {
      eventId: reviewData.value.eventId,
      userId: currentUser.value.id,
      author: currentUser.value.name || currentUser.value.email,
      text: reviewData.value.text,
      rating: reviewData.value.rating,
      date: new Date().toISOString().split("T")[0],
    };
    const res = await axios.post("http://localhost:3000/reviews", newReview);
    userReviews.value.push(res.data); // обновляем локальный список
    reviewModal.hide();
    alert("Спасибо за отзыв!");
  } catch (err) {
    alert("Ошибка при отправке отзыва");
  } finally {
    reviewSubmitting.value = false;
  }
};
</script>

<template>
  <div class="personal-account container my-4" v-if="currentUser">
    <h1 class="h2 fw-bold text-rose mb-4">Личный кабинет</h1>

    <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#tickets"
          type="button"
          role="tab"
        >
          <i class="bi bi-ticket-perforated me-2"></i>Мои билеты
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#profile"
          type="button"
          role="tab"
        >
          <i class="bi bi-person me-2"></i>Профиль
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane fade show active" id="tickets" role="tabpanel">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-rose" role="status"></div>
        </div>
        <div v-else>
          <!-- Активные билеты -->
          <div v-if="groupedActive.length">
            <h5 class="mb-3">
              Активные
              <span class="badge bg-rose-subtle text-rose">{{
                groupedActive.reduce((s, g) => s + g.totalQuantity, 0)
              }}</span>
            </h5>
            <div class="row g-3 mb-4">
              <div
                v-for="group in groupedActive"
                :key="group.eventId + group.eventTitle"
                class="col-md-4"
              >
                <div class="event-card p-3 h-100">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge" style="background: var(--rose-light)"
                      >{{ group.totalQuantity }} билет(а)</span
                    >
                    <small>{{ group.date }}</small>
                  </div>
                  <h6 class="fw-bold mt-2">{{ group.eventTitle }}</h6>
                  <small class="text-muted d-block mb-2">{{ group.place }}</small>
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <div>
                      <span class="fw-bold" style="color: var(--rose)">{{ group.price }} ₽</span>
                      <span class="ticket-quantity ms-2">×{{ group.totalQuantity }}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-rose" @click="openReturnModal(group)">
                      Вернуть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Прошедшие билеты -->
          <div v-if="groupedPast.length">
            <h5 class="mb-3 mt-4">
              Прошедшие
              <span class="badge bg-secondary">{{
                groupedPast.reduce((s, g) => s + g.totalQuantity, 0)
              }}</span>
            </h5>
            <div class="row g-3">
              <div
                v-for="group in groupedPast"
                :key="group.eventId + group.eventTitle"
                class="col-md-4"
              >
                <div class="event-card p-3 h-100 opacity-75">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="badge bg-secondary">{{ group.totalQuantity }} билет(а)</span>
                    <small>{{ group.date }}</small>
                  </div>
                  <h6 class="fw-bold mt-2">{{ group.eventTitle }}</h6>
                  <small class="text-muted d-block">{{ group.place }}</small>
                  <div class="d-flex flex-wrap justify-content-between mt-2 align-items-center">
                    <span class="fw-bold" style="color: var(--rose)">{{ group.price }} ₽</span>
                    <span class="badge bg-secondary">Использован</span>
                    <!-- Кнопка отзыва -->
                    <button
                      v-if="!hasUserReview(group.eventId)"
                      class="btn btn-sm btn-outline-rose mt-1 w-100"
                      @click="openReviewModal(group)"
                    >
                      Оставить отзыв
                    </button>
                    <span v-else class="text-success small mt-1 w-100 text-center">
                      <i class="bi bi-check-circle me-1"></i>Отзыв оставлен
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Пусто -->
          <div
            v-if="!groupedActive.length && !groupedPast.length"
            class="text-center text-muted p-5"
          >
            <i class="bi bi-ticket-perforated" style="font-size: 4rem"></i>
            <p class="mt-3">У вас пока нет купленных билетов</p>
            <router-link to="/" class="btn btn-rose">Купить билет</router-link>
          </div>

          <!-- Возвраты -->
          <div class="event-card p-3 mt-4">
            <h5 class="mb-3"><i class="bi bi-arrow-return-left me-2 text-rose"></i>Возвраты</h5>
            <div v-if="returnedTickets.length">
              <div
                v-for="ret in returnedTickets.filter((r) => r.status === 'pending')"
                :key="ret.eventId + ret.eventTitle"
                class="return-item d-flex justify-content-between align-items-center mb-2 p-2 rounded position-relative"
              >
                <div>
                  <strong>{{ ret.eventTitle }}</strong
                  ><br />
                  <small class="text-muted"
                    >{{ ret.date }} • {{ ret.totalQuantity }} билет(а)</small
                  >
                </div>
                <span
                  class="badge status-pending status-badge position-absolute top-50 start-50 translate-middle"
                >
                  В обработке
                </span>
                <span class="fw-bold" style="color: var(--rose)"
                  >{{ ret.totalPrice.toLocaleString() }} ₽</span
                >
              </div>
              <div
                v-for="ret in returnedTickets.filter((r) => r.status === 'approved')"
                :key="ret.eventId + ret.eventTitle"
                class="return-item d-flex justify-content-between align-items-center mb-2 p-2 rounded"
              >
                <div>
                  <strong>{{ ret.eventTitle }}</strong
                  ><br />
                  <small class="text-muted"
                    >{{ ret.date }} • {{ ret.totalQuantity }} билет(а)</small
                  >
                </div>
                <span class="badge status-approved status-badge">Возвращено</span>
                <span class="fw-bold" style="color: var(--rose)"
                  >{{ ret.totalPrice.toLocaleString() }} ₽</span
                >
              </div>
            </div>
            <p v-else class="text-muted text-center">Нет возвратов</p>
          </div>
        </div>
      </div>

      <!-- Вкладка "Профиль" (без изменений) -->
      <div class="tab-pane fade" id="profile" role="tabpanel">
        <div class="event-card p-4">
          <div class="text-center mb-4" v-if="!isEditing">
            <i class="bi bi-person-circle" style="font-size: 4rem; color: var(--rose)"></i>
            <h3 class="mt-2">{{ currentUser.name || currentUser.email }}</h3>
            <p class="text-muted">
              {{ currentUser.role === "organizer" ? "Организатор" : "Посетитель" }}
            </p>
          </div>

          <div v-if="!isEditing" id="viewProfile">
            <div class="row">
              <div class="col-md-6">
                <div class="profile-field">
                  <span class="profile-label">Email</span><span>{{ currentUser.email }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="profile-field">
                  <span class="profile-label">Имя</span
                  ><span>{{ currentUser.name || "Не указано" }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="profile-field">
                  <span class="profile-label">Фамилия</span
                  ><span>{{ currentUser.surname || "Не указано" }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="profile-field">
                  <span class="profile-label">ID голубя</span
                  ><span>{{ currentUser.pigeonId || "Не указан" }}</span>
                </div>
              </div>
            </div>
            <div v-if="currentUser.role === 'organizer'" class="mt-3">
              <hr />
              <h5 class="mb-3">Данные организации</h5>
              <div class="row">
                <div class="col-md-6">
                  <div class="profile-field">
                    <span class="profile-label">Название организации</span
                    ><span>{{ currentUser.organizationName || "Не указано" }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="profile-field">
                    <span class="profile-label">Телефон</span
                    ><span>{{ currentUser.phone || "Не указан" }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <button class="btn btn-rose" @click="startEditing">
                <i class="bi bi-pencil me-2"></i>Редактировать профиль
              </button>
            </div>
          </div>

          <div v-else id="editProfile">
            <form @submit.prevent="saveProfile">
              <div class="mb-3">
                <label for="editName" class="form-label">Имя</label>
                <input
                  type="text"
                  id="editName"
                  class="form-control"
                  v-model="profileForm.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editSurname" class="form-label">Фамилия</label>
                <input
                  type="text"
                  id="editSurname"
                  class="form-control"
                  v-model="profileForm.surname"
                />
              </div>
              <div class="mb-3">
                <label for="editPigeonId" class="form-label">ID голубя</label>
                <input
                  type="text"
                  id="editPigeonId"
                  class="form-control"
                  v-model="profileForm.pigeonId"
                />
                <small class="text-muted">Укажите ID вашего почтового голубя</small>
              </div>

              <template v-if="currentUser.role === 'organizer'">
                <div class="mb-3">
                  <label for="editOrgName" class="form-label">Название организации</label>
                  <input
                    type="text"
                    id="editOrgName"
                    class="form-control"
                    v-model="profileForm.organizationName"
                  />
                </div>
                <div class="mb-3">
                  <label for="editPhone" class="form-label">Контактный телефон</label>
                  <input
                    type="tel"
                    id="editPhone"
                    class="form-control"
                    v-model="profileForm.phone"
                  />
                </div>
              </template>

              <hr class="my-4" />
              <div class="mb-3">
                <label for="currentPassword" class="form-label fw-bold text-danger"
                  >Текущий пароль *</label
                >
                <input
                  type="password"
                  id="currentPassword"
                  class="form-control border-danger-subtle"
                  v-model="profileForm.currentPassword"
                  required
                  placeholder="Обязательно для сохранения изменений"
                />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">Новый пароль (необязательно)</label>
                <input
                  type="password"
                  id="newPassword"
                  class="form-control"
                  v-model="profileForm.newPassword"
                  placeholder="минимум 6 символов"
                />
              </div>

              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-rose">Сохранить изменения</button>
                <button type="button" class="btn btn-outline-secondary" @click="cancelEditing">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка возврата -->
    <div class="modal fade" id="returnQuantityModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-arrow-return-left me-2 text-rose"></i>Возврат билетов
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 text-center">
              <h6 class="fw-bold">{{ returnData.eventTitle }}</h6>
              <small class="text-muted"
                >Цена за билет: {{ returnData.price.toLocaleString() }} ₽</small
              >
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Количество билетов к возврату</label>
              <div class="quantity-selector d-flex align-items-center gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="changeReturnQuantity(-1)"
                  :disabled="returnData.quantity <= 1"
                >
                  −
                </button>
                <input
                  type="number"
                  class="form-control text-center"
                  style="width: 70px"
                  v-model.number="returnData.quantity"
                  min="1"
                  :max="returnData.maxQuantity"
                  readonly
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="changeReturnQuantity(1)"
                  :disabled="returnData.quantity >= returnData.maxQuantity"
                >
                  +
                </button>
              </div>
              <div class="text-muted small mt-2">
                Доступно для возврата: {{ returnData.maxQuantity }} билет(ов)
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Сумма к возврату</label>
              <div class="fs-4" style="color: var(--rose); font-weight: bold">
                {{ returnTotalPrice.toLocaleString() }} ₽
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-rose" @click="confirmReturn">
              <i class="bi bi-check-circle me-2"></i>Вернуть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка отзыва -->
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Оставить отзыв</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 text-center">
              <label class="form-label fw-semibold">Оценка</label>
              <div class="stars d-flex justify-content-center gap-1 fs-4">
                <i
                  v-for="star in 5"
                  :key="star"
                  class="bi"
                  :class="
                    star <= reviewData.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'
                  "
                  @click="setRating(star)"
                  style="cursor: pointer"
                ></i>
              </div>
            </div>
            <div class="mb-3">
              <label for="reviewText" class="form-label fw-semibold">Ваш отзыв</label>
              <textarea
                id="reviewText"
                class="form-control"
                rows="3"
                v-model="reviewData.text"
                placeholder="Поделитесь впечатлениями..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button
              type="button"
              class="btn btn-rose"
              @click="submitReview"
              :disabled="reviewSubmitting"
            >
              {{ reviewSubmitting ? "Отправка..." : "Отправить" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-field {
  margin-bottom: 0.8rem;
}
.profile-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-right: 0.5rem;
  font-weight: 500;
}
.event-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.status-badge {
  font-size: 0.75rem;
}
.status-pending {
  background-color: #fff3cd;
  color: #856404;
}
.status-approved {
  background-color: #d4edda;
  color: #155724;
}
.bg-rose-subtle {
  background-color: var(--rose-light);
}
.ticket-quantity {
  font-size: 0.9rem;
  color: #6c757d;
}
.opacity-75 {
  opacity: 0.75;
}

/* Центрирование плашки */
.return-item {
  position: relative;
  overflow: visible; /* чтобы плашка не обрезалась */
}
.return-item .status-pending {
  white-space: nowrap; /* предотвратит перенос текста */
}

/* Звезды */
.stars i {
  transition: color 0.2s ease;
}
.stars i:hover {
  transform: scale(1.2);
}
</style>
