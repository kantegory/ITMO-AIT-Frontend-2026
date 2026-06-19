<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useAlert } from '../composables/useAlert';
import { useFormValidation } from '../composables/useFormValidation';
import AlertMessage from '../components/AlertMessage.vue';

const router = useRouter();
const { login } = useAuth();
const { alert, showAlert } = useAlert();
const { wasValidated, validateForm } = useFormValidation();

const formRef = ref(null);
const email = ref('');
const password = ref('');

async function handleSubmit() {
  if (!validateForm(formRef.value)) return;

  try {
    await login(email.value, password.value);
    showAlert('success', 'Вход выполнен успешно.');
    setTimeout(() => router.push({ name: 'profile' }), 600);
  } catch (e) {
    showAlert('danger', e.message || 'Ошибка при входе.');
  }
}
</script>

<template>
  <main class="auth-wrapper container py-5">
    <section class="auth-card card shadow border-0 rounded-4 mx-auto p-4 p-md-5">
      <header class="text-center mb-4">
        <h1 class="h3 fw-bold">Вход в аккаунт</h1>
        <p class="text-secondary mb-0">Введите почту и пароль для входа</p>
      </header>

      <form
        ref="formRef"
        novalidate
        :class="{ 'was-validated': wasValidated }"
        @submit.prevent="handleSubmit"
      >
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input
            id="loginEmail"
            v-model="email"
            type="email"
            class="form-control form-control-lg"
            placeholder="name@example.com"
            required
          >
          <div class="invalid-feedback">Введите корректный email.</div>
        </div>

        <div class="mb-3">
          <label for="loginPassword" class="form-label">Пароль</label>
          <input
            id="loginPassword"
            v-model="password"
            type="password"
            class="form-control form-control-lg"
            minlength="6"
            placeholder="Минимум 6 символов"
            required
          >
          <div class="invalid-feedback">Введите пароль не короче 6 символов.</div>
        </div>

        <div class="d-grid mb-3">
          <button type="submit" class="btn btn-primary btn-lg">Войти</button>
        </div>

        <p class="text-center text-secondary mb-0">
          Нет аккаунта?
          <router-link :to="{ name: 'register' }">Зарегистрироваться</router-link>
        </p>
      </form>

      <section class="mt-3">
        <AlertMessage :type="alert.type" :text="alert.text" />
      </section>
    </section>
  </main>
</template>
