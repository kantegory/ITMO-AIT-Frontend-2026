<template>
  <main id="main-content" class="auth-page" tabindex="-1">
    <div class="container">
      <div class="auth-shell auth-shell--single">
        <div class="auth-panel">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span class="section-label">Авторизация</span>
              <h1 class="h3 mb-0 mt-2">Войти</h1>
            </div>
            <RouterLink class="link-accent text-decoration-none small fw-semibold" to="/register">Создать аккаунт</RouterLink>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
import LoginForm from "@/components/auth/LoginForm.vue";
</script>
