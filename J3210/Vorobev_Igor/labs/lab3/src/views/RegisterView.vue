<template>
  <div class="auth-page">
    <header class="landing-header">
      <ThemeToggle />
    </header>

    <main class="auth-wrapper">
      <section class="card auth-card" aria-labelledby="registerTitle">
        <div class="card-body p-4">
          <h1 id="registerTitle" class="auth-title">Регистрация</h1>

          <AppAlert :message="error" @close="error = ''" />

          <form @submit.prevent="submit">
            <div class="form-floating mb-3">
              <input id="floatingName" v-model.trim="form.name" type="text" class="form-control" placeholder="Имя" autocomplete="given-name" required />
              <label for="floatingName">Имя</label>
            </div>

            <div class="form-floating mb-3">
              <input id="floatingSurname" v-model.trim="form.surname" type="text" class="form-control" placeholder="Фамилия" autocomplete="family-name" required />
              <label for="floatingSurname">Фамилия</label>
            </div>

            <div class="form-floating mb-3">
              <input id="floatingEmail" v-model.trim="form.email" type="email" class="form-control" placeholder="Email" autocomplete="email" required />
              <label for="floatingEmail">Email</label>
            </div>

            <div class="form-floating mb-3">
              <input id="floatingPassword" v-model="form.password" type="password" class="form-control" placeholder="Пароль" autocomplete="new-password" required />
              <label for="floatingPassword">Пароль</label>
            </div>

            <div class="form-floating mb-4">
              <input id="floatingPasswordRepeat" v-model="form.passwordRepeat" type="password" class="form-control" placeholder="Повторите пароль" autocomplete="new-password" required />
              <label for="floatingPasswordRepeat">Повторите пароль</label>
            </div>

            <button class="btn btn-outline-black w-100 py-2 fw-bold" type="submit" :disabled="loading">
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
          </form>

          <div class="auth-links">
            <RouterLink to="/">← Назад</RouterLink>
            <span class="mx-2">|</span>
            <RouterLink to="/login">Уже есть аккаунт?</RouterLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AppAlert from '@/components/AppAlert.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordRepeat: '',
})
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''

  if (!form.name || !form.surname || !form.email || !form.password || !form.passwordRepeat) {
    error.value = 'Заполните все поля'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Пароль минимум 6 символов'
    return
  }
  if (form.password !== form.passwordRepeat) {
    error.value = 'Пароли не совпадают'
    form.passwordRepeat = ''
    return
  }

  loading.value = true
  try {
    await register(form)
    await router.push({ name: 'projects' })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
