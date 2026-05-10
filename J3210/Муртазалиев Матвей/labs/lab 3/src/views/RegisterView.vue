<template>
  <main id="main-content" class="auth-page" tabindex="-1">
    <div class="container">
      <div class="auth-shell auth-shell--single">
        <div class="auth-panel">
          <span class="section-label">Регистрация</span>
          <h1 class="section-title mt-3">Создать аккаунт</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import RegisterForm from "@/components/auth/RegisterForm.vue";
</script>

