<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '@/api/api'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const auth = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const alert = ref({
  type: '',
  text: '',
  visible: false,
})

const showMessage = (type, text) => {
  alert.value = {
    type,
    text,
    visible: true,
  }
}

const hideMessage = () => {
  alert.value = {
    type: '',
    text: '',
    visible: false,
  }
}

const sanitizePassword = () => {
  form.password = form.password.replace(/\s/g, '')
}

const handleSubmit = async () => {
  hideMessage()

  const email = form.email.trim()

  try {
    const response = await api.signup({
      name: form.name.trim(),
      email,
      password: form.password,
      avatar: `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`,
      learningCourseIds: [],
      createdCourseIds: [],
    })

    auth.setSession(response.user)
    await router.replace('/courses')
  } catch {
    showMessage('danger', 'Не удалось зарегистрироваться.')
  }
}

onMounted(async () => {
  await auth.redirectAuth()
})
</script>

<template>
  <main class="container d-flex justify-content-center align-items-center py-5">
    <section
      class="card p-4 rounded-4"
      style="max-width: 460px; width: 100%;"
      aria-labelledby="authTitle"
    >
      <h1 id="authTitle" class="h5 text-center mb-3">Регистрация</h1>

      <div
        v-if="alert.visible"
        :class="`alert alert-${alert.type}`"
        role="alert"
      >
        {{ alert.text }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="inputName" class="form-label">Имя</label>
          <input
            id="inputName"
            v-model="form.name"
            type="text"
            class="form-control"
            autocomplete="name"
            required
          >
        </div>

        <div class="mb-3">
          <label for="inputEmail" class="form-label">Адрес</label>
          <input
            id="inputEmail"
            v-model="form.email"
            type="email"
            class="form-control"
            autocomplete="email"
            required
          >
        </div>

        <div class="mb-3">
          <label for="inputPassword" class="form-label">Пароль</label>
          <input
            id="inputPassword"
            v-model="form.password"
            type="password"
            class="form-control"
            autocomplete="new-password"
            required
            @input="sanitizePassword"
          >
        </div>

        <div class="d-flex justify-content-center mb-3">
          <button type="submit" class="btn btn-primary w-75">
            Зарегистрироваться
          </button>
        </div>

        <p class="text-center mt-3 mb-0">
          Есть аккаунт?
          <RouterLink to="/login" class="link-primary">
            Войти
          </RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>
