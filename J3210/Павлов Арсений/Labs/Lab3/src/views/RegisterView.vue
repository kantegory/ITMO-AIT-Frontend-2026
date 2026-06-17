<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();
const router = useRouter();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  policyAgree: false,
});

const isLoading = ref(false);
const errorMessage = ref('');

async function onSubmit() {
  errorMessage.value = '';

  if (form.firstName.trim().length < 2) {
    errorMessage.value = 'Введите имя (минимум 2 символа).';
    return;
  }

  if (form.lastName.trim().length < 2) {
    errorMessage.value = 'Введите фамилию (минимум 2 символа).';
    return;
  }

  if (!form.email.trim()) {
    errorMessage.value = 'Введите email.';
    return;
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Пароль должен содержать минимум 8 символов.';
    return;
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Пароли не совпадают.';
    return;
  }

  if (!form.policyAgree) {
    errorMessage.value = 'Подтвердите согласие с обработкой персональных данных.';
    return;
  }

  isLoading.value = true;
  const result = await auth.register({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    password: form.password,
  });
  isLoading.value = false;

  if (!result.ok) {
    errorMessage.value = result.message;
    return;
  }

  router.push('/dashboard');
}
</script>

<template>
  <section class="auth-wrapper">
    <article class="glass-card auth-card reveal">
      <h1 class="page-title mb-2">Создать аккаунт</h1>
      <p class="page-subtitle mb-4">После регистрации профиль сразу откроется в личном кабинете.</p>

      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label" for="regFirstName">Имя</label>
          <input id="regFirstName" v-model.trim="form.firstName" type="text" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="regLastName">Фамилия</label>
          <input id="regLastName" v-model.trim="form.lastName" type="text" class="form-control" />
        </div>
        <div class="col-12">
          <label class="form-label" for="regEmail">Email</label>
          <input id="regEmail" v-model.trim="form.email" type="email" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="regPassword">Пароль</label>
          <input id="regPassword" v-model="form.password" type="password" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="regConfirmPassword">Повторите пароль</label>
          <input id="regConfirmPassword" v-model="form.confirmPassword" type="password" class="form-control" />
        </div>
      </div>

      <div class="form-check mt-3">
        <input id="policyAgree" v-model="form.policyAgree" class="form-check-input" type="checkbox" />
        <label class="form-check-label" for="policyAgree">Согласен с обработкой персональных данных</label>
      </div>

      <button class="btn btn-accent w-100 mt-4" type="button" :disabled="isLoading" @click="onSubmit">
        {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="status">{{ errorMessage }}</div>

      <p class="text-muted-custom mt-4 mb-0">
        Уже есть профиль?
        <RouterLink class="text-decoration-none" to="/login">Войти</RouterLink>
      </p>
    </article>
  </section>
</template>
