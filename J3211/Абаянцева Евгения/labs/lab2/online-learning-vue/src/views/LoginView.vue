<template>
    <div class="auth-container">
        <div class="card auth-card">
            <div class="auth-header">
                <h3>С возвращением!</h3>
                <p class="mb-0 opacity-75">Войдите в свой аккаунт</p>
            </div>
            <div class="card-body p-4">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<script setup>
import LoginForm from '../components/auth/LoginForm.vue';
</script>