<script setup>
import { ref } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { findUserByEmail } from '@/api/finance'
import { useModalFeedback } from '@/composables/useModalFeedback'

const { showError, showInfo, showInfoAndRedirect } = useModalFeedback()
const email = ref('')

async function forgotPassword() {
  try {
    const user = await findUserByEmail(email.value)

    if (!user) {
      showInfo('Ошибка', 'Аккаунт с таким email не найден.')
      return
    }

    showInfoAndRedirect('Письмо отправлено', 'Инструкции по восстановлению пароля отправлены на email.', 'login')
  } catch (error) {
    showError(error)
  }
}
</script>

<template>
  <BaseLayout>
    <main class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 id="forgot-form-title" class="card-title text-center mb-4">Восстановление пароля</h2>
              <p class="mb-4">Введите ваш email, чтобы узнать инструкции по восстановлению пароля.</p>
              <form aria-labelledby="forgot-form-title" @submit.prevent="forgotPassword">
                <div class="mb-3">
                  <label for="email" class="form-label">Email адрес</label>
                  <input id="email" v-model="email" type="email" class="form-control" autocomplete="email" required />
                </div>
                <div class="d-grid gap-4">
                  <button type="submit" class="btn btn-primary btn-custom">Отправить</button>
                </div>
              </form>
              <div class="d-grid gap-3 mt-3">
                <RouterLink :to="{ name: 'login' }" class="btn btn-outline-secondary btn-custom">Вход</RouterLink>
                <RouterLink :to="{ name: 'register' }" class="btn btn-outline-secondary btn-custom">Регистрация</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
