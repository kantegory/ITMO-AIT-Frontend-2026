<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { register } = useAuth();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  role: 'developer',
  password: '',
  confirmPassword: ''
});
const errorMsg = ref('');
const submitting = ref(false);

const submit = async () => {
  errorMsg.value = '';

  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Пароли не совпадают';
    return;
  }
  if (form.password.length < 8) {
    errorMsg.value = 'Пароль должен быть не менее 8 символов';
    return;
  }

  submitting.value = true;
  try {
    await register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      company: form.company,
      role: form.role
    });
    router.push('/profile');
  } catch (err) {
    errorMsg.value = err.response?.data || 'Ошибка регистрации. Возможно, email уже занят';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <main class="auth-wrapper">
    <div class="auth-card">
      <h2 class="text-center">Регистрация</h2>
      <p class="subtitle text-center">Создайте аккаунт для работы с платформой</p>

      <div v-if="errorMsg" class="alert alert-danger" role="alert">{{ errorMsg }}</div>

      <form @submit.prevent="submit">
        <div class="row mb-3">
          <div class="col">
            <label class="form-label">Имя</label>
            <input v-model="form.firstName" type="text" class="form-control" required>
          </div>
          <div class="col">
            <label class="form-label">Фамилия</label>
            <input v-model="form.lastName" type="text" class="form-control" required>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Команда / Организация</label>
          <input v-model="form.company" type="text" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Роль</label>
          <select v-model="form.role" class="form-select">
            <option value="developer">ML-инженер</option>
            <option value="devops">DevOps-инженер</option>
            <option value="ds">Data Scientist</option>
            <option value="manager">Менеджер</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input v-model="form.password" type="password" class="form-control" placeholder="Минимум 8 символов" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Повторите пароль</label>
          <input v-model="form.confirmPassword" type="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="submitting">
          {{ submitting ? 'Регистрация...' : 'Создать аккаунт' }}
        </button>
        <p class="text-center text-muted small mb-0">
          Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>
