<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const error = ref('')
const router = useRouter()
const { register } = useAuth()

const passwordsMatch = computed(
    () => !passwordRepeat.value || password.value === passwordRepeat.value
)

async function handleSubmit() {
    if (!passwordsMatch.value) {
        error.value = 'Пароли не совпадают'
        return
    }
    try {
        await register({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
        })
        router.push('/dashboard')
    } catch {
        error.value = 'Не удалось зарегистрироваться'
    }
}
</script>

<template>
    <div class="container">
        <section class="card auth">
            <h2>Регистрация</h2>
            <form @submit.prevent="handleSubmit">
                <label>Имя <input v-model="firstName" required class="input" /></label>
                <label>Фамилия <input v-model="lastName" required class="input" /></label>
                <label>Email <input v-model="email" type="email" required class="input" /></label>
                <label>Пароль <input v-model="password" type="password" required class="input" /></label>
                <label>Повторите пароль <input v-model="passwordRepeat" type="password" required class="input" /></label>
                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit" class="btn">Создать аккаунт</button>
            </form>
            <p>Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink></p>
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