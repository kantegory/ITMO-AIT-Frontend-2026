<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";
import { useToast } from "@/composables/useToast.js";

const router = useRouter();
const { register } = useAuth();
const toast = useToast();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
    error.value = "";
    if (password.value !== confirmPassword.value) {
        error.value = "Пароли не совпадают";
        return;
    }
    if (password.value.length < 4) {
        error.value = "Пароль слишком короткий (минимум 4 символа)";
        return;
    }
    loading.value = true;
    try {
        await register(username.value, email.value, password.value);
        toast.success("Аккаунт создан, добро пожаловать!");
        router.push({ name: "dashboard" });
    } catch (e) {
        error.value = e.response?.data || "Не удалось зарегистрироваться. Возможно, email уже занят.";
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="container mt-5" style="max-width: 480px">
        <h1 class="mb-4">Регистрация</h1>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <form @submit.prevent="onSubmit" novalidate>
            <div class="mb-3">
                <label for="username" class="form-label">Имя пользователя</label>
                <input
                    id="username"
                    v-model="username"
                    type="text"
                    class="form-control"
                    required
                    autocomplete="username"
                />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control"
                    required
                    autocomplete="email"
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    required
                    autocomplete="new-password"
                />
            </div>
            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
                <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    class="form-control"
                    required
                    autocomplete="new-password"
                />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? "Создаём..." : "Создать аккаунт" }}
            </button>
        </form>
        <p class="mt-3 mb-0">
            Уже есть аккаунт?
            <RouterLink :to="{ name: 'login' }">Войти</RouterLink>
        </p>
    </div>
</template>
