<template>
  <main class="auth-layout" aria-labelledby="registerTitle">
    <section class="auth-panel card border-0 shadow-lg">
      <div class="card-body p-4 p-md-5">
        <header class="text-center mb-4">
          <div class="brand-mark mx-auto mb-2" aria-hidden="true">FO</div>
          <h1 id="registerTitle" class="h4 mb-1 fw-bold">Создание аккаунта</h1>
          <p class="text-secondary mb-0">Подключитесь к команде DataOps</p>
        </header>

        <form @submit.prevent="submitRegister">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label" for="name">Имя</label>
              <input id="name" v-model.trim="form.name" class="form-control" required>
            </div>
            <div class="col-12">
              <label class="form-label" for="email">Email</label>
              <input id="email" v-model.trim="form.email" class="form-control" type="email" required>
            </div>
            <div class="col-12">
              <label class="form-label" for="password">Пароль</label>
              <input id="password" v-model="form.password" class="form-control" type="password" required>
            </div>
            <div class="col-12">
              <label class="form-label" for="confirm">Подтверждение пароля</label>
              <input id="confirm" v-model="confirmPassword" class="form-control" type="password" required>
              <p v-if="passwordError" class="text-danger small mb-0 mt-1">{{ passwordError }}</p>
            </div>
            <div class="col-12">
              <label class="form-label" for="team">Команда / Организация</label>
              <input id="team" v-model.trim="form.team" class="form-control" required>
            </div>
          </div>

          <div class="d-grid mt-4">
            <button class="btn btn-primary" type="submit" :disabled="loading">{{ loading ? 'Создаем...' : 'Зарегистрироваться' }}</button>
          </div>

          <p class="text-center mt-3 mb-0 text-secondary">
            Уже есть аккаунт?
            <RouterLink class="text-decoration-none fw-semibold" to="/">Войти</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { register } = useAuth();
const { showToast } = useToast();

const loading = ref(false);
const confirmPassword = ref('');
const form = reactive({
  name: '',
  email: '',
  password: '',
  team: ''
});

const passwordError = computed(() => {
  if (!confirmPassword.value) return '';
  if (form.password.length < 6) return 'Пароль должен быть не менее 6 символов.';
  if (form.password !== confirmPassword.value) return 'Пароли не совпадают.';
  return '';
});

const submitRegister = async () => {
  if (passwordError.value) return;
  loading.value = true;
  try {
    await register(form);
    router.push('/dashboard');
  } catch (error) {
    showToast(`Ошибка регистрации: ${error.response?.data || error.message}`);
  } finally {
    loading.value = false;
  }
};
</script>
