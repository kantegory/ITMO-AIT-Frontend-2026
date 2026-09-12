<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import useAuthForm from '@/composables/useAuthForm'
import useModal from '@/composables/useModal'

const route = useRoute()
const auth = useAuthStore()
const modal = useModal('loginModal')

const form = reactive({
  email: '',
  password: '',
})

const { error, submit } = useAuthForm('loginModal', {
  request: auth.login,
  rejectedMessage: 'Неверный email или пароль',
})

const showIfRedirected = () => {
  if (route.query.redirect && !auth.isAuthenticated) {
    modal.show()
  }
}

onMounted(showIfRedirected)
watch(() => route.query.redirect, showIfRedirected)
</script>

<template>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="loginModalLabel">Вход</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="submit({ ...form })">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                id="loginEmail"
                name="email"
                required
                autocomplete="email"
              />
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Пароль</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                id="loginPassword"
                name="password"
                required
                autocomplete="current-password"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Войти</button>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <span class="text-muted">Нет аккаунта?</span>
          <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#registerModal">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
