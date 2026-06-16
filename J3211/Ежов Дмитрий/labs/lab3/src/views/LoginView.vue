<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '../components/SvgIcon.vue';
import PasswordInput from '../components/PasswordInput.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import LabNav from '../components/LabNav.vue';
import { useAuth } from '../composables/useAuth';
import { extractErrorMessage } from '../api/client';

const router = useRouter();
const { login } = useAuth();

const email = ref('');
const password = ref('');
const emailInvalid = ref(false);
const passwordInvalid = ref(false);
const formError = ref('');
const submitting = ref(false);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

onMounted(() => {
  document.title = 'Вход — ТаскерAI';
});

async function onSubmit(): Promise<void> {
  formError.value = '';
  emailInvalid.value = !EMAIL_REGEX.test(email.value);
  passwordInvalid.value = password.value.length === 0;
  if (emailInvalid.value || passwordInvalid.value) return;

  submitting.value = true;
  try {
    await login({ email: email.value, password: password.value });
    await router.replace({ name: 'dashboard' });
  } catch (err) {
    formError.value = extractErrorMessage(err, 'Не удалось войти');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <ThemeToggle floating />
  <main id="main" class="page-wrap">
    <div class="auth-box card-glass">
      <RouterLink to="/" class="auth-logo" aria-label="ТаскерAI — на главную">
        <div class="auth-logo-icon" aria-hidden="true">
          <SvgIcon name="logo" :size="18" />
        </div>
        <span class="auth-logo-name text-gradient">ТаскерAI</span>
      </RouterLink>

      <h1 class="auth-title">Вход</h1>
      <p class="auth-sub">
        Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>

      <form novalidate aria-label="Форма входа" @submit.prevent="onSubmit">
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <div class="input-wrapper">
            <SvgIcon name="email" />
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-input"
              :class="{ 'is-invalid': emailInvalid }"
              placeholder="you@example.com"
              autocomplete="email"
              required
              aria-required="true"
              aria-describedby="emailErr"
              @input="emailInvalid = false"
            />
          </div>
          <span class="form-error" id="emailErr">Введите корректный email</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Пароль</label>
          <PasswordInput
            v-model="password"
            placeholder="Ваш пароль"
            autocomplete="current-password"
            describedby="passwordErr"
            :invalid="passwordInvalid"
          />
          <span class="form-error" id="passwordErr">Введите пароль</span>
        </div>

        <div
          v-if="formError"
          class="form-error"
          role="alert"
          aria-live="assertive"
          style="display:block; margin-bottom: 12px;"
        >{{ formError }}</div>

        <button type="submit" class="btn-primary-custom w-full" :disabled="submitting">
          {{ submitting ? 'Входим…' : 'Войти' }}
        </button>
      </form>
    </div>

    <LabNav />
  </main>
</template>

<style>
.page-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  position: relative;
  z-index: 1;
}
.auth-box { width: 100%; max-width: 400px; padding: 40px 36px; }
.auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; text-decoration: none; }
.auth-logo-icon { width: 34px; height: 34px; background: var(--gradient-primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.auth-logo-name { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.03em; }
.auth-title { font-size: 1.5rem; margin-bottom: 6px; }
.auth-sub { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 32px; }
.input-wrapper { position: relative; }
.input-wrapper .icon-left,
.input-wrapper > .icon:first-child {
  position: absolute;
  left: 14px; top: 50%; transform: translateY(-50%);
  width: 17px; height: 17px;
  color: var(--text-muted); pointer-events: none;
}
.input-wrapper .form-input { padding-left: 44px; }
.input-wrapper .icon-right {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted); cursor: pointer; background: none; border: none;
  padding: 2px; display: flex; transition: color var(--transition);
}
.input-wrapper .icon-right:hover { color: var(--text-accent); }
.input-wrapper .form-input.with-right { padding-right: 42px; }

.lab-nav { margin-top: 20px; width: 100%; max-width: 600px; }
.lab-nav-title { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; text-align: center; }
.lab-nav-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.lab-nav-grid > * { width: 160px; }
.lab-nav-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-decoration: none; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500; transition: all var(--transition); }
.lab-nav-item:hover { border-color: var(--border-accent); color: var(--text-accent); background: rgba(139, 92, 246, 0.06); }
.lab-nav-item.current { border-color: var(--violet-500); color: var(--violet-400); background: rgba(139, 92, 246, 0.1); }
</style>
