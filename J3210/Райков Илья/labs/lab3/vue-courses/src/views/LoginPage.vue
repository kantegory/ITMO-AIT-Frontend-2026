<template>
    <main class="auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div class="card shadow-lg auth-card border-0">
            <div class="card-body p-5">
                <div class="text-center mb-4">
                    <router-link to="/" class="logo-link h4 fw-bold d-block mb-3">
                        <svg-icon name="mortarboard-fill" class="text-warning" /> EduPlatform
                    </router-link>
                    <h2 class="fw-bold">С возвращением!</h2>
                    <p class="text-muted">Войдите, чтобы продолжить обучение</p>
                </div>

                <form @submit.prevent="handleLogin" :class="{ 'was-validated': submitted }" novalidate>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" v-model="email" placeholder="email" required @input="error = ''">
                        <label>Email адрес</label>
                    </div>

                    <div class="form-floating mb-4">
                        <input type="password" class="form-control" v-model="password" placeholder="Пароль" required @input="error = ''">
                        <label>Пароль</label>
                        <div class="invalid-feedback d-block" v-if="error">{{ error }}</div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-3 fw-bold" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                        <span v-else>Войти</span>
                    </button>
                </form>

                <div class="text-center mt-4">
                    <p class="mb-0 text-muted">Нет аккаунта? <router-link to="/register" class="fw-bold">Зарегистрироваться</router-link></p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SvgIcon from '@/components/SvgIcon.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('')
const submitted = ref(false);

const handleLogin = async () => {
    submitted.value = true;
    if (!email.value || !password.value) return;

    loading.value = true;
    error.value = '';

    try {
        await authStore.login(email.value, password.value);
        router.push('/dashboard');
    } catch (err) {
        error.value = "Неверный email или пароль";
    } finally {
        loading.value = false;
    }
};
</script>