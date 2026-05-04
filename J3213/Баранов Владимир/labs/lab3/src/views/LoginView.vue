<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";
import { useToast } from "@/composables/useToast.js";

const router = useRouter();
const route = useRoute();
const { login } = useAuth();
const toast = useToast();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
    error.value = "";
    loading.value = true;
    try {
        const user = await login(email.value, password.value);
        toast.success(`Добро пожаловать, ${user?.username || user?.email || "пользователь"}!`);
        router.push(route.query.redirect || { name: "dashboard" });
    } catch (e) {
        error.value = e.response?.data || "Не удалось войти. Проверьте email и пароль.";
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="container mt-5" style="max-width: 480px">
        <h1 class="mb-4">Вход</h1>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <form @submit.prevent="onSubmit" novalidate>
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
                    autocomplete="current-password"
                />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? "Входим..." : "Войти" }}
            </button>
        </form>
        <p class="mt-3 mb-0">
            Нет аккаунта?
            <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink>
        </p>
    </div>
</template>
