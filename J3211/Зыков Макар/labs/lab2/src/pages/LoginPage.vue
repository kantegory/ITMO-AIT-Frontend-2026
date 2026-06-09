<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useSession } from "../composables/useSession";
import { fetchJson } from "../services/api";

const route = useRoute();
const router = useRouter();
const { login } = useSession();

const formRef = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref("");

const form = reactive({
  email: "",
  password: "",
  remember: false
});

function resolveRedirectByRole(nextRole) {
  return nextRole === "organizer" ? "/cabinet/organizer" : "/cabinet/user";
}

async function submitLogin() {
  errorMessage.value = "";

  if (!formRef.value?.reportValidity()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetchJson("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.email.trim(),
        password: form.password
      })
    });

    login({
      token: response.token,
      user: response.user
    });

    const redirect = typeof route.query.redirect === "string"
      ? route.query.redirect
      : resolveRedirectByRole(response.user.role);

    router.push(redirect);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container auth-layout d-flex align-items-center">
    <div class="row g-4 align-items-stretch w-100">
      <div class="col-lg-5 d-none d-lg-block">
        <section class="auth-side h-100 p-4 p-xl-5">
          <h1 class="fw-bold mb-3">Вход в аккаунт</h1>
          <p class="mb-4">
            Авторизация выполняется через mock API. После входа данные профиля и действия на страницах
            зависят от роли пользователя.
          </p>
          <div class="demo-credentials-card mb-3">
            <p class="fw-semibold mb-1">Покупатель</p>
            <p class="mb-1">makary.zykov@mail.com</p>
            <p class="mb-0">frontend123</p>
          </div>
          <div class="demo-credentials-card">
            <p class="fw-semibold mb-1">Организатор</p>
            <p class="mb-1">organizer@makarsevent.ru</p>
            <p class="mb-0">frontend123</p>
          </div>
        </section>
      </div>

      <div class="col-lg-7">
        <section class="auth-panel p-4 p-xl-5">
          <h2 class="h3 fw-bold mb-3">Авторизация</h2>
          <p class="text-secondary mb-4">
            Введите данные, чтобы получить доступ к кабинету и действиям через API.
          </p>

          <div v-if="errorMessage" class="alert alert-danger" role="status" aria-live="polite">
            {{ errorMessage }}
          </div>

          <form ref="formRef" novalidate @submit.prevent="submitLogin">
            <fieldset class="mb-0">
              <legend class="form-legend">Данные для входа</legend>

              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email</label>
                <input
                  id="loginEmail"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  required
                  placeholder="example@mail.com"
                  autocomplete="email"
                >
                <div class="form-hint">Используйте email тестового аккаунта или ранее зарегистрированный адрес.</div>
              </div>

              <div class="mb-3">
                <label for="loginPassword" class="form-label">Пароль</label>
                <input
                  id="loginPassword"
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  minlength="6"
                  required
                  placeholder="Минимум 6 символов"
                  autocomplete="current-password"
                >
                <div class="form-hint">Минимальная длина пароля: 6 символов.</div>
              </div>

              <div class="form-check mb-4">
                <input id="rememberLogin" v-model="form.remember" class="form-check-input" type="checkbox">
                <label class="form-check-label" for="rememberLogin">Запомнить меня</label>
              </div>
            </fieldset>

            <button type="submit" class="btn btn-primary w-100 py-2" :disabled="isSubmitting">
              {{ isSubmitting ? "Выполняем вход..." : "Войти" }}
            </button>
          </form>

          <p class="mt-4 mb-0">
            Нет аккаунта?
            <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
