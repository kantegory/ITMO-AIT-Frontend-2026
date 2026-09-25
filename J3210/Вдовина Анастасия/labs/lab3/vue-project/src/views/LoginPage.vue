<template>
  <base-layout>
    <div class="card auth-card p-4">
      <h1 class="h3 mb-3">Вход</h1>

      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>

      <form aria-label="Вход в аккаунт" @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control" autocomplete="email" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            autocomplete="current-password"
            required
          />
        </div>

        <div class="form-check mb-3">
          <input id="remember" v-model="form.remember" class="form-check-input" type="checkbox" />
          <label class="form-check-label" for="remember">Запомнить меня</label>
        </div>

        <button type="submit" class="btn btn-brand w-100">Войти</button>
      </form>

      <p class="text-muted small text-center mt-3 mb-0">
        Тестовый аккаунт: anna@example.com / password123
      </p>
    </div>
  </base-layout>
</template>

<script>
import { mapActions } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import useAuthStore from '@/stores/auth'
import { useAuthMessage } from '@/composables/useAuthMessage'

export default {
  name: 'LoginPage',
  components: { BaseLayout },

  setup() {
    return useAuthMessage()
  },

  data() {
    return {
      form: { email: '', password: '', remember: true },
      message: '',
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['login']),

    async onSubmit() {
      this.message = ''

      try {
        await this.login({ email: this.form.email, password: this.form.password }, this.form.remember)
        this.$router.push({ name: 'profile' })
      } catch (error) {
        this.message = this.authMessage(error, 'Не удалось войти. Попробуйте ещё раз.')
      }
    },
  },
}
</script>
