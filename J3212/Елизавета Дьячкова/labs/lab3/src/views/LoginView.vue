<template>
  <section class="page container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <h1 class="h4 mb-3 text-center">Вход</h1>
        <form class="card p-3 p-md-4" aria-label="Форма входа в аккаунт" @submit.prevent="submit">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">E‑mail</label>
            <input
              id="loginEmail"
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
            <label for="loginPassword" class="form-label">Пароль</label>
            <input
              id="loginPassword"
              v-model="password"
              type="password"
              class="form-control"
              name="password"
              autocomplete="current-password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="busy">Войти</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { login, authErrorMessage } = useAuth()
const { show } = useToast()

const email = ref('')
const password = ref('')
const busy = ref(false)

async function submit() {
  const e = email.value.trim()
  const p = password.value.trim()
  if (!e || !p) return
  busy.value = true
  try {
    await login(e, p)
    show('Вы вошли')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    await router.replace(redirect || { name: 'profile' })
  } catch (err) {
    show(authErrorMessage(err, 'login'))
  } finally {
    busy.value = false
  }
}
</script>
