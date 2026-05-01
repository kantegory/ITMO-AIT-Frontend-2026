<template>
  <main class="d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow-sm p-4" style="width: 400px;" role="region" aria-labelledby="login-heading">
        <h1 class="text-center text-primary mb-4 h3">MyFinance</h1>
        <h2 id="login-heading" class="text-center mb-4 h5">Вход в систему</h2>
        
        <div v-if="errorMessage" class="alert alert-danger py-2 text-center" role="alert" aria-live="assertive">
            {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleLogin" aria-label="Форма входа">
            <div class="mb-3">
                <label for="login-email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="login-email" 
                  v-model="email" 
                  autocomplete="email" 
                  required 
                  aria-required="true"
                >
            </div>
            <div class="mb-3">
                <label for="login-password" class="form-label">Пароль</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="login-password" 
                  v-model="password" 
                  autocomplete="current-password" 
                  required 
                  aria-required="true"
                >
            </div>
            <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
                {{ isLoading ? 'Вход...' : 'Войти' }}
            </button>
            <div class="text-center">
                Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
            </div>
        </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { apiFetch } from '../services/api';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const { login } = useAuth();
const router = useRouter();

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        if (!response.ok) {
            errorMessage.value = 'Неверный email или пароль!';
            return;
        }

        const data = await response.json();
        login(data.user, data.accessToken);
        router.push('/dashboard');
    } catch (error) {
        errorMessage.value = 'Ошибка соединения с сервером';
    } finally {
        isLoading.value = false;
    }
};
</script>