<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMsg = ref('');
const submitting = ref(false);

const submit = async () => {
  errorMsg.value = '';
  submitting.value = true;
  try {
    await login({ email: email.value, password: password.value });
    const redirect = route.query.redirect || '/profile';
    router.push(redirect);
  } catch (err) {
    errorMsg.value = err.response?.status === 400
      ? 'Неверный email или пароль'
      : err.message || 'Ошибка входа';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <main class="auth-wrapper">
    <div class="auth-card">
      <h2 class="text-center">Вход</h2>
      <p class="subtitle text-center">Войдите в свой аккаунт MLOps Deploy</p>

      <div v-if="errorMsg" class="alert alert-danger" role="alert">{{ errorMsg }}</div>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="user@example.com"
            required
          >
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Пароль</label>
          <div class="input-group">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Введите пароль"
              required
            >
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="submitting">
          {{ submitting ? 'Вход...' : 'Войти' }}
        </button>
        <p class="text-center text-muted small mb-0">
          Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>
