<script setup>
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import NotificationAlert from '../components/NotificationAlert.vue';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';

const { login } = useAuth();
const { notification, showNotification } = useNotifications();
const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '' });

function validate() {
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!form.password) {
    errors.password = 'Введите пароль';
  }

  return !errors.email && !errors.password;
}

async function submit() {
  if (!validate()) return;

  try {
    await login(form.email.trim(), form.password);
  } catch (error) {
    showNotification(error.message || 'Ошибка входа', 'danger');
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow">
        <div class="card-body p-4">
          <h1 class="h4 text-center mb-4">Вход в систему</h1>
          <NotificationAlert :notification="notification" />

          <form novalidate @submit.prevent="submit">
            <div class="mb-3">
              <label for="login-email" class="form-label">Email</label>
              <input
                id="login-email"
                v-model.trim="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                placeholder="name@example.com"
                autocomplete="email"
              />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <div class="mb-3">
              <label for="login-password" class="form-label">Пароль</label>
              <input
                id="login-password"
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <button type="submit" class="btn btn-primary w-100">Войти</button>
          </form>

          <p class="text-center mt-4 mb-0">
            Нет аккаунта?
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
