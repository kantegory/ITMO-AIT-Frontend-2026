<template>
  <main class="container main-block">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="text-center mb-4">Вход в систему</h1>

            <BaseAlert :message="errorMessage" type="danger" />

            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model.trim="form.email"
                  type="email"
                  class="form-control"
                  placeholder="ivan@example.com"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Вход...' : 'Войти' }}
                </button>
              </div>

              <p class="text-center mb-0">
                Нет аккаунта?
                <RouterLink to="/register">Зарегистрироваться</RouterLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import BaseAlert from '../components/BaseAlert.vue';
import { useFinanceManager } from '../composables/useFinanceManager.js';

const router = useRouter();
const finance = useFinanceManager();

const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  email: '',
  password: '',
});

async function submitForm() {
  loading.value = true;
  errorMessage.value = '';

  try {
    await finance.login(form.email, form.password);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>