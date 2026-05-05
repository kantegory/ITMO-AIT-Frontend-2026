<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useModalStore } from '@/stores/modal'

const router = useRouter()
const authStore = useAuthStore()
const modalStore = useModalStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

async function register() {
  if (form.password.length < 6) {
    modalStore.openInfo('Ошибка', 'Пароль должен содержать минимум 6 символов.')
    return
  }

  if (form.password !== form.confirmPassword) {
    modalStore.openInfo('Ошибка', 'Пароли не совпадают.')
    return
  }

  try {
    await authStore.register(form.email, form.password)
    modalStore.openInfo('Регистрация успешна', `Аккаунт ${form.email} создан.`)
    setTimeout(() => {
      router.push({ name: 'login' })
      modalStore.close()
    }, 900)
  } catch (error) {
    modalStore.openInfo('Ошибка', error.message)
  }
}
</script>

<template>
  <BaseLayout>
    <main class="container mt-4">
      <div class="row align-items-center justify-content-between g-4">
        <div class="col-12 col-lg-6">
          <h1 class="fw-bold hero-title">Присоединяйтесь к нам!</h1>
          <p class="lead hero-subtitle px-3 px-lg-0">
            Создайте аккаунт, чтобы начать управлять своими финансами вместе с "Мои прекрасные расходы". Это быстро и
            бесплатно!
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 id="register-form-title" class="card-title text-center mb-4">Регистрация</h2>
              <form aria-labelledby="register-form-title" @submit.prevent="register">
                <div class="mb-3">
                  <label for="email" class="form-label">Email адрес</label>
                  <input id="email" v-model="form.email" type="email" class="form-control" autocomplete="email" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Пароль</label>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    autocomplete="new-password"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Подтверждение пароля</label>
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    type="password"
                    class="form-control"
                    autocomplete="new-password"
                    required
                  />
                </div>
                <div class="d-grid gap-4">
                  <button type="submit" class="btn btn-primary btn-custom">Зарегистрироваться</button>
                </div>
                <div class="d-flex flex-column flex-sm-row align-items-center gap-3 mt-3 mx-sm-5">
                  <span class="mb-0 text-nowrap">Уже есть аккаунт?</span>
                  <RouterLink :to="{ name: 'login' }" class="btn btn-outline-secondary btn-custom flex-grow-1 w-100 w-sm-auto">
                    Войти
                  </RouterLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
