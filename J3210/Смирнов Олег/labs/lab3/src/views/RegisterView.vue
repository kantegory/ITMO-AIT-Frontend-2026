<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { register } = useAuth();

const name = ref('');
const email = ref('');
const bio = ref('');
const location = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');
const submitting = ref(false);

const SERVER_ERROR = 'Не удалось подключиться к серверу. Убедитесь, что json-server запущен.';

async function onSubmit() {
  error.value = '';
  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают.';
    return;
  }
  submitting.value = true;
  try {
    const result = await register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      bio: bio.value.trim(),
      location: location.value.trim(),
    });
    if (!result.ok) {
      error.value = result.error;
      return;
    }
    router.push('/dashboard');
  } catch {
    error.value = SERVER_ERROR;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main id="main-content" class="d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="text-center mb-4">
            <h1 class="h3">Регистрация</h1>
            <p class="text-muted">Создайте аккаунт на AI Hub</p>
          </div>

          <div v-if="error" class="alert alert-danger" role="alert" aria-live="assertive">
            {{ error }}
          </div>

          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="name" class="form-label">Имя</label>
              <input
                id="name"
                v-model="name"
                type="text"
                class="form-control"
                placeholder="Иван Иванов"
                autocomplete="name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="bio" class="form-label">О себе</label>
              <input
                id="bio"
                v-model="bio"
                type="text"
                class="form-control"
                placeholder="ML-инженер, студент…"
              />
            </div>
            <div class="mb-3">
              <label for="location" class="form-label">Город</label>
              <input
                id="location"
                v-model="location"
                type="text"
                class="form-control"
                placeholder="Москва"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Пароль</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Минимум 8 символов"
                autocomplete="new-password"
                minlength="8"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password-confirm" class="form-label">Повторите пароль</label>
              <input
                id="password-confirm"
                v-model="passwordConfirm"
                type="password"
                class="form-control"
                placeholder="Ещё раз"
                autocomplete="new-password"
                minlength="8"
                required
              />
            </div>
            <button type="submit" class="btn btn-accent w-100" :disabled="submitting">
              {{ submitting ? 'Создаём…' : 'Зарегистрироваться' }}
            </button>
          </form>

          <p class="text-center text-muted small mt-4">
            Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
