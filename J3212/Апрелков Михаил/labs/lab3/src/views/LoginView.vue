<template>
  <div class="auth-page bg-light d-flex flex-column">
    <div class="position-fixed top-0 end-0 p-2 p-md-3" style="z-index: 1050">
      <ThemeToggle />
    </div>
    <main class="container d-flex align-items-center justify-content-center py-5 flex-grow-1">
      <section
        class="auth-card card tripatropa-card p-4 p-md-5 bg-white"
        aria-labelledby="login-title"
      >
        <header class="text-center mb-4">
          <div
            class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary mb-3"
            style="width: 52px; height: 52px"
          >
            <i class="bi bi-compass fs-4"></i>
          </div>
          <h1 class="h4 mb-1" id="login-title">Tripatropa</h1>
          <p class="text-muted mb-0">Планируйте путешествия в один клик</p>
        </header>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="loginEmail"
              placeholder="you@example.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="mb-3">
            <label for="loginPassword" class="form-label">Пароль</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="loginPassword"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="rememberMe" />
              <label class="form-check-label" for="rememberMe">Запомнить меня</label>
            </div>
            <a href="#" class="small text-decoration-none">Забыли пароль?</a>
          </div>
          <div v-if="errorMessage" class="alert alert-danger py-2 mb-3">{{ errorMessage }}</div>
          <div class="d-grid mb-3">
            <button type="submit" class="btn btn-primary" :disabled="busy">Войти</button>
          </div>
          <p class="mb-0 text-center text-muted-sm">
            Нет аккаунта?
            <RouterLink to="/register" class="text-decoration-none">Создать</RouterLink>
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

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const busy = ref(false);
const { login } = useAuth();
const router = useRouter();

async function onSubmit() {
  errorMessage.value = "";
  busy.value = true;
  try {
    const user = await login(email.value, password.value);
    if (!user) {
      errorMessage.value = "Неверный email или пароль";
      return;
    }
    router.push("/search");
  } catch (e) {
    errorMessage.value = "Ошибка входа";
  } finally {
    busy.value = false;
  }
}
</script>
