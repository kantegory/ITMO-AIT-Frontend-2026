<script setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useCourses } from '../composables/useCourses';

const route = useRoute();
const router = useRouter();
const { authError, authLoading, login } = useAuth();
const { fetchEnrollments } = useCourses();

const form = reactive({
  email: 'student@omagad.ru',
  password: 'password123',
});

async function handleSubmit() {
  const success = await login(form);
  if (!success) return;

  await fetchEnrollments();
  router.push(route.query.redirect || { name: 'profile' });
}
</script>

<template>
  <section class="auth-shell" aria-labelledby="login-title">
    <div class="auth-card">
      <p class="eyebrow">Авторизация</p>
      <h1 id="login-title">Вход</h1>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label>
          Email
          <input v-model="form.email" type="email" autocomplete="email" required />
        </label>
        <label>
          Пароль
          <input v-model="form.password" type="password" autocomplete="current-password" required />
        </label>
        <button class="primary-button" type="submit" :disabled="authLoading">
          {{ authLoading ? 'Входим...' : 'Войти' }}
        </button>
      </form>

      <p class="form-message" aria-live="polite">{{ authError }}</p>
      <RouterLink :to="{ name: 'register' }">Создать аккаунт</RouterLink>
    </div>
  </section>
</template>
