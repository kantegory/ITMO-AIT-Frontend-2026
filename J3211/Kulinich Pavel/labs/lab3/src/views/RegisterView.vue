<script setup>
import { ref, reactive } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useAlert } from '../composables/useAlert';
import { useFormValidation } from '../composables/useFormValidation';
import AlertMessage from '../components/AlertMessage.vue';

const { register } = useAuth();
const { alert, showAlert } = useAlert();
const { wasValidated, validateForm, resetValidation } = useFormValidation();

const formRef = ref(null);
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
  agree: false
});

async function handleSubmit() {
  if (!validateForm(formRef.value)) return;

  try {
    const { agree, ...payload } = form;
    await register(payload);
    showAlert('success', 'Регистрация успешно завершена.');
    Object.assign(form, { firstName: '', lastName: '', email: '', password: '', role: '', agree: false });
    resetValidation();
  } catch (e) {
    showAlert('danger', e.message || 'Ошибка при регистрации.');
  }
}
</script>

<template>
  <main class="auth-wrapper container py-5">
    <section class="auth-card card shadow border-0 rounded-4 mx-auto p-4 p-md-5">
      <header class="text-center mb-4">
        <h1 class="h3 fw-bold">Регистрация</h1>
        <p class="text-secondary mb-0">Создайте аккаунт покупателя билетов</p>
      </header>

      <form
        ref="formRef"
        novalidate
        :class="{ 'was-validated': wasValidated }"
        @submit.prevent="handleSubmit"
      >
        <div class="row g-3">
          <div class="col-md-6">
            <label for="firstName" class="form-label">Имя</label>
            <input id="firstName" v-model="form.firstName" type="text" class="form-control form-control-lg" required>
            <div class="invalid-feedback">Введите имя.</div>
          </div>
          <div class="col-md-6">
            <label for="lastName" class="form-label">Фамилия</label>
            <input id="lastName" v-model="form.lastName" type="text" class="form-control form-control-lg" required>
            <div class="invalid-feedback">Введите фамилию.</div>
          </div>
        </div>

        <div class="mt-3">
          <label for="registerEmail" class="form-label">Email</label>
          <input id="registerEmail" v-model="form.email" type="email" class="form-control form-control-lg" required>
          <div class="invalid-feedback">Введите корректный email.</div>
        </div>

        <div class="mt-3">
          <label for="registerPassword" class="form-label">Пароль</label>
          <input
            id="registerPassword"
            v-model="form.password"
            type="password"
            class="form-control form-control-lg"
            minlength="6"
            required
          >
          <div class="invalid-feedback">Пароль должен содержать минимум 6 символов.</div>
        </div>

        <div class="mt-3">
          <label for="role" class="form-label">Тип аккаунта</label>
          <select id="role" v-model="form.role" class="form-select form-select-lg" required>
            <option value="">Выберите вариант</option>
            <option value="user">Покупатель</option>
            <option value="organizer">Организатор</option>
          </select>
          <div class="invalid-feedback">Выберите тип аккаунта.</div>
        </div>

        <div class="form-check mt-3">
          <input id="agree" v-model="form.agree" class="form-check-input" type="checkbox" required>
          <label class="form-check-label" for="agree">Я согласен с правилами сервиса</label>
          <div class="invalid-feedback">Нужно подтвердить согласие.</div>
        </div>

        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-primary btn-lg">Создать аккаунт</button>
        </div>
      </form>

      <section class="mt-3">
        <AlertMessage :type="alert.type" :text="alert.text" />
      </section>
    </section>
  </main>
</template>
