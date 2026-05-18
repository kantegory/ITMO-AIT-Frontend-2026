<template>
  <section class="view-section view-section--narrow">
    <p class="eyebrow">Авторизация</p>
    <h1>Регистрация</h1>
    <p class="view-description auth-view__intro">
      Создайте аккаунт. После регистрации пользователь сразу авторизуется в SPA.
    </p>

    <form class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-form__field">
        <span>Имя</span>
        <input v-model.trim="form.firstName" type="text" autocomplete="given-name" />
      </label>

      <label class="auth-form__field">
        <span>Фамилия</span>
        <input v-model.trim="form.lastName" type="text" autocomplete="family-name" />
      </label>

      <label class="auth-form__field">
        <span>Эл. почта</span>
        <input v-model.trim="form.email" type="email" autocomplete="email" />
      </label>

      <label class="auth-form__field">
        <span>Пароль</span>
        <input v-model="form.password" type="password" autocomplete="new-password" />
      </label>

      <label class="auth-form__field">
        <span>Повтор пароля</span>
        <input v-model="form.confirmPassword" type="password" autocomplete="new-password" />
      </label>

      <label class="auth-form__checkbox">
        <input v-model="form.agreed" type="checkbox" />
        <span>Я согласен с условиями сервиса</span>
      </label>

      <div v-if="errorMessage" class="state-box state-box--error">{{ errorMessage }}</div>

      <button class="button-link auth-form__submit" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Создаём аккаунт...' : 'Создать аккаунт' }}
      </button>
    </form>

    <p class="auth-view__hint">
      Уже есть аккаунт?
      <RouterLink class="auth-view__link" :to="loginLink">Войти</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { register, isLoading, error, clearError } = useAuth();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreed: false
});
const errorMessage = ref('');
const loginLink = {
  name: 'login',
  query: route.query.redirect ? { redirect: String(route.query.redirect) } : undefined
};

function validate() {
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();

  if (!fullName || !form.email || !form.password || !form.confirmPassword) {
    return 'Заполните все обязательные поля.';
  }

  if (!emailPattern.test(form.email)) {
    return 'Введите корректный email.';
  }

  if (form.password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов.';
  }

  if (form.password !== form.confirmPassword) {
    return 'Пароли не совпадают.';
  }

  if (!form.agreed) {
    return 'Подтвердите согласие с условиями сервиса.';
  }

  return '';
}

async function handleSubmit() {
  clearError();
  errorMessage.value = '';

  const validationError = validate();
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  try {
    await register({
      name: [form.firstName, form.lastName].filter(Boolean).join(' ').trim(),
      email: form.email,
      password: form.password
    });

    await router.push(String(route.query.redirect || '/'));
  } catch (requestError) {
    errorMessage.value = error.value || 'Не удалось зарегистрироваться. Проверьте введённые данные.';
  }
}
</script>
