<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const user = computed(() => auth.user);

const events = ref([]);
const loading = ref(true);

const isEditingEvent = ref(false);
const form = ref({
  id: null,
  title: "",
  date: "",
  type: "",
  price: 0,
  totalTickets: 0,
  place: "",
  description: "",
  posterUrl: "",
  hallSchemeUrl: "",
});

const profileForm = ref({
  name: "",
  surname: "",
  pigeonId: "",
  organizationName: "",
  phone: "",
  currentPassword: "",
  newPassword: "",
});

let eventModalInstance = null;
let profileModalInstance = null;

const fetchEvents = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/events");
    if (user.value) {
      events.value = response.data.filter((e) => e.organizerId === user.value.id);
    } else {
      events.value = [];
    }
  } catch (err) {
    console.error("Ошибка при загрузке событий:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();

  const eventModalEl = document.getElementById("eventModal");
  if (eventModalEl) eventModalInstance = new Modal(eventModalEl);

  const profileModalEl = document.getElementById("profileModal");
  if (profileModalEl) profileModalInstance = new Modal(profileModalEl);
});

const openCreateModal = () => {
  isEditingEvent.value = false;
  form.value = {
    id: null,
    title: "",
    date: "",
    type: "",
    price: 0,
    totalTickets: 0,
    place: "",
    description: "",
    posterUrl: "",
    hallSchemeUrl: "",
  };
  eventModalInstance?.show();
};

const openEditModal = (eventData) => {
  isEditingEvent.value = true;
  form.value = { ...eventData };
  eventModalInstance?.show();
};

const handleEventSubmit = async () => {
  try {
    const eventPayload = {
      ...form.value,
      organizerId: user.value.id,
    };

    if (isEditingEvent.value) {
      await axios.put(`http://localhost:3000/events/${form.value.id}`, eventPayload);
    } else {
      const newEvent = {
        ...eventPayload,
        soldTickets: 0,
      };
      delete newEvent.id;
      await axios.post("http://localhost:3000/events", newEvent);
    }

    eventModalInstance?.hide();
    await fetchEvents();
  } catch (err) {
    alert("Не удалось сохранить событие");
    console.error(err);
  }
};

const deleteEvent = async (id) => {
  if (!confirm("Удалить это мероприятие?")) return;
  try {
    await axios.delete(`http://localhost:3000/events/${id}`);
    await fetchEvents();
  } catch (err) {
    alert("Ошибка при удалении");
  }
};

const openProfileModal = () => {
  profileForm.value = {
    name: user.value.name || "",
    surname: user.value.surname || "",
    pigeonId: user.value.pigeonId || "",
    organizationName: user.value.organizationName || "",
    phone: user.value.phone || "",
    currentPassword: "",
    newPassword: "",
  };
  profileModalInstance?.show();
};

const handleProfileUpdate = async () => {
  if (!profileForm.value.currentPassword) {
    alert("Укажите текущий пароль");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:3000/users/${user.value.id}`);
    if (profileForm.value.currentPassword !== res.data.password) {
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
    organizationName: profileForm.value.organizationName,
    phone: profileForm.value.phone,
  };
  if (profileForm.value.newPassword) {
    updatedData.password = profileForm.value.newPassword;
  }

  try {
    const putRes = await axios.put(`http://localhost:3000/users/${user.value.id}`, updatedData);
    auth.updateUser(putRes.data);
    profileModalInstance?.hide();
    alert("Профиль обновлён");
  } catch (err) {
    alert("Ошибка при обновлении профиля");
  }
};
</script>

<template>
  <div class="organizer-account container my-5" v-if="user">
    <header
      class="d-flex justify-content-between align-items-center mb-5 p-4 bg-white rounded-4 shadow-sm border-top border-rose border-5"
    >
      <div>
        <h1 class="h3 fw-bold text-rose mb-1">Панель организатора</h1>
        <p class="text-muted mb-0">
          Вы вошли как: <strong>{{ user.name }}</strong> ({{ user.email }})
        </p>
      </div>
      <div class="d-flex gap-3">
        <button @click="openCreateModal" class="btn btn-rose px-4 rounded-pill shadow-sm">
          <i class="bi bi-plus-circle me-2"></i>Создать событие
        </button>
        <button @click="openProfileModal" class="btn btn-outline-rose px-4 rounded-pill">
          <i class="bi bi-person-gear me-2"></i>Профиль
        </button>
      </div>
    </header>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-rose" role="status"></div>
    </div>

    <div v-else class="row g-4">
      <div v-if="events.length === 0" class="col-12 text-center py-5">
        <div class="p-5 bg-white rounded-4 border">
          <i class="bi bi-calendar2-x display-1 text-light"></i>
          <p class="text-muted mt-3">У вас пока нет активных мероприятий.</p>
        </div>
      </div>

      <div v-for="event in events" :key="event.id" class="col-md-6 col-lg-4">
        <div class="card event-card h-100 shadow-sm border-0">
          <img
            :src="event.posterUrl || 'https://via.placeholder.com/400x200?text=Titickets'"
            class="card-img-top"
            style="height: 180px; object-fit: cover"
            alt="Афиша"
          />
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="fw-bold mb-0">{{ event.title }}</h5>
              <span class="badge bg-rose-subtle text-rose">{{ event.price }} ₽</span>
            </div>
            <p class="small text-muted mb-1"><i class="bi bi-geo-alt me-1"></i>{{ event.place }}</p>
            <p class="small text-muted mb-3">
              <i class="bi bi-tag me-1"></i>{{ event.type || "Без категории" }}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-4">
              <div class="small">
                <i class="bi bi-ticket-perforated me-1"></i> {{ event.totalTickets }} шт.
              </div>
              <div class="btn-group">
                <button @click="openEditModal(event)" class="btn btn-sm btn-outline-rose">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button @click="deleteEvent(event.id)" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно: Событие -->
    <div
      class="modal fade"
      id="eventModal"
      tabindex="-1"
      aria-labelledby="eventModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <form @submit.prevent="handleEventSubmit">
            <div class="modal-header border-0 p-4">
              <h5 class="modal-title fw-bold" id="eventModalLabel">
                {{ isEditingEvent ? "Редактирование события" : "Новое мероприятие" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body p-4 pt-0">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label small fw-bold">Название</label>
                  <input
                    v-model="form.title"
                    type="text"
                    class="form-control custom-input"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Дата</label>
                  <input
                    v-model="form.date"
                    type="date"
                    class="form-control custom-input"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Тип мероприятия</label>
                  <select v-model="form.type" class="form-select custom-input" required>
                    <option value="" disabled>Выберите тип</option>
                    <option value="Выставка">Выставка</option>
                    <option value="Театр">Театр</option>
                    <option value="Концерт">Концерт</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Место</label>
                  <input
                    v-model="form.place"
                    type="text"
                    class="form-control custom-input"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Цена (₽)</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    class="form-control custom-input"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Всего билетов</label>
                  <input
                    v-model.number="form.totalTickets"
                    type="number"
                    class="form-control custom-input"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Ссылка на афишу (URL)</label>
                  <input v-model="form.posterUrl" type="url" class="form-control custom-input" />
                </div>
                <!-- НОВОЕ: схема зала -->
                <div class="col-12">
                  <label class="form-label small fw-bold">Ссылка на схему зала (URL)</label>
                  <input
                    v-model="form.hallSchemeUrl"
                    type="url"
                    class="form-control custom-input"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Описание</label>
                  <textarea
                    v-model="form.description"
                    class="form-control custom-input"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 p-4">
              <button type="button" class="btn btn-light px-4 rounded-pill" data-bs-dismiss="modal">
                Отмена
              </button>
              <button type="submit" class="btn btn-rose px-4 rounded-pill">
                {{ isEditingEvent ? "Сохранить изменения" : "Опубликовать" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Модальное окно: Профиль -->
    <div
      class="modal fade"
      id="profileModal"
      tabindex="-1"
      aria-labelledby="profileModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <form @submit.prevent="handleProfileUpdate">
            <div class="modal-header border-0 p-4">
              <h5 class="modal-title fw-bold" id="profileModalLabel">Редактирование профиля</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body p-4 pt-0">
              <!-- поля профиля без изменений -->
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Имя</label
                  ><input
                    v-model="profileForm.name"
                    type="text"
                    class="form-control custom-input"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Фамилия</label
                  ><input
                    v-model="profileForm.surname"
                    type="text"
                    class="form-control custom-input"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">ID голубя</label
                  ><input
                    v-model="profileForm.pigeonId"
                    type="text"
                    class="form-control custom-input"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Название организации</label
                  ><input
                    v-model="profileForm.organizationName"
                    type="text"
                    class="form-control custom-input"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Телефон</label
                  ><input
                    v-model="profileForm.phone"
                    type="tel"
                    class="form-control custom-input"
                  />
                </div>
                <div class="col-12"><hr class="my-2" /></div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-danger">Текущий пароль *</label
                  ><input
                    v-model="profileForm.currentPassword"
                    type="password"
                    class="form-control border-danger-subtle"
                    required
                    placeholder="Обязательно"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Новый пароль (необязательно)</label
                  ><input
                    v-model="profileForm.newPassword"
                    type="password"
                    class="form-control"
                    placeholder="Минимум 6 символов"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 p-4">
              <button type="button" class="btn btn-light px-4 rounded-pill" data-bs-dismiss="modal">
                Отмена
              </button>
              <button type="submit" class="btn btn-rose px-4 rounded-pill">
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  transition: all 0.3s ease;
  border-top: 4px solid var(--rose) !important;
}
.event-card:hover {
  transform: translateY(-5px);
}
.bg-rose-subtle {
  background-color: var(--rose-light) !important;
}
</style>
