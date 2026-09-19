<template>
  <main id="main-content" role="main" class="container py-4 py-lg-5" tabindex="-1">
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-5 fade-up">
        <section class="hero p-4 p-lg-5 h-100">
          <span class="badge badge-soft rounded-pill mb-3">Onboarding</span>
          <h1 class="display-6 fw-bold mb-3">Регистрация нового участника</h1>
          <p class="text-secondary mb-4">
            После регистрации аккаунт сохраняется в моковом API и сразу становится доступен для входа и работы с проектами.
          </p>
          <ul class="list-unstyled text-secondary mb-0">
            <li class="mb-2">• Выбор роли: исполнитель, валидатор или менеджер.</li>
            <li class="mb-2">• Настройка уровня опыта и доступа к задачам.</li>
            <li>• Создание локальной сессии после успешной авторизации.</li>
          </ul>
        </section>
      </div>

      <div class="col-lg-7 fade-up fade-up-delay">
        <section class="form-card p-4 p-lg-5">
          <h2 class="h3 mb-4">Регистрация</h2>
          <div v-if="alertMessage" class="alert alert-danger" role="status" aria-live="polite">
            {{ alertMessage }}
          </div>
          <form id="register-form" class="needs-validation" :class="{ 'was-validated': validated }" novalidate @submit.prevent="handleRegister">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="firstName">Имя</label>
                <input id="firstName" v-model="form.firstName" type="text" class="form-control" required aria-required="true" autocomplete="given-name" aria-describedby="reg-firstName-feedback" />
                <div id="reg-firstName-feedback" class="invalid-feedback">Укажите имя.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="lastName">Фамилия</label>
                <input id="lastName" v-model="form.lastName" type="text" class="form-control" required aria-required="true" autocomplete="family-name" aria-describedby="reg-lastName-feedback" />
                <div id="reg-lastName-feedback" class="invalid-feedback">Укажите фамилию.</div>
              </div>
              <div class="col-12">
                <label class="form-label" for="regEmail">Email</label>
                <input id="regEmail" v-model="form.email" type="email" class="form-control" required aria-required="true" autocomplete="email" aria-describedby="reg-email-feedback" />
                <div id="reg-email-feedback" class="invalid-feedback">Введите корректный email.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="role">Роль</label>
                <select id="role" v-model="form.role" class="form-select" required aria-required="true" aria-describedby="reg-role-feedback">
                  <option value="" disabled>Выберите роль</option>
                  <option>Исполнитель</option>
                  <option>Валидатор</option>
                  <option>Менеджер</option>
                </select>
                <div id="reg-role-feedback" class="invalid-feedback">Выберите роль.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="experience">Опыт</label>
                <select id="experience" v-model="form.experience" class="form-select" required aria-required="true" aria-describedby="reg-exp-feedback">
                  <option value="" disabled>Выберите уровень</option>
                  <option>Junior</option>
                  <option>Middle</option>
                  <option>Senior</option>
                </select>
                <div id="reg-exp-feedback" class="invalid-feedback">Выберите уровень.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regPassword">Пароль</label>
                <input id="regPassword" v-model="form.password" type="password" class="form-control" minlength="8" required aria-required="true" autocomplete="new-password" aria-describedby="reg-pass-feedback" />
                <div id="reg-pass-feedback" class="invalid-feedback">Пароль должен быть от 8 символов.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="regPassword2">Повтор пароля</label>
                <input id="regPassword2" v-model="form.password2" type="password" class="form-control" minlength="8" required aria-required="true" autocomplete="new-password" aria-describedby="reg-pass2-feedback" />
                <div id="reg-pass2-feedback" class="invalid-feedback">{{ passwordMismatch ? 'Пароли не совпадают.' : 'Повторите пароль.' }}</div>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input id="policyCheck" v-model="form.policy" type="checkbox" class="form-check-input" required aria-required="true" aria-describedby="reg-policy-feedback" />
                  <label class="form-check-label" for="policyCheck">Согласен с правилами платформы и политикой обработки данных</label>
                  <div id="reg-policy-feedback" class="invalid-feedback">Необходимо принять условия.</div>
                </div>
              </div>
            </div>
            <button
              id="register-submit"
              class="btn btn-brand mt-4 px-4"
              type="submit"
              :disabled="loading"
              :aria-busy="loading ? 'true' : 'false'"
            >
              {{ loading ? 'Создаём аккаунт...' : 'Зарегистрироваться' }}
            </button>
          </form>
        </section>
      </div>
    </div>
  </main>

  <div class="modal fade" id="registerSuccessModal" tabindex="-1" aria-labelledby="registerSuccessTitle" aria-describedby="register-success-text" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="registerSuccessTitle" class="modal-title fs-5">Аккаунт создан</h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть" tabindex="-1"></button>
        </div>
        <div id="register-success-text" class="modal-body">{{ successText }}</div>
        <div class="modal-footer">
          <RouterLink class="btn btn-brand" to="/dashboard" tabindex="-1">Перейти в кабинет</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'

const router = useRouter()
const { setSession } = useAuth()
const { get, post } = useApi()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  experience: '',
  password: '',
  password2: '',
  policy: false,
})

const loading = ref(false)
const validated = ref(false)
const alertMessage = ref('')
const successText = ref('Регистрация прошла успешно. Теперь можно перейти в личный кабинет и выбрать проекты.')

const passwordMismatch = computed(
  () => form.value.password2 && form.value.password !== form.value.password2
)

async function handleRegister() {
  validated.value = true
  alertMessage.value = ''

  if (passwordMismatch.value) {
    alertMessage.value = 'Пароли не совпадают.'
    return
  }

  const formEl = document.getElementById('register-form')
  if (!formEl.checkValidity()) return

  loading.value = true
  try {
    const existing = await get('/users', { email: form.value.email.trim().toLowerCase() })
    if (existing.length > 0) {
      throw new Error('Пользователь с таким email уже зарегистрирован.')
    }

    const payload = {
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
      role: form.value.role,
      experience: form.value.experience,
    }

    const created = await post('/users', payload)
    setSession(created)
    successText.value = `Аккаунт ${created.firstName} ${created.lastName} создан и сохранён в API.`
    Modal.getOrCreateInstance(document.getElementById('registerSuccessModal')).show()
    setTimeout(() => router.push('/dashboard'), 900)
  } catch (error) {
    alertMessage.value = error.message || 'Не удалось зарегистрировать пользователя.'
  } finally {
    loading.value = false
  }
}
</script>
