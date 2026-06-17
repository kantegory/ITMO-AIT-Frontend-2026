<template>
  <base-layout>
    <section aria-labelledby="register-title" class="card auth-card p-4">
      <h2 id="register-title" class="mb-4">Регистрация</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="registerName" class="form-label">Имя</label>
          <input
            id="registerName"
            v-model="form.name"
            type="text"
            class="form-control"
            autocomplete="name"
            required
          >
        </div>
        <div class="mb-3">
          <label for="registerEmail" class="form-label">Email</label>
          <input
            id="registerEmail"
            v-model="form.email"
            type="email"
            class="form-control"
            autocomplete="email"
            required
          >
        </div>
        <div class="mb-3">
          <label for="registerPassword" class="form-label">Пароль</label>
          <input
            id="registerPassword"
            v-model="form.password"
            type="password"
            class="form-control"
            autocomplete="new-password"
            required
          >
        </div>
        <div class="mb-4">
          <label for="registerRole" class="form-label">Тип аккаунта</label>
          <select id="registerRole" v-model="form.role" class="form-select">
            <option value="user">Пользователь</option>
            <option value="organizer">Организатор</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success w-100 btn-icon">
          <base-icon name="user" />
          <span>Зарегистрироваться</span>
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
  name: 'RegisterView',
  components: { BaseLayout, BaseIcon },
  setup() {
    const { register } = useAuth()
    const { showToast } = useToast()
    return { register, showToast }
  },
  data() {
    return { form: { name: '', email: '', password: '', role: 'user' } }
  },
  methods: {
    async onSubmit() {
      const name = this.form.name.trim()
      const email = this.form.email.trim().toLowerCase()
      const password = this.form.password.trim()
      const role = this.form.role || 'user'
      if (!name || !email || !password) {
        this.showToast('Заполните все поля')
        return
      }
      await this.register({ name, email, password, role })
    }
  }
}

</script>
