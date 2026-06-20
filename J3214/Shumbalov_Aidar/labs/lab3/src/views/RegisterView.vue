<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { authError, authLoading, register } = useAuth();

const form = reactive({
  name: '',
  email: '',
  password: '',
});

async function handleSubmit() {
  const success = await register(form);
  if (success) {
    router.push({ name: 'profile' });
  }
}
</script>

<template>
  <section class="auth-shell" aria-labelledby="register-title">
    <div class="auth-card">
      <p class="eyebrow">Новый пользователь</p>
      <h1 id="register-title">Регистрация</h1>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label>
          Имя
          <input v-model="form.name" type="text" autocomplete="name" required />
        </label>
        <label>
          Email
          <input v-model="form.email" type="email" autocomplete="email" required />
        </label>
        <label>
          Пароль
          <input v-model="form.password" type="password" minlength="6" autocomplete="new-password" required />
        </label>
        <button class="primary-button" type="submit" :disabled="authLoading">
          {{ authLoading ? 'Создаём...' : 'Создать аккаунт' }}
        </button>
      </form>

      <p class="form-message" aria-live="polite">{{ authError }}</p>
      <RouterLink :to="{ name: 'login' }">Уже есть аккаунт</RouterLink>
    </div>
  </section>
</template>
