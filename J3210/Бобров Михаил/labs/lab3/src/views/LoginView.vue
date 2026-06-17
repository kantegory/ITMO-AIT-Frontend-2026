<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "../components/AuthLayout.vue";
import { useSession } from "../composables/useSession.js";

const router = useRouter();
const { login } = useSession();
const email = ref("demo@dataport.ai");
const password = ref("demo");
const error = ref("");

async function submit() {
    error.value = "";
    try {
        await login(email.value.trim(), password.value);
        router.push("/dashboard");
    } catch (reason) {
        error.value = reason.message === "Неверный email или пароль" ? reason.message : "Не удалось подключиться к API";
    }
}
</script>

<template>
    <AuthLayout>
        <form aria-labelledby="loginTitle" @submit.prevent="submit">
            <h4 class="mb-3 fw-semibold" id="loginTitle">Вход</h4>
            <div v-if="error" class="alert alert-danger py-2" role="alert">{{ error }}</div>
            <div class="mb-3">
                <label class="form-label" for="loginEmail">Email</label>
                <input v-model="email" type="email" class="form-control" id="loginEmail" autocomplete="email" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="loginPassword">Пароль</label>
                <input v-model="password" type="password" class="form-control" id="loginPassword" autocomplete="current-password" required>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="rememberMe">
                    <label class="form-check-label" for="rememberMe">Запомнить</label>
                </div>
                <a href="#" @click.prevent>Забыли пароль?</a>
            </div>
            <button class="btn btn-primary w-100" type="submit">Войти</button>
        </form>
    </AuthLayout>
</template>
