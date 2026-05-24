<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { loading, error, register } = useAuth(router)

const form = reactive({
  name: '',
  email: '',
  password: '',
  city: '',
  terms: false
})
</script>

<template>
  <main id="main-content" class="container mt-5" tabindex="-1">
    <div class="row justify-content-center align-items-center" style="min-height: 75vh;">
      <div class="col-md-6 col-lg-5">
        <section class="card border-0 shadow-sm p-4" aria-labelledby="registerTitle">
          <div class="card-body">
            <div class="text-center mb-4">
              <h1 id="registerTitle" class="h3 fw-bold" style="color: var(--bloom-green);">Создать аккаунт</h1>
              <p id="registerDescription" class="text-muted small mb-0">
                Начните выращивать свои идеи вместе с AIBloom.
              </p>
            </div>

            <p v-if="error" class="text-danger small text-center mb-3">{{ error }}</p>

            <form id="registerForm" aria-describedby="registerDescription" @submit.prevent="register(form)">
              <div class="mb-3">
                <label for="regName" class="form-label small fw-bold text-uppercase">Полное имя</label>
                <input
                  id="regName"
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control px-3 py-2"
                  placeholder="Петя Иванов"
                  autocomplete="name"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="regEmail" class="form-label small fw-bold text-uppercase">Email</label>
                <input
                  id="regEmail"
                  v-model="form.email"
                  type="email"
                  name="email"
                  class="form-control px-3 py-2"
                  placeholder="name@example.com"
                  autocomplete="email"
                  inputmode="email"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="regPassword" class="form-label small fw-bold text-uppercase">Пароль</label>
                <input
                  id="regPassword"
                  v-model="form.password"
                  type="password"
                  name="password"
                  class="form-control px-3 py-2"
                  placeholder="Придумайте надежный пароль"
                  autocomplete="new-password"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="regCity" class="form-label small fw-bold text-uppercase">Город</label>
                <input
                  id="regCity"
                  v-model="form.city"
                  type="text"
                  name="city"
                  class="form-control px-3 py-2"
                  placeholder="Санкт-Петербург"
                >
              </div>

              <div class="mb-4 form-check">
                <input id="terms" v-model="form.terms" type="checkbox" class="form-check-input" required>
                <label class="form-check-label small text-muted" for="terms">
                  Я согласен с условиями использования и политикой посева данных.
                </label>
              </div>

              <button type="submit" class="btn btn-accent w-100 py-2 mb-3 shadow-sm" :disabled="loading">
                {{ loading ? 'Сохраняем...' : 'Зарегистрироваться' }}
              </button>

              <div class="text-center">
                <span class="small text-muted">Уже в саду? </span>
                <RouterLink to="/login" class="small fw-bold text-decoration-none touch-link" style="color: var(--bloom-green);">
                  Войти в аккаунт
                </RouterLink>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
