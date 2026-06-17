<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '../api/auth';
import { useAuth } from '../composables/useAuth';
import { useI18n } from '../composables/useI18n';

const email = ref('');
const password = ref('');
const remember = ref(false);
const error = ref('');
const submitting = ref(false);

const { setAuth } = useAuth();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  error.value = '';
  submitting.value = true;
  try {
    const data = await login(email.value.trim(), password.value);
    if (!data || !data.user) throw new Error('Ошибка ответа сервера');
    setAuth(data.user, data.token);
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null;
    router.push(redirect || { name: 'dashboard' });
  } catch (e) {
    error.value = (e?.response?.data?.message) || e.message || 'Ошибка входа';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="auth-wrapper">
    <div class="container">
      <div class="auth-card card shadow mx-auto p-4">
        <h2 class="text-center mb-4">{{ t('login_title') }}</h2>
        <form @submit.prevent="onSubmit" novalidate>
          <div class="mb-3">
            <label for="login-email" class="form-label">{{ t('login_email') }}</label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="name@example.com"
              required
            />
          </div>
          <div class="mb-3">
            <label for="login-password" class="form-label">{{ t('login_password') }}</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3 form-check">
            <input id="login-remember" v-model="remember" type="checkbox" class="form-check-input" />
            <label class="form-check-label" for="login-remember">{{ t('login_remember') }}</label>
          </div>
          <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
            {{ t('login_submit') }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0 small text-muted">
          <span>{{ t('login_no_account') }}</span>
          <RouterLink :to="{ name: 'register' }" class="ms-1">{{ t('login_register_link') }}</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
