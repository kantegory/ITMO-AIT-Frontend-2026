<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  currency: 'RUB',
  agreement: false,
})

const status = ref('')
const error = ref('')

const submit = async () => {
  status.value = ''
  error.value = ''

  if (!form.agreement) {
    error.value = 'Нужно подтвердить согласие на обработку демонстрационных данных.'
    return
  }

  try {
    await register(form)
    status.value = 'Регистрация завершена. Сейчас откроется личный кабинет.'
    setTimeout(() => router.push('/dashboard'), 450)
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <section class="container">
    <div class="auth-card">
      <div class="badge-soft mb-3">
        <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-check"></use></svg>
        Регистрация
      </div>
      <h1 class="section-title mb-3">Создание аккаунта</h1>
      <p class="muted mb-4">После регистрации пользователю автоматически выдаются стартовые счета и бюджеты.</p>

      <form @submit.prevent="submit" novalidate>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="register-name">Имя</label>
            <input id="register-name" v-model="form.name" class="form-control" type="text" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="register-email">Электронная почта</label>
            <input id="register-email" v-model="form.email" class="form-control" type="email" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="register-password">Пароль</label>
            <input id="register-password" v-model="form.password" class="form-control" type="password" minlength="6" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="register-currency">Валюта</label>
            <select id="register-currency" v-model="form.currency" class="form-select">
              <option value="RUB">RUB</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div class="form-check my-4">
          <input id="agreement" v-model="form.agreement" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="agreement">
            Я согласен на обработку демонстрационных данных в учебном проекте
          </label>
        </div>

        <div class="d-flex flex-wrap gap-3">
          <button class="btn btn-primary" type="submit">Зарегистрироваться</button>
          <RouterLink class="btn btn-outline-primary" to="/login">У меня уже есть аккаунт</RouterLink>
        </div>
      </form>

      <p v-if="status" class="small-note mt-3" style="color: var(--success)">{{ status }}</p>
      <p v-if="error" class="small-note mt-3" style="color: var(--danger)">{{ error }}</p>
    </div>
  </section>
</template>
