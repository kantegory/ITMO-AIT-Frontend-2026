<template>
  <!-- Спрайт всех SVG-иконок -->
  <AppSvgSprite />

  <div class="d-flex flex-column min-vh-100">
    <TheHeader
      @open-login="openLogin"
      @open-register="openRegister"
      @logout="handleLogout"
    />

    <main class="flex-grow-1">
      <router-view />
    </main>

    <TheFooter />
  </div>

  <!-- Модальные окна -->
  <LoginModal v-model="showLogin" @switch-to-register="switchToRegister" />
  <RegisterModal v-model="showRegister" @switch-to-login="switchToLogin" />

  <!-- Контейнер для уведомлений -->
  <ToastContainer />
</template>

<script setup>
import { ref } from 'vue'
import AppSvgSprite from '@/components/common/AppSvgSprite.vue'
import TheHeader from '@/components/common/TheHeader.vue'
import TheFooter from '@/components/common/TheFooter.vue'
import LoginModal from '@/components/common/LoginModal.vue'
import RegisterModal from '@/components/common/RegisterModal.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

// Управление модальными окнами
const showLogin = ref(false)
const showRegister = ref(false)

function openLogin() {
  showRegister.value = false
  showLogin.value = true
}
function openRegister() {
  showLogin.value = false
  showRegister.value = true
}
function closeModals() {
  showLogin.value = false
  showRegister.value = false
}
function switchToRegister() {
  closeModals()
  setTimeout(() => showRegister.value = true, 150)
}
function switchToLogin() {
  closeModals()
  setTimeout(() => showLogin.value = true, 150)
}
function handleLogout() {
  logout()
  closeModals()
}
</script>
