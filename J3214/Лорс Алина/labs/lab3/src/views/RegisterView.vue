<template>
  <main class="auth-layout" id="registerMain" tabindex="-1" aria-labelledby="registerPageTitle">
    <AuthHero />
    <section class="auth-panel" aria-labelledby="registerPageTitle">
      <div class="auth-card card border-0 shadow-lg">
        <div class="card-body p-4 p-lg-5">
          <div class="mb-4">
            <h2 class="h3 mb-2" id="registerPageTitle">Регистрация</h2>
            <p class="text-secondary mb-0">После регистрации приложение автоматически создаст демо-счета, бюджеты и операции.</p>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="firstName">Имя</label>
                <input id="firstName" v-model.trim="form.firstName" class="form-control" type="text" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="lastName">Фамилия</label>
                <input id="lastName" v-model.trim="form.lastName" class="form-control" type="text" required />
              </div>
              <div class="col-12">
                <label class="form-label" for="email">Email</label>
                <input id="email" v-model.trim="form.email" class="form-control" type="email" autocomplete="email" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="password">Пароль</label>
                <input id="password" v-model="form.password" class="form-control" type="password" minlength="6" autocomplete="new-password" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="currency">Валюта</label>
                <select id="currency" v-model="form.currency" class="form-select">
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label" for="monthlyGoal">Месячный бюджет</label>
                <input id="monthlyGoal" v-model.number="form.monthlyGoal" class="form-control" type="number" min="1000" step="100" required />
              </div>
            </div>

            <p v-if="error" class="alert alert-danger py-2 mt-3">{{ error }}</p>

            <button class="btn btn-primary w-100 btn-lg mt-4 mb-3" type="submit" :disabled="loading">
              {{ loading ? 'Создаём аккаунт...' : 'Создать аккаунт' }}
            </button>

            <p class="text-center mb-0 text-secondary">Уже есть аккаунт?
              <RouterLink class="fw-semibold text-decoration-none" to="/login">Войти</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthHero from '../components/AuthHero.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { register } = useAuth();
const { showToast } = useToast();
const loading = ref(false);
const error = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  currency: 'EUR',
  monthlyGoal: 30000
});

async function handleSubmit() {
  loading.value = true;
  error.value = '';
  try {
    await register(form);
    showToast('Аккаунт создан, демо-данные добавлены');
    router.push('/dashboard');
  } catch (err) {
    error.value = 'Не удалось зарегистрироваться. Возможно, такой email уже есть в db.json.';
  } finally {
    loading.value = false;
  }
}
</script>
