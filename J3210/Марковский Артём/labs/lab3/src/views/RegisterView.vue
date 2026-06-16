<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const router = useRouter()
const { error, loading, register } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const agreeRules = ref(false)

const passwordRef = ref(null)
const passwordRepeatRef = ref(null)

async function submit() {
  if (passwordRef.value) {
    passwordRef.value.setCustomValidity(password.value.length < 6 ? 'Минимум 6 символов' : '')
  }
  if (passwordRepeatRef.value) {
    passwordRepeatRef.value.setCustomValidity(
      password.value !== passwordRepeat.value ? 'Пароли должны совпадать' : '',
    )
  }

  if (password.value.length < 6) {
    passwordRef.value?.reportValidity()
    return
  }
  if (password.value !== passwordRepeat.value) {
    passwordRepeatRef.value?.reportValidity()
    return
  }

  const ok = await register({
    firstName: firstName.value.trim().slice(0, 40),
    lastName: lastName.value.trim().slice(0, 40),
    email: email.value.trim(),
    password: password.value,
  })

  if (ok) router.push({ name: 'login' })
}
</script>

<template>
  <main id="mainContent" class="auth-page">
    <div class="container">
      <div class="row g-4 align-items-stretch auth-grid">
        <div class="col-lg-6">
          <section class="hero-panel h-100" aria-labelledby="registerHeroTitle">
            <div class="eyebrow">Новый аккаунт</div>
            <h1 class="hero-title" id="registerHeroTitle">Создание аккаунта</h1>
            <p class="hero-text">После регистрации можно зайти в систему и открыть доступные вам проекты.</p>
            <div class="hero-list">
              <div class="hero-item">
                <div class="hero-item-title">Главная страница</div>
                <div class="hero-item-text">Список проектов и общая информация по ним.</div>
              </div>
              <div class="hero-item">
                <div class="hero-item-title">Страница проекта</div>
                <div class="hero-item-text">Основная страница проекта с задачами, сроками и файлами.</div>
              </div>
              <div class="hero-item">
                <div class="hero-item-title">Роли в проекте</div>
                <div class="hero-item-text">Можно посмотреть, что доступно для каждой роли.</div>
              </div>
            </div>
          </section>
        </div>
        <div class="col-lg-6 col-xl-5 ms-xl-auto">
          <section class="panel-card auth-card" aria-labelledby="registerTitle">
            <div class="eyebrow">Регистрация</div>
            <h2 class="panel-title" id="registerTitle">Создание аккаунта</h2>
            <p class="panel-text">Заполните форму, чтобы создать аккаунт.</p>
            <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
            <form @submit.prevent="submit" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="firstName">Имя</label>
                  <input
                    class="form-control form-control-lg"
                    id="firstName"
                    type="text"
                    placeholder="Артём"
                    autocomplete="given-name"
                    maxlength="40"
                    required
                    v-model="firstName"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="lastName">Фамилия</label>
                  <input
                    class="form-control form-control-lg"
                    id="lastName"
                    type="text"
                    placeholder="Марковский"
                    autocomplete="family-name"
                    maxlength="40"
                    required
                    v-model="lastName"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label" for="registerEmail">Email</label>
                  <input
                    class="form-control form-control-lg"
                    id="registerEmail"
                    type="email"
                    placeholder="artem@example.com"
                    autocomplete="email"
                    required
                    v-model="email"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="registerPassword">Пароль</label>
                  <input
                    class="form-control form-control-lg"
                    id="registerPassword"
                    type="password"
                    placeholder="Минимум 6 символов"
                    autocomplete="new-password"
                    required
                    v-model="password"
                    ref="passwordRef"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="registerPasswordRepeat">Подтверждение пароля</label>
                  <input
                    class="form-control form-control-lg"
                    id="registerPasswordRepeat"
                    type="password"
                    placeholder="Повторите пароль"
                    autocomplete="new-password"
                    required
                    v-model="passwordRepeat"
                    ref="passwordRepeatRef"
                  />
                </div>
              </div>
              <div class="form-check mt-4">
                <input
                  class="form-check-input"
                  id="agreeRules"
                  type="checkbox"
                  required
                  v-model="agreeRules"
                />
                <label class="form-check-label" for="agreeRules">Я принимаю правила работы в сервисе</label>
              </div>
              <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary btn-lg" type="submit" :disabled="loading">
                  {{ loading ? 'Регистрируем...' : 'Зарегистрироваться' }}
                </button>
                <RouterLink class="btn btn-light btn-lg" to="/">У меня уже есть аккаунт</RouterLink>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
