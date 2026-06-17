<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';

const router = useRouter();
const { login } = useAuth();
const { toggleTheme } = useTheme();

const email = ref('');
const password = ref('');
const error = ref('');
const showPassword = ref(false);

async function loginUser() {
  error.value = '';

  try {
    await login(email.value.trim(), password.value.trim());
    router.push('/dashboard');
  } catch (e) {
    error.value = e.message || 'Не удалось подключиться к JSON Server';
  }
}
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 400px">
      <h3 class="text-center mb-4">
        <svg class="icon" aria-hidden="true"><use href="/sprite.svg#user" /></svg>
        Вход
      </h3>

      <div class="text-center mb-3">
        <button class="btn btn-sm btn-outline-secondary" type="button" @click="toggleTheme">
          Тема
        </button>
      </div>

      <form @submit.prevent="loginUser">
        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input id="email" v-model="email" type="email" class="form-control" required>
        </div>

        <div class="mb-3">
          <label class="form-label" for="password">Пароль</label>
          <div class="input-group">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              required
            >
            <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
              Показать
            </button>
          </div>
        </div>

        <div class="text-danger mb-3" role="alert" aria-live="assertive">
          {{ error }}
        </div>

        <button class="btn btn-primary w-100" type="submit">
          Войти
        </button>

        <div class="text-center mt-3">
          <RouterLink to="/register">Регистрация</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
