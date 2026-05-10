<template>
  <form class="row g-3 auth-form" aria-describedby="login-form-hint" @submit.prevent="submit">
    <p id="login-form-hint" class="visually-hidden">Введите email и пароль для входа в личный кабинет.</p>
    <div class="col-12">
      <label class="form-label" for="loginEmail">Email</label>
      <input
        id="loginEmail"
        v-model.trim="form.email"
        class="form-control form-control-lg"
        type="email"
        placeholder="demo@finflow.ru"
        autocomplete="email"
        inputmode="email"
        required
      />
    </div>
    <div class="col-12">
      <label class="form-label" for="loginPassword">Пароль</label>
      <div class="input-group input-group-lg">
        <input
          id="loginPassword"
          v-model="form.password"
          class="form-control"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Введите пароль"
          autocomplete="current-password"
          required
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
          :aria-pressed="String(showPassword)"
          aria-controls="loginPassword"
          @click="showPassword = !showPassword"
        >
          <SvgIcon name="eye" class-name="icon--inline" />
        </button>
      </div>
    </div>
    <div class="col-12 d-flex justify-content-between align-items-center">
      <div class="form-check">
        <input id="rememberMe" class="form-check-input" type="checkbox" checked />
        <label class="form-check-label" for="rememberMe">Запомнить меня</label>
      </div>
      <button class="btn btn-link p-0 text-decoration-none" type="button" @click="showReset = true">
        Забыли пароль?
      </button>
    </div>
    <div class="col-12">
      <button class="btn btn-accent btn-lg w-100" type="submit" :disabled="isBusy">
        {{ isBusy ? "Входим..." : "Войти в кабинет" }}
      </button>
    </div>
    <div v-if="message" class="col-12">
      <div class="alert alert-danger mb-0" role="alert" aria-live="assertive">{{ message }}</div>
    </div>
    <div class="col-12">
      <div class="divider-text"><span>или продолжить через</span></div>
    </div>
    <div class="col-sm-6">
      <button class="btn btn-outline-dark btn-social w-100" type="button">
        <SvgIcon name="google" />Google
      </button>
    </div>
    <div class="col-sm-6">
      <button class="btn btn-outline-dark btn-social w-100" type="button">
        <SvgIcon name="apple" />Apple ID
      </button>
    </div>
  </form>

  <div v-if="showReset" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="resetLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <div class="modal-header border-0">
          <h2 id="resetLabel" class="h4 mb-0">Восстановление доступа</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="showReset = false"></button>
        </div>
        <div class="modal-body">
          <p class="text-secondary">
            Ссылка для сброса пароля будет отправлена на email, привязанный к аккаунту.
          </p>
          <label class="form-label" for="resetEmail">Email</label>
          <input id="resetEmail" class="form-control" type="email" placeholder="name@example.com" autocomplete="email" inputmode="email" />
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-accent w-100" @click="showReset = false">Отправить ссылку</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showReset" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SvgIcon from "@/components/SvgIcon.vue";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const form = reactive({
  email: "",
  password: "",
});
const showPassword = ref(false);
const showReset = ref(false);
const isBusy = ref(false);
const message = ref("");

async function submit() {
  message.value = "";
  isBusy.value = true;

  try {
    await auth.login({ email: form.email, password: form.password });
    await router.push(String(route.query.next || "/dashboard"));
  } catch (error) {
    message.value = error.message || "Ошибка входа.";
  } finally {
    isBusy.value = false;
  }
}
</script>
