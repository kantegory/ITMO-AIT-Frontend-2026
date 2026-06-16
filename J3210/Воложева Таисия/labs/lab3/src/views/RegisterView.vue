<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const name = ref("");
const surname = ref("");
const email = ref("");
const password = ref("");
const pigeonId = ref("");
const isOrganizer = ref(false);
const orgName = ref("");
const orgPhone = ref("");

const errorMessage = ref("");
const loading = ref(false);

const handleRegister = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const usersRes = await axios.get("http://localhost:3000/users");
    if (usersRes.data.some((u) => u.email.toLowerCase() === email.value.toLowerCase())) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const userData = {
      name: name.value,
      surname: surname.value,
      email: email.value,
      password: password.value,
      role: isOrganizer.value ? "organizer" : "user",
      createdAt: new Date().toISOString(),
    };

    if (pigeonId.value) userData.pigeonId = pigeonId.value;

    if (isOrganizer.value) {
      userData.organizationName = orgName.value;
      userData.phone = orgPhone.value;
    }

    const createRes = await axios.post("http://localhost:3000/users", userData);

    auth.setUser(createRes.data);
    router.push(createRes.data.role === "organizer" ? "/organizer" : "/personal");

    router.push("/");
  } catch (err) {
    errorMessage.value = err.message || "Ошибка при регистрации";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="row justify-content-center mt-4 mb-5">
    <div class="col-md-8 col-lg-6">
      <section class="event-card p-4 p-xl-5 shadow-sm rounded-4 bg-white border">
        <div class="text-center mb-4">
          <svg
            width="60"
            height="60"
            viewBox="0 0 16 16"
            style="fill: var(--rose)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
            />
          </svg>
          <h1 class="h3 fw-bold mt-3">Регистрация</h1>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <form @submit.prevent="handleRegister">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Имя *</label>
              <input
                v-model="name"
                type="text"
                class="form-control rounded-3"
                placeholder="Иван"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Фамилия</label>
              <input
                v-model="surname"
                type="text"
                class="form-control rounded-3"
                placeholder="Иванов"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Email *</label>
            <input
              v-model="email"
              type="email"
              class="form-control rounded-3"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Пароль *</label>
            <input
              v-model="password"
              type="password"
              class="form-control rounded-3"
              placeholder="Минимум 6 символов"
              minlength="6"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">ID голубя</label>
            <input v-model="pigeonId" type="text" class="form-control rounded-3" />
          </div>

          <div class="form-check form-switch mb-4">
            <input
              v-model="isOrganizer"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="isOrganizer"
            />
            <label class="form-check-label" for="isOrganizer">Я организатор мероприятий</label>
          </div>

          <Transition name="fade">
            <div v-if="isOrganizer" class="p-3 bg-light rounded-3 mb-4 border">
              <h5 class="mb-3">Данные организации</h5>
              <div class="mb-3">
                <label class="form-label">Название</label>
                <input
                  v-model="orgName"
                  type="text"
                  class="form-control"
                  placeholder="ООО 'Тикетс'"
                />
              </div>
              <div class="mb-0">
                <label class="form-label">Телефон</label>
                <input
                  v-model="orgPhone"
                  type="tel"
                  class="form-control"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>
            </div>
          </Transition>

          <button
            type="submit"
            class="btn btn-rose w-100 rounded-pill py-2 fw-bold mb-3"
            :disabled="loading"
          >
            {{ loading ? "Создаем аккаунт..." : "Зарегистрироваться" }}
          </button>

          <p class="text-center text-muted small">
            Уже есть аккаунт?
            <router-link to="/login" class="text-rose fw-semibold text-decoration-none"
              >Войти</router-link
            >
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
