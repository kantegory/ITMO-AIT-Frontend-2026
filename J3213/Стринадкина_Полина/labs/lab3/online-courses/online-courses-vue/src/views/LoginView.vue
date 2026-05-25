<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, error } = useAuth()

const email = ref('')
const password = ref('')

const submitLogin = async () => {
  const user = await login(email.value)

  if (!user) {
    return
  }

  if (user.role === 'teacher') {
    router.push('/teacher')
  } else {
    router.push('/profile')
  }
}
</script>

<template>
  <div class="row justify-content-center">

    <div class="col-md-6 col-lg-5">

      <div class="card shadow">

        <div class="card-body p-4">

          <h1 class="text-center mb-4">
            Вход
          </h1>

          <form @submit.prevent="submitLogin">

            <div class="mb-3">

              <label
                for="email"
                class="form-label"
              >
                Email
              </label>

              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Введите email"
                required
              >

            </div>

            <div class="mb-3">

              <label
                for="password"
                class="form-label"
              >
                Пароль
              </label>

              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Введите пароль"
                required
              >

            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
            >
              Войти
            </button>

          </form>

          <p
            v-if="error"
            class="text-danger text-center mt-3"
          >
            {{ error }}
          </p>

          <p class="text-center mt-3 mb-0">

            Нет аккаунта?

            <RouterLink to="/register">
              Зарегистрироваться
            </RouterLink>

          </p>

        </div>

      </div>

    </div>

  </div>
</template>