<template>
  <section class="form-page">
    <form class="form-box" @submit.prevent="submit">
      <h1>Регистрация</h1>
      <p v-if="error" class="form-error">{{ error }}</p>

      <label class="form-group">
        <span>Имя</span>
        <input v-model="form.name" type="text" autocomplete="name" required>
      </label>

      <label class="form-group">
        <span>Email</span>
        <input v-model="form.email" type="email" autocomplete="email" required>
      </label>

      <label class="form-group">
        <span>Пароль</span>
        <input v-model="form.password" type="password" autocomplete="new-password" minlength="6" required>
      </label>

      <button class="btn btn-full" type="submit" :disabled="loading">
        {{ loading ? 'Создаем...' : 'Создать аккаунт' }}
      </button>

      <p class="form-link">
        Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
      </p>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { registerUser } from '../services/auth';

const router = useRouter();
const { setUser } = useAuth();
const form = reactive({
  name: '',
  email: '',
  password: ''
});
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';

  try {
    const user = await registerUser(form);
    setUser(user);
    router.push('/profile');
  } catch {
    error.value = 'Не получилось зарегистрироваться. Возможно, email уже занят.';
  } finally {
    loading.value = false;
  }
}
</script>
