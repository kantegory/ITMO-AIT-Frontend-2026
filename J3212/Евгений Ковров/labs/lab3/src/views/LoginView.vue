<template>
  <section class="view-section view-section--narrow">
    <p class="eyebrow">Авторизация</p>
    <h1>Вход</h1>
    <p class="view-description auth-view__intro">
      Войдите, чтобы работать с личным кабинетом и закрытыми разделами SPA.
    </p>

    <form class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-form__field">
        <span>Эл. почта</span>
        <input v-model.trim="form.email" type="email" autocomplete="email" />
      </label>

      <label class="auth-form__field">
        <span>Пароль</span>
        <input v-model="form.password" type="password" autocomplete="current-password" />
      </label>

      <div v-if="errorMessage" class="state-box state-box--error">{{ errorMessage }}</div>

      <button class="button-link auth-form__submit" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Входим...' : 'Войти' }}
      </button>
    </form>

    <p class="auth-view__hint">
      Нет аккаунта?
      <RouterLink class="auth-view__link" :to="registerLink">Создать аккаунт</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { login, isLoading, error, clearError } = useAuth();
const form = reactive({
  email: '',
  password: ''
});
const errorMessage = ref('');
const registerLink = {
  name: 'register',
  query: route.query.redirect ? { redirect: String(route.query.redirect) } : undefined
};

async function handleSubmit() {
  clearError();
  errorMessage.value = '';

  if (!form.email || !form.password) {
    errorMessage.value = 'Заполните email и пароль.';
    return;
  }

  try {
    await login(form.email, form.password);
    await router.push(String(route.query.redirect || '/'));
  } catch (requestError) {
    errorMessage.value = error.value || 'Не удалось выполнить вход. Проверьте введённые данные.';
  }
}
</script>
