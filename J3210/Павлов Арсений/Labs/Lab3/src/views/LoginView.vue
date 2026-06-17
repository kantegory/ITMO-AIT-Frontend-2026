<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const form = reactive({
  email: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref('');

async function onSubmit() {
  errorMessage.value = '';

  if (!form.email.trim()) {
    errorMessage.value = 'Введите email.';
    return;
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Пароль должен содержать минимум 8 символов.';
    return;
  }

  isLoading.value = true;
  const result = await auth.login({
    email: form.email.trim(),
    password: form.password,
  });
  isLoading.value = false;

  if (!result.ok) {
    errorMessage.value = result.message;
    return;
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
  router.push(redirect);
}
</script>

<template>
  <section class="auth-wrapper">
    <article class="glass-card auth-card reveal">
      <h1 class="page-title mb-2">Вход в аккаунт</h1>
      <p class="page-subtitle mb-4">
        Для работы ЛР3 запустите сначала API: <code>npm run api</code>, затем dev-сервер: <code>npm run dev</code>.
      </p>

      <div class="mb-3">
        <label class="form-label" for="loginEmail">Email</label>
        <input id="loginEmail" v-model.trim="form.email" type="email" class="form-control" placeholder="name@example.com" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="loginPassword">Пароль</label>
        <input id="loginPassword" v-model="form.password" type="password" class="form-control" placeholder="Минимум 8 символов" />
      </div>

      <button class="btn btn-accent w-100" type="button" :disabled="isLoading" @click="onSubmit">
        {{ isLoading ? 'Выполняется вход...' : 'Войти' }}
      </button>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="status">{{ errorMessage }}</div>

      <p class="text-muted-custom mt-4 mb-0">
        Нет аккаунта?
        <RouterLink class="text-decoration-none" to="/register">Создать профиль</RouterLink>
      </p>
    </article>
  </section>
</template>
