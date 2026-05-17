<script setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import NotificationAlert from '../components/NotificationAlert.vue';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';

const router = useRouter();
const { register } = useAuth();
const { notification, showNotification } = useNotifications();
const form = reactive({
  email: '',
  username: '',
  password: '',
  passwordConfirm: '',
  terms: false,
});
const errors = reactive({});

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.email) errors.email = 'Введите email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Введите корректный email';
  if (!form.username) errors.username = 'Введите имя пользователя';
  if (!form.password) errors.password = 'Введите пароль';
  else if (form.password.length < 8) errors.password = 'Минимум 8 символов';
  if (form.password !== form.passwordConfirm) errors.passwordConfirm = 'Пароли не совпадают';
  if (!form.terms) errors.terms = 'Необходимо принять условия использования';

  return Object.keys(errors).length === 0;
}

async function submit() {
  if (!validate()) return;

  try {
    await register({
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
    });
    showNotification('Регистрация успешна. Теперь можно войти', 'success');
    window.setTimeout(() => router.push({ name: 'login' }), 1200);
  } catch {
    showNotification('Ошибка регистрации. Попробуйте другой email', 'danger');
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-7 col-lg-5">
      <div class="card shadow">
        <div class="card-body p-4">
          <h1 class="h4 text-center mb-4">Регистрация</h1>
          <NotificationAlert :notification="notification" />

          <form novalidate @submit.prevent="submit">
            <div class="mb-3">
              <label for="register-email" class="form-label">Email</label>
              <input id="register-email" v-model.trim="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="mb-3">
              <label for="register-username" class="form-label">Имя пользователя</label>
              <input id="register-username" v-model.trim="form.username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
              <div class="invalid-feedback">{{ errors.username }}</div>
            </div>
            <div class="mb-3">
              <label for="register-password" class="form-label">Пароль</label>
              <input id="register-password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div class="mb-3">
              <label for="register-password-confirm" class="form-label">Повторите пароль</label>
              <input id="register-password-confirm" v-model="form.passwordConfirm" type="password" class="form-control" :class="{ 'is-invalid': errors.passwordConfirm }" />
              <div class="invalid-feedback">{{ errors.passwordConfirm }}</div>
            </div>
            <div class="form-check mb-3">
              <input id="register-terms" v-model="form.terms" class="form-check-input" type="checkbox" :class="{ 'is-invalid': errors.terms }" />
              <label class="form-check-label" for="register-terms">Принимаю условия использования</label>
              <div class="invalid-feedback">{{ errors.terms }}</div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
          </form>

          <p class="text-center mt-4 mb-0">
            Уже есть аккаунт?
            <RouterLink to="/">Войти</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
