<template>
  <section class="page container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <h1 class="h4 mb-3 text-center">Регистрация</h1>
        <form class="card p-3 p-md-4" aria-label="Форма регистрации" @submit.prevent="submit">
          <div class="mb-3">
            <label for="registerName" class="form-label">Имя</label>
            <input
              id="registerName"
              v-model="name"
              type="text"
              class="form-control"
              name="name"
              autocomplete="name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="registerEmail" class="form-label">E‑mail</label>
            <input
              id="registerEmail"
              v-model="email"
              type="email"
              class="form-control"
              name="email"
              autocomplete="email"
              inputmode="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="registerPassword" class="form-label">Пароль</label>
            <input
              id="registerPassword"
              v-model="password"
              type="password"
              class="form-control"
              name="password"
              autocomplete="new-password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="busy">Создать аккаунт</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { register, authErrorMessage } = useAuth()
const { show } = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const busy = ref(false)

async function submit() {
  const n = name.value.trim()
  const e = email.value.trim()
  const p = password.value.trim()
  if (!n || !e || !p) return
  busy.value = true
  try {
    await register({ name: n, email: e, password: p })
    show('Регистрация завершена, вы вошли')
    await router.replace({ name: 'profile' })
  } catch (err) {
    show(authErrorMessage(err, 'register'))
  } finally {
    busy.value = false
  }
}
</script>
