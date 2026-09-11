<template>
  <base-layout>
    <div class="card auth-card p-4">
      <h1 class="h3 mb-3">Регистрация</h1>

      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>

      <form aria-label="Регистрация аккаунта" @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="name" class="form-label">Имя и фамилия</label>
          <input id="name" v-model="form.name" type="text" class="form-control" autocomplete="name" required />
        </div>

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
            autocomplete="new-password"
            minlength="8"
            aria-describedby="passwordHint"
            required
          />
          <div id="passwordHint" class="form-text">Минимум 8 символов.</div>
        </div>

        <div class="mb-3">
          <label for="passwordConfirm" class="form-label">Повторите пароль</label>
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            type="password"
            class="form-control"
            autocomplete="new-password"
            required
          />
        </div>

        <fieldset class="mb-3">
          <legend class="form-label h6">Тип аккаунта</legend>

          <div class="form-check">
            <input id="visitor" v-model="form.role" class="form-check-input" type="radio" value="visitor" />
            <label class="form-check-label" for="visitor">Посетитель</label>
          </div>

          <div class="form-check">
            <input id="organizer" v-model="form.role" class="form-check-input" type="radio" value="organizer" />
            <label class="form-check-label" for="organizer">Организатор</label>
          </div>
        </fieldset>

        <div class="form-check mb-3">
          <input id="agree" v-model="form.agree" class="form-check-input" type="checkbox" required />
          <label class="form-check-label" for="agree">Согласен с условиями использования</label>
        </div>

        <button type="submit" class="btn btn-brand w-100">Зарегистрироваться</button>
      </form>
    </div>
  </base-layout>
</template>

<script>
import { mapActions } from 'pinia'

import BaseLayout from '@/layouts/BaseLayout.vue'
import useAuthStore from '@/stores/auth'
import { useAuthMessage } from '@/composables/useAuthMessage'

export default {
  name: 'RegisterPage',
  components: { BaseLayout },

  setup() {
    return useAuthMessage()
  },

  data() {
    return {
      form: { name: '', email: '', password: '', passwordConfirm: '', role: 'visitor', agree: false },
      message: '',
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['register']),

    async onSubmit() {
      this.message = ''

      if (this.form.password !== this.form.passwordConfirm) {
        this.message = 'Пароли не совпадают.'
        return
      }

      const { name, email, password, role } = this.form

      try {
        await this.register({ name, email, password, role })
        this.$router.push({ name: 'profile' })
      } catch (error) {
        this.message = this.authMessage(error, 'Не удалось зарегистрироваться.')
      }
    },
  },
}
</script>
