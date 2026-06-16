<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '../components/SvgIcon.vue';
import PasswordInput from '../components/PasswordInput.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import { useAuth } from '../composables/useAuth';
import { extractErrorMessage } from '../api/client';
import type { UserRole } from '../types/domain';

const router = useRouter();
const { register } = useAuth();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
  role: 'manager' as UserRole,
  terms: false,
});

const invalid = reactive({
  name: false,
  email: false,
  password: false,
  confirm: false,
  terms: false,
});

const formError = ref('');
const submitting = ref(false);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

onMounted(() => {
  document.title = 'Регистрация — ТаскерAI';
});

function validate(): boolean {
  invalid.name = form.name.trim().length < 2;
  invalid.email = !EMAIL_REGEX.test(form.email);
  invalid.password = form.password.length < 8;
  invalid.confirm = form.confirm !== form.password || form.confirm === '';
  invalid.terms = !form.terms;
  return !Object.values(invalid).some(Boolean);
}

async function onSubmit(): Promise<void> {
  formError.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
    await router.replace({ name: 'dashboard' });
  } catch (err) {
    formError.value = extractErrorMessage(err, 'Не удалось зарегистрироваться');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <ThemeToggle floating />
  <main id="main" class="auth-wrap">
    <div class="auth-box card-glass">
      <RouterLink to="/" class="auth-logo" aria-label="ТаскерAI — на главную">
        <div class="auth-logo-icon">
          <SvgIcon name="logo" :size="18" />
        </div>
        <span class="auth-logo-name text-gradient">ТаскерAI</span>
      </RouterLink>

      <h1 class="auth-title">Регистрация</h1>
      <p class="auth-sub">
        Уже есть аккаунт? <RouterLink to="/">Войти</RouterLink>
      </p>

      <form novalidate aria-label="Форма регистрации" @submit.prevent="onSubmit">
        <div class="form-group">
          <label class="form-label" for="name">Имя</label>
          <div class="input-wrapper">
            <SvgIcon name="user" />
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="form-input"
              :class="{ 'is-invalid': invalid.name }"
              placeholder="Ваше имя"
              autocomplete="name"
              required
              @input="invalid.name = false"
            />
          </div>
          <span class="form-error">Введите имя</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <div class="input-wrapper">
            <SvgIcon name="email" />
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-input"
              :class="{ 'is-invalid': invalid.email }"
              placeholder="you@example.com"
              autocomplete="email"
              required
              @input="invalid.email = false"
            />
          </div>
          <span class="form-error">Введите корректный email</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Пароль</label>
          <PasswordInput
            v-model="form.password"
            placeholder="Минимум 8 символов"
            autocomplete="new-password"
            :minlength="8"
            :invalid="invalid.password"
          />
          <span class="form-error">Пароль минимум 8 символов</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="confirm">Повторите пароль</label>
          <div class="input-wrapper">
            <SvgIcon name="shield" />
            <input
              type="password"
              id="confirm"
              v-model="form.confirm"
              class="form-input"
              :class="{ 'is-invalid': invalid.confirm }"
              placeholder="Повторите пароль"
              autocomplete="new-password"
              required
              @input="invalid.confirm = false"
            />
          </div>
          <span class="form-error">Пароли не совпадают</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="role">Роль</label>
          <select id="role" v-model="form.role" class="form-select-custom">
            <option value="manager">Менеджер — создаёт и распределяет задачи</option>
            <option value="developer">Разработчик — выполняет задачи</option>
            <option value="analyst">Аналитик — следит за прогрессом</option>
            <option value="observer">Наблюдатель — только просмотр</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 24px">
          <label class="checkbox-custom">
            <input type="checkbox" v-model="form.terms" />
            <span class="checkbox-box">
              <SvgIcon name="check" :size="11" />
            </span>
            <span class="text-sm" style="color: var(--text-secondary)">
              Принимаю <a href="#" @click.prevent>условия использования</a>
            </span>
          </label>
          <span v-if="invalid.terms" class="form-error" style="display: block; margin-top: 6px">Примите условия</span>
        </div>

        <div
          v-if="formError"
          class="form-error"
          role="alert"
          aria-live="assertive"
          style="display:block; margin-bottom: 12px;"
        >{{ formError }}</div>

        <button type="submit" class="btn-primary-custom w-full" :disabled="submitting">
          {{ submitting ? 'Создаём аккаунт…' : 'Создать аккаунт' }}
        </button>
      </form>

      <p class="auth-footer">
        Уже есть аккаунт? <RouterLink to="/">Войти →</RouterLink>
      </p>
    </div>
  </main>
</template>

<style>
.auth-wrap {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 40px 16px; position: relative; z-index: 1;
}
.form-select-custom {
  width: 100%; background: var(--bg-overlay);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
  color: var(--text-primary); padding: 12px 16px;
  font-size: 0.95rem; font-family: var(--font-sans);
  outline: none; cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.form-select-custom:focus { border-color: var(--violet-500); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); }
.auth-footer { text-align: center; margin-top: 20px; font-size: 0.875rem; color: var(--text-secondary); }
</style>
