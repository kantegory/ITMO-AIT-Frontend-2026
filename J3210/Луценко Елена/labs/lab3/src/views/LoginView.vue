<script setup>
import {ref} from 'vue'
import axios from 'axios'

import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'

const authStore = useAuthStore()
const { redirectByUserRole } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    if (!email.value || !password.value) {
        alert("Заполните все поля")
        return
    }

    try {
        const res = await axios.post('http://localhost:3000/login', {
            email: email.value,
            password: password.value
        })

        if (res.status === 200) {
            authStore.setAuth(res.data.user, res.data.accessToken)
            redirectByUserRole(res.data.user)
        }
    } catch (e) {
        alert("Ошибка! Неверный email или пароль")
    }
}
</script>

<template>
    <AuthLayout>
        <main class="container">
            <div class="row justify-content-center">
                <div class="col-sm-10 col-md-6 col-lg-4">
                    <div class="card p-5 login-card">
                        <h1 class="text-center mb-4 fw-bold h3">Вход</h1>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label small">Email</label>
                                <input
                                    v-model="email"
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    placeholder="ivan@test.ru"
                                    required
                                >
                            </div>

                            <div class="mb-3">
                                <label for="pass" class="form-label small">Пароль</label>
                                <input
                                    v-model="password"
                                    type="password"
                                    class="form-control"
                                    id="pass"
                                >
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Войти в систему
                            </button>
                        </form>

                        <div class="text-center mt-4">
                            <p class="small mb-1">
                                Нет аккаунта?
                                <router-link to="/register" class="text-decoration-none">
                                    Регистрация
                                </router-link>
                            </p>
                            <router-link to="/"
                                         class="text-muted text-decoration-none mt-2 d-inline-block small">
                                Вернуться в каталог
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </AuthLayout>
</template>
