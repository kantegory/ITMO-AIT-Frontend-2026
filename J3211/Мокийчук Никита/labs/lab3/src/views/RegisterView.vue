<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import PasswordInput from '../components/PasswordInput.vue'

const router = useRouter()
const { register } = useAuth()
const { showToast } = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('student')
const agreeTerms = ref(false)

const handleSubmit = async () => {
  if (!name.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value) {
    showToast('Заполните все поля', 'danger')
    return
  }
  if (!agreeTerms.value) {
    showToast('Нужно принять условия использования', 'danger')
    return
  }
  if (password.value !== confirmPassword.value) {
    showToast('Пароли не совпадают', 'danger')
    return
  }
  if (password.value.length < 6) {
    showToast('Пароль должен содержать минимум 6 символов', 'danger')
    return
  }

  try {
    const user = await register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value
    })
    showToast('Регистрация прошла успешно!', 'success')
    setTimeout(
      () => router.push({ name: user.role === 'teacher' ? 'teacher' : 'profile' }),
      600
    )
  } catch (err) {
    showToast(err.message, 'danger')
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card" role="region" aria-labelledby="register-heading">
      <div class="text-center mb-2">
        <router-link :to="{ name: 'home' }" class="text-decoration-none auth-logo">
          <svg class="svg-icon" aria-hidden="true">
            <use href="/sprite/sprite.svg#icon-mortarboard"></use>
          </svg>
          MokiichukKnowledge
        </router-link>
      </div>

      <h1 class="h2 text-center" id="register-heading">Создать аккаунт</h1>
      <p class="text-center">Присоединяйтесь к 50 000+ студентов</p>

      <form novalidate aria-label="Форма регистрации" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label" for="regName">
            Имя и фамилия <span aria-hidden="true" class="text-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            id="regName"
            placeholder="Иван Иванов"
            autocomplete="name"
            required
            v-model="name"
          />
        </div>

        <div class="mb-3">
          <label class="form-label" for="regEmail">
            Email <span aria-hidden="true" class="text-danger">*</span>
          </label>
          <input
            type="email"
            class="form-control"
            id="regEmail"
            placeholder="example@mail.ru"
            autocomplete="email"
            required
            v-model="email"
          />
        </div>

        <div class="mb-3">
          <label class="form-label" for="regPassword">
            Пароль <span aria-hidden="true" class="text-danger">*</span>
          </label>
          <PasswordInput
            id="regPassword"
            placeholder="Минимум 6 символов"
            autocomplete="new-password"
            required
            v-model="password"
          />
          <div class="form-text">Минимум 6 символов</div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="regConfirmPassword">
            Повторите пароль <span aria-hidden="true" class="text-danger">*</span>
          </label>
          <PasswordInput
            id="regConfirmPassword"
            placeholder="Повторите пароль"
            autocomplete="new-password"
            required
            v-model="confirmPassword"
          />
        </div>

        <fieldset class="mb-3">
          <legend class="form-label">Я хочу:</legend>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="role"
                id="roleStudent"
                value="student"
                v-model="role"
              />
              <label class="form-check-label" for="roleStudent">Учиться</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="role"
                id="roleTeacher"
                value="teacher"
                v-model="role"
              />
              <label class="form-check-label" for="roleTeacher">Преподавать</label>
            </div>
          </div>
        </fieldset>

        <div class="form-check mb-4">
          <input
            class="form-check-input"
            type="checkbox"
            id="agreeTerms"
            required
            v-model="agreeTerms"
          />
          <label class="form-check-label text-sm" for="agreeTerms">
            Я принимаю
            <a href="#" class="text-decoration-none fw-bold">условия использования</a>
            и
            <a href="#" class="text-decoration-none fw-bold">политику конфиденциальности</a>
          </label>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2">Зарегистрироваться</button>
      </form>

      <p class="text-center mt-4 mb-0 text-sm-2">
        Уже есть аккаунт?
        <router-link :to="{ name: 'login' }" class="fw-bold text-decoration-none">Войдите</router-link>
      </p>
    </div>
  </div>
</template>
