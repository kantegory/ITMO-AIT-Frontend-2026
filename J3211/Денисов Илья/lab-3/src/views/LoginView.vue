<script setup>
import { reactive } from 'vue';
import AuthCard from '../components/AuthCard.vue';
import FormAlert from '../components/FormAlert.vue';
import { useAuth } from '../composables/useAuth';

const form = reactive({
  email: '',
  password: ''
});

const { authLoading, authError, login, clearAuthError } = useAuth();

async function submitLogin() {
  const success = await login(form.email.trim(), form.password.trim());

  if (!success) {
    form.password = '';
  }
}
</script>

<template>
  <AuthCard title="Вход в аккаунт" width="22rem">
    <form novalidate @submit.prevent="submitLogin">
      <FormAlert :message="authError" />

      <div class="form-floating mb-3">
        <input
          id="floatingInput"
          v-model="form.email"
          type="email"
          class="form-control"
          placeholder="name@example.com"
          autocomplete="email"
          required
          @input="clearAuthError"
        />
        <label for="floatingInput">Email</label>
      </div>

      <div class="form-floating mb-4">
        <input
          id="floatingPassword"
          v-model="form.password"
          type="password"
          class="form-control"
          placeholder="Password"
          autocomplete="current-password"
          required
          @input="clearAuthError"
        />
        <label for="floatingPassword">Пароль</label>
      </div>

      <button type="submit" class="btn btn-outline-primary w-100" :disabled="authLoading">
        {{ authLoading ? 'Проверка...' : 'Войти' }}
      </button>
    </form>
  </AuthCard>
</template>
