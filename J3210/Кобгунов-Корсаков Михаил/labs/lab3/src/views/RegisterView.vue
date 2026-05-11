<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';

const router = useRouter();
const { register } = useAuth();
const { toggleTheme } = useTheme();

const name = ref('');
const email = ref('');
const pass1 = ref('');
const pass2 = ref('');
const agree = ref(false);
const error = ref('');

async function validateForm() {
  error.value = '';

  if (pass1.value !== pass2.value) {
    error.value = 'Пароли не совпадают';
    return;
  }

  if (!agree.value) {
    error.value = 'Подтвердите условия';
    return;
  }

  try {
    await register(name.value.trim(), email.value.trim(), pass1.value);
    alert('Регистрация успешна');
    router.push('/login');
  } catch (e) {
    error.value = e.message || 'Не удалось подключиться к JSON Server';
  }
}
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 420px">
      <h3 class="text-center mb-4">Регистрация</h3>

      <div class="text-center mb-3">
        <button class="btn btn-sm btn-outline-secondary" type="button" @click="toggleTheme">
          Тема
        </button>
      </div>

      <form @submit.prevent="validateForm">
        <label class="visually-hidden" for="name">Имя</label>
        <input id="name" v-model="name" class="form-control mb-3" placeholder="Имя" required>

        <label class="visually-hidden" for="email">Email</label>
        <input id="email" v-model="email" class="form-control mb-3" placeholder="Email" type="email" required>

        <label class="visually-hidden" for="pass1">Пароль</label>
        <input id="pass1" v-model="pass1" type="password" class="form-control mb-3" placeholder="Пароль" required>

        <label class="visually-hidden" for="pass2">Повторите пароль</label>
        <input id="pass2" v-model="pass2" type="password" class="form-control mb-3" placeholder="Повторите пароль" required>

        <div class="form-check mb-3">
          <input id="agree" v-model="agree" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="agree">Согласен с условиями</label>
        </div>

        <div class="text-danger mb-2" role="alert" aria-live="assertive">
          {{ error }}
        </div>

        <button class="btn btn-success w-100" type="submit">
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
</template>
