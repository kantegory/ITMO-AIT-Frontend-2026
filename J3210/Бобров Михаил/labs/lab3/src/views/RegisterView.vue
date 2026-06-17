<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "../components/AuthLayout.vue";
import { useSession } from "../composables/useSession.js";

const router = useRouter();
const { register } = useSession();
const name = ref("");
const email = ref("");
const password = ref("");
const repeatPassword = ref("");
const error = ref("");

async function submit() {
    error.value = "";
    if (password.value !== repeatPassword.value) {
        error.value = "Пароли не совпадают";
        return;
    }
    try {
        await register(name.value.trim(), email.value.trim(), password.value);
        router.push("/dashboard");
    } catch (reason) {
        error.value = reason.message.includes("существует") ? reason.message : "Не удалось подключиться к API";
    }
}
</script>

<template>
    <AuthLayout>
        <form aria-labelledby="registerTitle" @submit.prevent="submit">
            <h4 class="mb-3 fw-semibold" id="registerTitle">Регистрация</h4>
            <div v-if="error" class="alert alert-danger py-2" role="alert">{{ error }}</div>
            <div class="mb-3">
                <label class="form-label" for="registerName">Имя</label>
                <input v-model="name" type="text" class="form-control" id="registerName" autocomplete="name" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="registerEmail">Email</label>
                <input v-model="email" type="email" class="form-control" id="registerEmail" autocomplete="email" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="registerPassword">Пароль</label>
                <input v-model="password" type="password" class="form-control" id="registerPassword" autocomplete="new-password" required>
            </div>
            <div class="mb-3">
                <label class="form-label" for="registerPasswordRepeat">Повтор пароля</label>
                <input v-model="repeatPassword" type="password" class="form-control" id="registerPasswordRepeat" autocomplete="new-password" required>
            </div>
            <button class="btn btn-success w-100" type="submit">Создать аккаунт</button>
        </form>
    </AuthLayout>
</template>
