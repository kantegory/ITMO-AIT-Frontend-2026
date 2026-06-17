<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { login } = useAuth()

async function handleSubmit() {
    error.value = ''
    try {
        await login(email.value, password.value)
        router.push('/dashboard')
    } catch {
        error.value = 'Неверные email или пароль'
    }
}
</script>

<template>
    <div class="container">
        <section class="card auth">
            <h2>Вход</h2>
            <form @submit.prevent="handleSubmit">
                <label>Email
                    <input v-model="email" type="email" required class="input" />
                </label>
                <label>Пароль
                    <input v-model="password" type="password" required class="input" />
                </label>
                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit" class="btn">Войти</button>
            </form>
            <p>Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink></p>
        </section>
    </div>
</template>

<style scoped>
.auth { 
    max-width: 400px; 
    margin: 3rem auto; 
}
form { 
    display: flex; 
    flex-direction: 
    column; gap: 1rem; 
}
.error { 
    color: #ef4444; 
}
</style>