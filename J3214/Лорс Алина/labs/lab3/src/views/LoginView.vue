<template>
  <main class="auth-layout" id="loginMain" tabindex="-1" aria-labelledby="loginPageTitle">
    <AuthHero />
    <section class="auth-panel" aria-labelledby="loginPageTitle">
      <div class="auth-card card border-0 shadow-lg">
        <div class="card-body p-4 p-lg-5">
          <div class="mb-4">
            <h2 class="h3 mb-2" id="loginPageTitle">Вход в аккаунт</h2>
            <p class="text-secondary mb-0">Войдите в существующий аккаунт или создайте новый.</p>
          </div>

          <form novalidate @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label" for="loginEmail">Email</label>
              <div class="input-group">
                <span class="input-group-text" aria-hidden="true"><IconSprite name="envelope" /></span>
                <input id="loginEmail" v-model.trim="email" class="form-control" type="email" placeholder="name@example.com" autocomplete="email" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="loginPassword">Пароль</label>
              <div class="input-group">
                <span class="input-group-text" aria-hidden="true"><IconSprite name="lock" /></span>
                <input id="loginPassword" v-model="password" class="form-control" :type="showPassword ? 'text' : 'password'" placeholder="Введите пароль" autocomplete="current-password" required />
                <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'">
                  <IconSprite :name="showPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
            </div>

            <p v-if="error" class="alert alert-danger py-2">{{ error }}</p>

            <button class="btn btn-primary w-100 btn-lg mb-3" type="submit" :disabled="loading">
              {{ loading ? 'Входим...' : 'Войти' }}
            </button>

            <div class="demo-tip p-3 rounded-4 mb-3">
              <div class="d-flex gap-3">
                <IconSprite name="lightbulb" />
                <div>
                  <strong>Совет:</strong>
                  <div class="small text-secondary">Если не знаете пароль от старых пользователей в db.json, нажмите «Зарегистрироваться» — новые демо-данные создадутся автоматически.</div>
                </div>
              </div>
            </div>

            <p class="text-center mb-0 text-secondary">Нет аккаунта?
              <RouterLink class="fw-semibold text-decoration-none" to="/register">Зарегистрироваться</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthHero from '../components/AuthHero.vue';
import IconSprite from '../components/IconSprite.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();
const { showToast } = useToast();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  loading.value = true;
  error.value = '';
  try {
    await login(email.value, password.value);
    showToast('Вы успешно вошли в систему');
    router.push(route.query.redirect || '/dashboard');
  } catch (err) {
    error.value = 'Не удалось войти. Проверьте email и пароль или зарегистрируйте новый аккаунт.';
  } finally {
    loading.value = false;
  }
}
</script>
