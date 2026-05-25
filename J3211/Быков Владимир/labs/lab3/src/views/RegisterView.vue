<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { register } = useAuth();

const name = ref('Владимир Быков');
const email = ref('');
const password = ref('');
const role = ref('Менеджер проекта');
const message = ref('');
const isLoading = ref(false);

async function submitRegister() {
    isLoading.value = true;
    message.value = '';

    try {
        await register({
            name: name.value,
            email: email.value,
            password: password.value,
            role: role.value
        });

        await router.push('/dashboard');
    } catch {
        message.value = 'Регистрация не выполнена. Возможно, такая почта уже используется.';
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <section class="narrow" aria-labelledby="register-title">
        <h1 id="register-title">Регистрация</h1>

        <form class="card form-card" @submit.prevent="submitRegister">
            <label for="name">Имя</label>
            <input id="name" v-model="name" type="text" autocomplete="name" required>

            <label for="email">Почта</label>
            <input id="email" v-model="email" type="email" autocomplete="email" required>

            <label for="password">Пароль</label>
            <input id="password" v-model="password" type="password" autocomplete="new-password" minlength="4" required>

            <label for="role">Роль</label>
            <select id="role" v-model="role">
                <option>Менеджер проекта</option>
                <option>Аннотатор</option>
                <option>Валидатор</option>
            </select>

            <button class="button primary" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Создаём аккаунт...' : 'Зарегистрироваться' }}
            </button>

            <p v-if="message" class="form-message error" role="alert">{{ message }}</p>
        </form>
    </section>
</template>
