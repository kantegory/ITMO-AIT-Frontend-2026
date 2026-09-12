<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import useAuthForm from '@/composables/useAuthForm'

const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const passwordConfirmInput = ref(null)

const { error, submit } = useAuthForm('registerModal', {
  request: auth.register,
  rejectedMessage: 'Ошибка регистрации. Email уже занят?',
})

function handleSubmit() {
  if (form.password !== form.passwordConfirm) {
    passwordConfirmInput.value.setCustomValidity('Пароли не совпадают')
    passwordConfirmInput.value.reportValidity()
    return
  }

  const { passwordConfirm, ...data } = form
  submit(data)
}
</script>

<template>
  <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="registerModalLabel">Регистрация</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="registerName" class="form-label">Имя</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                id="registerName"
                name="name"
                required
                autocomplete="name"
              />
            </div>
            <div class="mb-3">
              <label for="registerEmail" class="form-label">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                id="registerEmail"
                name="email"
                required
                autocomplete="email"
              />
            </div>
            <div class="mb-3">
              <label for="registerPassword" class="form-label">Пароль</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                id="registerPassword"
                name="password"
                required
                autocomplete="new-password"
                minlength="6"
              />
            </div>
            <div class="mb-3">
              <label for="registerPasswordConfirm" class="form-label">Подтвердите пароль</label>
              <input
                ref="passwordConfirmInput"
                v-model="form.passwordConfirm"
                type="password"
                class="form-control"
                id="registerPasswordConfirm"
                name="passwordConfirm"
                required
                autocomplete="new-password"
                minlength="6"
                @input="passwordConfirmInput.setCustomValidity('')"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <span class="text-muted">Уже есть аккаунт?</span>
          <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#loginModal">
            Войти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
