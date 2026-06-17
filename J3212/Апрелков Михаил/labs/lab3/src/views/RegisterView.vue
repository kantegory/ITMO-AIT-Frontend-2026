<template>
  <div class="auth-page bg-light d-flex flex-column">
    <div class="position-fixed top-0 end-0 p-2 p-md-3" style="z-index: 1050">
      <ThemeToggle />
    </div>
    <main class="container d-flex align-items-center justify-content-center py-5 flex-grow-1">
      <section
        class="auth-card card tripatropa-card p-4 p-md-5 bg-white"
        aria-labelledby="register-title"
      >
        <header class="text-center mb-4">
          <div
            class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary mb-3"
            style="width: 52px; height: 52px"
          >
            <i class="bi bi-compass fs-4"></i>
          </div>
          <h1 class="h4 mb-1" id="register-title">Создайте аккаунт Tripatropa</h1>
          <p class="text-muted mb-0">Сохраняйте маршруты и путешествуйте осознанно</p>
        </header>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label for="registerName" class="form-label">Имя</label>
            <input
              v-model="name"
              type="text"
              class="form-control"
              id="registerName"
              placeholder="Анна Петрова"
              required
              autocomplete="name"
            />
          </div>
          <div class="mb-3">
            <label for="registerEmail" class="form-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="registerEmail"
              placeholder="you@example.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="mb-3">
            <label for="registerPassword" class="form-label">Пароль</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="registerPassword"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>
          <div class="mb-3">
            <label for="registerPasswordConfirm" class="form-label">
              Подтверждение пароля
            </label>
            <input
              v-model="passwordConfirm"
              type="password"
              class="form-control"
              id="registerPasswordConfirm"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>
          <div class="form-check mb-3">
            <input
              v-model="agreed"
              class="form-check-input"
              type="checkbox"
              id="agreeTerms"
              required
            />
            <label class="form-check-label" for="agreeTerms">
              Я принимаю условия использования сервиса
            </label>
          </div>
          <div v-if="message" class="alert py-2 mb-3" :class="messageClass">
            {{ message }}
          </div>
          <div class="d-grid mb-3">
            <button type="submit" class="btn btn-primary" :disabled="busy">
              Создать аккаунт
            </button>
          </div>
          <p class="mb-0 text-center text-muted-sm">
            Уже есть аккаунт?
            <RouterLink to="/login" class="text-decoration-none">Войти</RouterLink>
          </p>
        </form>

        <div class="mt-4 text-center">
          <RouterLink to="/search" class="small text-decoration-none">
            ← Вернуться к поиску направлений
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import ThemeToggle from "../components/ThemeToggle.vue";
import { useAuth } from "../composables/useAuth.js";

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const agreed = ref(false);
const message = ref("");
const messageClass = ref("alert-danger");
const busy = ref(false);
const { register } = useAuth();
const router = useRouter();

async function onSubmit() {
  message.value = "";
  if (password.value !== passwordConfirm.value) {
    messageClass.value = "alert-danger";
    message.value = "Пароли не совпадают";
    return;
  }
  busy.value = true;
  try {
    await register(name.value.trim(), email.value.trim(), password.value);
    messageClass.value = "alert-success";
    message.value = "Аккаунт создан, теперь войдите";
    setTimeout(() => router.push("/login"), 600);
  } catch (e) {
    messageClass.value = "alert-danger";
    message.value = e.message || "Ошибка регистрации";
  } finally {
    busy.value = false;
  }
}
</script>
