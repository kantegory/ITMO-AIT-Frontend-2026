<template>
  <main class="auth-layout" aria-labelledby="loginTitle">
    <section class="auth-panel card border-0 shadow-lg">
      <div class="card-body p-4 p-md-5">
        <header class="text-center mb-4">
          <div class="brand-mark mx-auto mb-2" aria-hidden="true">FO</div>
          <h1 id="loginTitle" class="h4 mb-1 fw-bold">FlowOrchestrator</h1>
          <p class="text-secondary mb-0">Управление ETL, DAG и DataOps процессами</p>
        </header>

        <form novalidate @submit.prevent="submitLogin">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Email</label>
            <input id="loginEmail" v-model.trim="form.email" type="email" class="form-control" autocomplete="username" required>
          </div>

          <div class="mb-3">
            <label for="loginPassword" class="form-label">Пароль</label>
            <input id="loginPassword" v-model="form.password" type="password" class="form-control" autocomplete="current-password" required>
          </div>

          <div class="d-grid mb-3">
            <button class="btn btn-primary" type="submit" :disabled="loading">{{ loading ? 'Входим...' : 'Войти' }}</button>
          </div>

          <p class="text-center mb-0 text-secondary">
            Нет аккаунта?
            <RouterLink class="text-decoration-none fw-semibold" to="/register">Зарегистрироваться</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { login } = useAuth();
const { showToast } = useToast();

const loading = ref(false);
const form = reactive({
  email: 'ruslan@flow.io',
  password: '123456'
});

const submitLogin = async () => {
  loading.value = true;
  try {
    await login(form);
    router.push('/dashboard');
  } catch (error) {
    showToast(`Ошибка входа: ${error.response?.data || error.message}`);
  } finally {
    loading.value = false;
  }
};
</script>
