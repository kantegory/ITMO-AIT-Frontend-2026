<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const hasMinLength = computed(() => form.password.length >= 8)
const hasNumber = computed(() => /\d/.test(form.password))

const strengthWidth = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength++
  if (hasNumber.value) strength++

  if (strength === 0) return '0%'
  if (strength === 1) return '50%'
  return '100%'
})

const strengthColor = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength++
  if (hasNumber.value) strength++

  if (strength === 0) return 'transparent'
  if (strength === 1) return 'orange'
  return 'green'
})

async function handleSubmit() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.name.trim()) {
    errors.name = 'Введите имя'
    return
  }

  if (!form.email.trim()) {
    errors.email = 'Введите email'
    return
  }

  if (form.password.trim().length < 8) {
    errors.password = 'Пароль должен содержать минимум 8 символов'
    return
  }

  if (!/\d/.test(form.password.trim())) {
    errors.password = 'Пароль должен содержать хотя бы 1 цифру'
    return
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    return
  }

  try {
    await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      avatar: 'https://i.pravatar.cc/150?img=12'
    })

    router.push('/dashboard')
  } catch (error) {
    errors.email = error.message
  }
}
</script>

<template>
  <AuthLayout>
    <h1 class="text-center mb-4 text-white">Create Prime Account</h1>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="floating-input">
        <input id="name" v-model="form.name" type="text" required />
        <label for="name">Name</label>
        <small class="error-text" aria-live="polite">{{ errors.name }}</small>
      </div>

      <div class="floating-input">
        <input id="email" v-model="form.email" type="email" required />
        <label for="email">Email</label>
        <small class="error-text" aria-live="polite">{{ errors.email }}</small>
      </div>

      <div class="password-container">
        <PasswordInput
          id="password"
          v-model="form.password"
          label="Password"
          :error="errors.password"
        />

        <div class="password-strength" aria-hidden="true">
          <div :style="{ width: strengthWidth, background: strengthColor, height: '100%' }"></div>
        </div>

        <div class="password-rules">
          <p :class="{ 'rule-valid': hasMinLength }">Minimum 8 characters</p>
          <p :class="{ 'rule-valid': hasNumber }">At least 1 number</p>
        </div>
      </div>

      <PasswordInput
        id="confirmPassword"
        v-model="form.confirmPassword"
        label="Confirm Password"
        :error="errors.confirmPassword"
      />

      <button type="submit" class="btn btn-light w-100 mt-4">Create Account</button>

      <p class="text-center mt-3 mb-0 auth-note">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </form>
  </AuthLayout>
</template>