<template>
  <section class="form-page">
    <form class="form-box" @submit.prevent="submit">
      <h1>Вход</h1>
      <p v-if="error" class="form-error">{{ error }}</p>

      <label class="form-group">
        <span>Email</span>
        <input v-model="form.email" type="email" autocomplete="email" required>
      </label>

      <label class="form-group">
        <span>Пароль</span>
        <input v-model="form.password" type="password" autocomplete="current-password" required>
      </label>

      <button class="btn btn-full" type="submit" :disabled="loading">
        {{ loading ? 'Входим...' : 'Войти' }}
      </button>

      <p class="form-link">
        Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { loginUser } from '../services/auth';

const router = useRouter();
const route = useRoute();
const { setUser } = useAuth();
const form = reactive({
  email: '',
  password: ''
});
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';

  try {
    const user = await loginUser(form);
    setUser(user);
    router.push(route.query.redirect || '/profile');
  } catch {
    error.value = 'Не получилось войти. Проверьте email и пароль.';
  } finally {
    loading.value = false;
  }
}
</script>
