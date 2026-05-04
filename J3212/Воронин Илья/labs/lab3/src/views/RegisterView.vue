<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../api/auth';
import { useI18n } from '../composables/useI18n';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');
const submitting = ref(false);

const { t } = useI18n();
const router = useRouter();

async function onSubmit() {
  error.value = '';
  if (password.value !== passwordConfirm.value) {
    error.value = t('reg_passwords_mismatch');
    return;
  }
  submitting.value = true;
  try {
    await register(name.value.trim(), email.value.trim(), password.value);
    router.push({ name: 'login' });
  } catch (e) {
    error.value = (e?.response?.data?.message) || e.message || 'Ошибка регистрации';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="auth-wrapper">
    <div class="container">
      <div class="auth-card card shadow mx-auto p-4">
        <h2 class="text-center mb-4">{{ t('reg_title') }}</h2>
        <form @submit.prevent="onSubmit" novalidate>
          <div class="mb-3">
            <label for="reg-name" class="form-label">{{ t('reg_name') }}</label>
            <input id="reg-name" v-model="name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="reg-email" class="form-label">{{ t('reg_email') }}</label>
            <input id="reg-email" v-model="email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="reg-password" class="form-label">{{ t('reg_password') }}</label>
            <input
              id="reg-password"
              v-model="password"
              type="password"
              class="form-control"
              required
              minlength="6"
            />
            <div class="form-text">{{ t('reg_hint') }}</div>
          </div>
          <div class="mb-3">
            <label for="reg-password-confirm" class="form-label">{{ t('reg_confirm') }}</label>
            <input
              id="reg-password-confirm"
              v-model="passwordConfirm"
              type="password"
              class="form-control"
              required
            />
          </div>
          <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
            {{ t('reg_submit') }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0 small text-muted">
          <span>{{ t('reg_has_account') }}</span>
          <RouterLink :to="{ name: 'login' }" class="ms-1">{{ t('reg_login_link') }}</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
