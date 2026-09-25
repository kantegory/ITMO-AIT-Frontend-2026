<template>
  <div>
    <GuestNavbar :showLogin="false" />
    <main class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="text-center mb-4">
            <h1 class="h3 fw-bold mb-2">Создать аккаунт</h1>
            <p class="text-muted">Начните размечать данные и управлять ML-проектами</p>
          </div>
          <div class="card border-0">
            <div class="card-body p-4">
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label">Полное имя</label>
                  <input v-model="name" type="text" class="form-control" placeholder="Иван Иванов" required autocomplete="name">
                </div>
                <div class="mb-3">
                  <label class="form-label">Рабочая почта</label>
                  <input v-model="email" type="email" class="form-control" placeholder="name@company.com" required autocomplete="email">
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Пароль</label>
                    <input v-model="password" type="password" class="form-control" placeholder="........" required autocomplete="new-password">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Повторите пароль</label>
                    <input v-model="confirmPassword" type="password" class="form-control" placeholder="........" required autocomplete="new-password">
                  </div>
                </div>
                <div class="mb-2">
                  <small v-if="passwordError" class="text-danger fw-medium d-block mb-1">
                    Введенные пароли не совпадают. Попробуйте еще раз.
                  </small>
                  <small v-if="emailError" class="text-danger fw-medium d-block mb-1">
                    Пользователь с таким email уже существует.
                  </small>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 mt-2">
                  Зарегистрироваться
                </button>
                <div class="text-center mt-3">
                  <small class="text-muted">Нажимая кнопку, вы соглашаетесь с условиями использования.</small>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center mt-4">
            <p class="text-muted small">
              Уже есть аккаунт? <router-link to="/login" class="text-decoration-none fw-semibold" style="color: var(--lf-primary);">Войти в систему</router-link>
            </p>
          </div>
        </div>
      </div>
    </main>
    <div class="modal fade" ref="regModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: var(--lf-radius-lg);">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">Аккаунт успешно создан</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-muted">
            Ваше рабочее пространство готово. Теперь вы можете войти в систему.
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-primary w-100" @click="goToLogin">Перейти ко входу</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import GuestNavbar from '../components/GuestNavbar.vue'
import * as bootstrap from 'bootstrap'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref(false)
const emailError = ref(false)

const regModal = ref(null)
let modalInstance = null

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  modalInstance = new bootstrap.Modal(regModal.value)
  regModal.value.addEventListener('hidden.bs.modal', () => router.push('/login'))
})

watch(confirmPassword, () => {
  passwordError.value = false
})

const handleRegister = async () => {
  passwordError.value = false
  emailError.value = false

  if (password.value !== confirmPassword.value) {
    passwordError.value = true
    return
  }

  const res = await authStore.register(name.value, email.value, password.value)
  if (res.success) {
    modalInstance.show()
  } else if (res.reason === 'exists') {
    emailError.value = true
  }
}

const goToLogin = () => {
  modalInstance.hide()
}
</script>