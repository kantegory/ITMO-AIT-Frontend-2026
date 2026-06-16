<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { login } = useAuth();

const email = ref('manager@datamark.ru');
const password = ref('');
const message = ref('');
const isLoading = ref(false);

async function submitLogin() {
    isLoading.value = true;
    message.value = '';

    try {
        await login(email.value, password.value);
        await router.push(route.query.redirect || '/dashboard');
    } catch {
        message.value = 'Не удалось войти. Проверьте почту и пароль или зарегистрируйте нового пользователя.';
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <section class="narrow" aria-labelledby="login-title">
        <h1 id="login-title">Вход</h1>

        <form class="card form-card" @submit.prevent="submitLogin">
            <label for="email">Почта</label>
            <input id="email" v-model="email" type="email" autocomplete="email" required>

            <label for="password">Пароль</label>
            <input id="password" v-model="password" type="password" autocomplete="current-password" required>

            <button class="button primary" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Выполняется вход...' : 'Войти' }}
            </button>

            <p v-if="message" class="form-message error" role="alert">{{ message }}</p>
        </form>

        <p class="muted">
            Нет аккаунта?
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
        </p>
    </section>
</template>
