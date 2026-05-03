<script setup>
import { ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const email = ref('');
const password = ref('');
const error = ref('');
const submitting = ref(false);

const SERVER_ERROR = 'Не удалось подключиться к серверу. Убедитесь, что json-server запущен.';

async function onSubmit() {
  error.value = '';
  submitting.value = true;
  try {
    const result = await login(email.value.trim(), password.value);
    if (!result.ok) {
      error.value = result.error;
      return;
    }
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
    router.push(redirect);
  } catch {
    error.value = SERVER_ERROR;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main id="main-content" class="d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="text-center mb-4">
            <h1 class="h3">Вход</h1>
            <p class="text-muted">Войдите в свой аккаунт</p>
          </div>

          <div v-if="error" class="alert alert-danger" role="alert" aria-live="assertive">
            {{ error }}
          </div>

          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Пароль</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Ваш пароль"
                autocomplete="current-password"
                required
              />
            </div>
            <button type="submit" class="btn btn-accent w-100" :disabled="submitting">
              {{ submitting ? 'Входим…' : 'Войти' }}
            </button>
          </form>

          <p class="text-center text-muted small mt-4">
            Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
