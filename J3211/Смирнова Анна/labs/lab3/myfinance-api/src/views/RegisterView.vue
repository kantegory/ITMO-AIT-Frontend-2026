<template>
  <main class="d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow-sm p-4" style="width: 400px;" role="region" aria-labelledby="register-heading">
        <h1 class="text-center text-primary mb-4 h3">MyFinance</h1>
        <h2 id="register-heading" class="text-center mb-4 h5">Создание аккаунта</h2>
        
        <div v-if="errorMessage" class="alert alert-danger py-2 text-center" role="alert" aria-live="assertive">
            {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleRegister" aria-label="Форма регистрации">
            <div class="mb-3">
                <label for="reg-name" class="form-label">Ваше Имя</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="reg-name" 
                  v-model="firstName" 
                  autocomplete="name" 
                  required 
                  aria-required="true"
                >
            </div>
            <div class="mb-3">
                <label for="reg-email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="reg-email" 
                  v-model="email" 
                  autocomplete="email" 
                  required 
                  aria-required="true"
                >
            </div>
            <div class="mb-3">
                <label for="reg-password" class="form-label">Пароль</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="reg-password" 
                  v-model="password" 
                  autocomplete="new-password" 
                  required 
                  aria-required="true"
                >
            </div>
            <button type="submit" class="btn btn-success w-100 mb-3" :disabled="isLoading">
                {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
            <div class="text-center">
                Уже есть аккаунт? <router-link to="/login">Войти</router-link>
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

const firstName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const { login } = useAuth();
const router = useRouter();

const createDefaultCategories = async (userId) => {
    const defaults = [
        { name: 'Продукты', type: 'expense', userId },
        { name: 'Зарплата', type: 'income', userId }
    ];
    for (const cat of defaults) {
        await apiFetch('/categories', { method: 'POST', body: JSON.stringify(cat) });
    }
};

const handleRegister = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email.value, 
                password: password.value, 
                firstName: firstName.value 
            })
        });

        if (!response.ok) {
            const err = await response.json();
            errorMessage.value = err === 'Email already exists' ? 'Email уже занят' : err;
            return;
        }

        const data = await response.json();
        login(data.user, data.accessToken);
        await createDefaultCategories(data.user.id);
        router.push('/dashboard');
    } catch (error) {
        errorMessage.value = 'Ошибка соединения с сервером';
    } finally {
        isLoading.value = false;
    }
};
</script>