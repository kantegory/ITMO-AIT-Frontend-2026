<template>
  <section class="auth-form"><h1 class="h3 mb-3" tabindex="-1">{{ mode === 'register' ? 'Регистрация' : 'Вход' }}</h1>
    <RequestState :loading="loading" :error="error || notice" />
    <form @submit.prevent="submit">
      <div v-if="mode === 'register'" class="mb-3"><label for="name" class="form-label">Имя</label><input id="name" v-model="form.name" class="form-control" autocomplete="name" maxlength="80" required></div>
      <div class="mb-3"><label for="email" class="form-label">Email</label><input id="email" v-model="form.email" class="form-control" type="email" autocomplete="username" required></div>
      <div class="mb-3"><label for="password" class="form-label">Пароль (от 6 символов)</label><input id="password" v-model="form.password" class="form-control" type="password" :autocomplete="mode === 'register' ? 'new-password' : 'current-password'" minlength="6" required></div>
      <button class="btn btn-primary" :disabled="loading">{{ mode === 'register' ? 'Зарегистрироваться' : 'Войти' }}</button>
      <RouterLink class="ms-3" :to="mode === 'register' ? '/login' : '/register'">{{ mode === 'register' ? 'Войти' : 'Создать аккаунт' }}</RouterLink>
    </form>
  </section>
</template>
<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useRequest } from '../composables/useRequest';
import RequestState from '../components/RequestState.vue';
const props = defineProps({ mode: String });
const form = reactive({ name: '', email: '', password: '' });
const { authenticate, notice } = useAuth();
const { loading, error, run } = useRequest();
const router = useRouter();
function submit() { if (!loading.value) run(() => authenticate(props.mode, form), () => router.replace('/dashboard')); }
</script>
