<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { loading, error, login } = useAuth(router)

const form = reactive({
  email: '',
  password: ''
})
</script>

<template>
  <main id="main-content" class="container mt-5" tabindex="-1">
    <div class="row justify-content-center align-items-center" style="min-height: 70vh;">
      <div class="col-md-5 col-lg-4">
        <section class="card border-0 shadow-sm p-4" aria-labelledby="loginTitle">
          <div class="card-body">
            <div class="text-center mb-4">
              <h1 id="loginTitle" class="h3 fw-bold" style="color: var(--bloom-green);">С возвращением!</h1>
              <p id="loginDescription" class="text-muted small mb-0">
                Войдите, чтобы ухаживать за своим садом моделей.
              </p>
            </div>

            <p v-if="error" class="text-danger small text-center mb-3">{{ error }}</p>

            <form id="loginForm" aria-describedby="loginDescription" @submit.prevent="login(form)">
              <div class="mb-3">
                <label for="loginEmail" class="form-label small fw-bold text-uppercase">Ваш Email</label>
                <input
                  id="loginEmail"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="name@example.com"
                  autocomplete="username"
                  inputmode="email"
                  required
                >
              </div>

              <div class="mb-4">
                <label for="loginPassword" class="form-label small fw-bold text-uppercase">Пароль</label>
                <input
                  id="loginPassword"
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Введите пароль"
                  autocomplete="current-password"
                  required
                >
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2 mb-3" :disabled="loading">
                {{ loading ? 'Проверяем...' : 'Войти в оранжерею' }}
              </button>

              <div class="text-center">
                <span class="small text-muted">Еще не с нами? </span>
                <RouterLink to="/register" class="small fw-bold text-decoration-none touch-link auth-link">
                  Создать аккаунт
                </RouterLink>
              </div>
            </form>
          </div>
        </section>

        <div class="text-center mt-4">
          <RouterLink to="/" class="text-muted small text-decoration-none touch-link">
            ← Вернуться к поиску моделей
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
