<template>
  <base-layout>
    <section aria-labelledby="login-title" class="card auth-card p-4">
      <h2 id="login-title" class="mb-4">Вход</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input
            id="loginEmail"
            v-model="form.email"
            type="email"
            class="form-control"
            autocomplete="email"
            required
          >
        </div>
        <div class="mb-4">
          <label for="loginPassword" class="form-label">Пароль</label>
          <input
            id="loginPassword"
            v-model="form.password"
            type="password"
            class="form-control"
            autocomplete="current-password"
            required
          >
        </div>
        <button type="submit" class="btn btn-primary w-100 btn-icon">
          <base-icon name="login" />
          <span>Войти</span>
        </button>
      </form>
    </section>
  </base-layout>
</template>

<script>

import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import useAuth from '@/composables/useAuth'
import useToast from '@/composables/useToast'

export default {
  name: 'LoginView',
  components: { BaseLayout, BaseIcon },
  setup() {

    const { login } = useAuth()
    const { showToast } = useToast()
    return { login, showToast }
  },
  data() {
    return { form: { email: '', password: '' } }
  },
  methods: {
    async onSubmit() {
      const email = this.form.email.trim().toLowerCase()
      const password = this.form.password.trim()
      if (!email || !password) {
        this.showToast('Заполните все поля')
        return
      }
      await this.login({ email, password })
    }
  }
}

</script>
