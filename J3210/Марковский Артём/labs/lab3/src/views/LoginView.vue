<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const router = useRouter()
const { error, loading, login } = useAuth()

const email = ref('')
const password = ref('')

async function submit() {
  const ok = await login(email.value.trim(), password.value)
  if (ok) router.push({ name: 'dashboard' })
}
</script>

<template>
  <main id="mainContent" class="auth-page">
    <div class="container">
      <div class="row g-4 align-items-stretch auth-grid">
        <div class="col-lg-6">
          <section class="hero-panel h-100" aria-labelledby="loginHeroTitle">
            <div class="eyebrow">Вход в систему</div>
            <h1 class="hero-title" id="loginHeroTitle">Добро пожаловать в TaskHub</h1>
            <p class="hero-text">Войдите, чтобы открыть свои проекты и задачи.</p>
            <div class="hero-list">
              <div class="hero-item">
                <div class="hero-item-title">Проекты</div>
                <div class="hero-item-text">Все проекты и задачи в одном месте.</div>
              </div>
              <div class="hero-item">
                <div class="hero-item-title">Роли</div>
                <div class="hero-item-text">Администратор, участник или наблюдатель — у каждого свои возможности.</div>
              </div>
              <div class="hero-item">
                <div class="hero-item-title">Поиск</div>
                <div class="hero-item-text">Быстро найти нужную задачу по фильтрам.</div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-lg-6 col-xl-5 ms-xl-auto">
          <section class="panel-card auth-card" aria-labelledby="loginTitle">
            <div class="eyebrow">Вход</div>
            <h2 class="panel-title" id="loginTitle">Войти в аккаунт</h2>
            <p class="panel-text">Введите email и пароль для входа.</p>
            <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
            <form @submit.prevent="submit" novalidate>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label" for="loginEmail">Email</label>
                  <input
                    class="form-control form-control-lg"
                    id="loginEmail"
                    type="email"
                    placeholder="artem@example.com"
                    autocomplete="email"
                    required
                    v-model="email"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label" for="loginPassword">Пароль</label>
                  <input
                    class="form-control form-control-lg"
                    id="loginPassword"
                    type="password"
                    placeholder="Ваш пароль"
                    autocomplete="current-password"
                    required
                    v-model="password"
                  />
                </div>
              </div>
              <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary btn-lg" type="submit" :disabled="loading">
                  {{ loading ? 'Входим...' : 'Войти' }}
                </button>
                <RouterLink class="btn btn-light btn-lg" to="/register">Создать аккаунт</RouterLink>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
