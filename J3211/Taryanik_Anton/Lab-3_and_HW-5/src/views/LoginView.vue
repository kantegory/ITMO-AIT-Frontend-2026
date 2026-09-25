<template>
  <div>
    <GuestNavbar :showLogin="false" />
    <main class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="text-center mb-4">
            <h1 class="h3 fw-bold mb-2">С возвращением</h1>
            <p class="text-muted">Войдите в свой аккаунт для продолжения работы над ML-проектами</p>
          </div>
          <div class="card border-0">
            <div class="card-body p-4">
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Email рабочая почта</label>
                  <input v-model="email" type="email" class="form-control" placeholder="name@company.com" required autocomplete="email">
                </div>
                <div class="mb-4">
                  <div class="d-flex justify-content-between">
                    <label class="form-label">Пароль</label>
                    <a href="#" class="text-decoration-none small" style="color: var(--lf-primary);">Забыли пароль?</a>
                  </div>
                  <input v-model="password" type="password" class="form-control" placeholder="........" required autocomplete="current-password">
                </div>
                <small v-if="hasError" class="text-danger fw-medium mb-3 d-block">
                  Неверный email или пароль.
                </small>
                <button type="submit" class="btn btn-primary w-100 py-2">
                  Войти в платформу
                </button>
              </form>
            </div>
          </div>
          <div class="text-center mt-4">
            <p class="text-muted small">
              Нет аккаунта? <router-link to="/registration" class="text-decoration-none fw-semibold" style="color: var(--lf-primary);">Создать рабочее пространство</router-link>
            </p>
          </div>
        </div>
      </div>
    </main>
    <div class="modal fade" ref="authModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: var(--lf-radius-lg);">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">Авторизация успешна</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-muted">
            Добро пожаловать в LabelFlow. Сейчас вы будете перенаправлены в панель управления проектами.
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-primary w-100" @click="goToDashboard">Перейти в Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import GuestNavbar from '../components/GuestNavbar.vue'
import * as bootstrap from 'bootstrap'

const email = ref('')
const password = ref('')
const hasError = ref(false)
const authModal = ref(null)
let modalInstance = null

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  modalInstance = new bootstrap.Modal(authModal.value)
  authModal.value.addEventListener('hidden.bs.modal', goToDashboard)
})

const handleLogin = async () => {
  hasError.value = false
  const success = await authStore.login(email.value, password.value)
  if (success) {
    modalInstance.show()
  } else {
    hasError.value = true
  }
}

const goToDashboard = () => {
  modalInstance.hide()
  router.push('/dashboard')
}
</script>