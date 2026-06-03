<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, getCabinetRouteForUser, loadCurrentUser, login, register, rememberMeEnabled } = useAuth()

const activeTab = ref('login')
const message = ref('')
const messageType = ref('success')
const isSubmitting = ref(false)
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const loginValidated = ref(false)
const registerValidated = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: rememberMeEnabled(),
})

const registerForm = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  accountType: 'buyer',
})

onMounted(async () => {
  const user = currentUser.value || (await loadCurrentUser())
  if (user) {
    router.replace(getCabinetRouteForUser(user))
  }
})

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
}

async function handleLogin(event) {
  loginValidated.value = true
  if (!event.currentTarget.checkValidity()) {
    return
  }

  isSubmitting.value = true

  try {
    const user = await login(loginForm.email.trim().toLowerCase(), loginForm.password, loginForm.rememberMe)
    showMessage('Вход выполнен успешно. Переходим в личный кабинет...', 'success')
    router.push(getCabinetRouteForUser(user))
  } catch (error) {
    showMessage(error?.response?.data?.message || 'Не получилось войти. Попробуйте позже.', 'danger')
  } finally {
    isSubmitting.value = false
  }
}

async function handleRegister(event) {
  registerValidated.value = true
  if (!event.currentTarget.checkValidity()) {
    return
  }

  if (registerForm.password !== registerForm.passwordConfirm) {
    showMessage('Пароли должны совпадать.', 'danger')
    return
  }

  isSubmitting.value = true

  try {
    const user = await register({
      name: registerForm.name.trim(),
      email: registerForm.email.trim().toLowerCase(),
      phone: registerForm.phone.trim(),
      password: registerForm.password,
      accountType: registerForm.accountType,
    })

    showMessage('Регистрация успешна. Переходим в личный кабинет...', 'success')
    router.push(getCabinetRouteForUser(user))
  } catch (error) {
    showMessage(error?.response?.data?.message || 'Не удалось зарегистрироваться. Попробуйте позже.', 'danger')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="auth-page py-5">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-md-10 col-lg-8 col-xl-6">
          <section class="auth-card shadow-lg">
            <div class="auth-header text-center position-relative">
              <div class="position-absolute top-0 end-0 p-3">
                <ThemeToggle />
              </div>
              <h1 class="h3 mb-1">EventPass</h1>
              <p class="mb-0 text-secondary">Платформа покупки билетов на мероприятия</p>
            </div>

            <div class="auth-switch p-3 p-sm-4 pb-0">
              <div class="btn-group w-100" role="group" aria-label="Переключение форм">
                <button
                  type="button"
                  class="btn"
                  :class="activeTab === 'login' ? 'btn-primary active' : 'btn-outline-primary'"
                  @click="activeTab = 'login'; message = ''"
                >
                  Вход
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="activeTab === 'register' ? 'btn-primary active' : 'btn-outline-primary'"
                  @click="activeTab = 'register'; message = ''"
                >
                  Регистрация
                </button>
              </div>
            </div>

            <div class="p-3 p-sm-4">
              <div v-if="message" class="mb-3">
                <div class="alert py-2 mb-0" :class="`alert-${messageType}`" role="alert">{{ message }}</div>
              </div>

              <form
                v-if="activeTab === 'login'"
                class="needs-validation"
                :class="{ 'was-validated': loginValidated }"
                novalidate
                @submit.prevent="handleLogin"
              >
                <div class="mb-3">
                  <label for="loginEmail" class="form-label">Email</label>
                  <input id="loginEmail" v-model="loginForm.email" type="email" class="form-control" placeholder="you@example.com" required />
                  <div class="invalid-feedback">Введите корректный email.</div>
                </div>

                <div class="mb-3">
                  <label for="loginPassword" class="form-label">Пароль</label>
                  <div class="input-group">
                    <input id="loginPassword" v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" class="form-control" required />
                    <button class="btn btn-outline-secondary toggle-password" type="button" @click="showLoginPassword = !showLoginPassword">
                      {{ showLoginPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                    <div class="invalid-feedback">Введите пароль.</div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
                  <div class="form-check m-0">
                    <input id="rememberMe" v-model="loginForm.rememberMe" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="rememberMe">Запомнить меня</label>
                  </div>
                  <button type="button" class="btn btn-link p-0">Забыли пароль?</button>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">Войти</button>
              </form>

              <form
                v-else
                class="needs-validation"
                :class="{ 'was-validated': registerValidated }"
                novalidate
                @submit.prevent="handleRegister"
              >
                <div class="mb-3">
                  <label for="registerName" class="form-label">Имя и фамилия</label>
                  <input id="registerName" v-model="registerForm.name" type="text" class="form-control" required minlength="2" />
                  <div class="invalid-feedback">Введите имя (минимум 2 символа).</div>
                </div>

                <div class="mb-3">
                  <label for="registerEmail" class="form-label">Email</label>
                  <input id="registerEmail" v-model="registerForm.email" type="email" class="form-control" required />
                  <div class="invalid-feedback">Введите корректный email.</div>
                </div>

                <div class="mb-3">
                  <label for="registerPhone" class="form-label">Телефон</label>
                  <input id="registerPhone" v-model="registerForm.phone" type="tel" class="form-control" placeholder="+7 (999) 000-00-00" required />
                  <div class="invalid-feedback">Введите номер телефона.</div>
                </div>

                <div class="row g-3">
                  <div class="col-sm-6">
                    <label for="registerPassword" class="form-label">Пароль</label>
                    <div class="input-group">
                      <input
                        id="registerPassword"
                        v-model="registerForm.password"
                        :type="showRegisterPassword ? 'text' : 'password'"
                        class="form-control"
                        required
                      />
                      <button class="btn btn-outline-secondary toggle-password" type="button" @click="showRegisterPassword = !showRegisterPassword">
                        {{ showRegisterPassword ? 'Скрыть' : 'Показать' }}
                      </button>
                      <div class="invalid-feedback">Введите пароль.</div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <label for="registerPasswordConfirm" class="form-label">Повтор пароля</label>
                    <input
                      id="registerPasswordConfirm"
                      v-model="registerForm.passwordConfirm"
                      type="password"
                      class="form-control"
                      required
                      :class="{ 'is-invalid': registerValidated && registerForm.password !== registerForm.passwordConfirm }"
                    />
                    <div class="invalid-feedback">Пароли должны совпадать.</div>
                  </div>
                </div>

                <fieldset class="mt-3">
                  <legend class="fs-6 mb-2">Тип аккаунта</legend>
                  <div class="d-flex flex-wrap gap-3">
                    <div class="form-check">
                      <input id="buyerType" v-model="registerForm.accountType" class="form-check-input" type="radio" value="buyer" />
                      <label class="form-check-label" for="buyerType">Покупатель</label>
                    </div>
                    <div class="form-check">
                      <input id="organizerType" v-model="registerForm.accountType" class="form-check-input" type="radio" value="organizer" />
                      <label class="form-check-label" for="organizerType">Организатор</label>
                    </div>
                  </div>
                </fieldset>

                <button type="submit" class="btn btn-primary w-100 mt-4" :disabled="isSubmitting">Создать аккаунт</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
