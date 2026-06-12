<template>
    <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-3">
            <label for="email" class="form-label">Email адрес</label>
            <input 
                type="email" 
                class="form-control" 
                id="email" 
                v-model="email"
                required
            >
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Пароль</label>
            <div class="input-group">
                <span class="input-group-text bg-light">
                    <svg class="icon icon-sm"><use href="/images/icons.svg#icon-lock"></use></svg>
                </span>
                <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="password" 
                    v-model="password"
                    required
                >
                <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" class="icon icon-sm"><use href="/images/icons.svg#icon-eye"></use></svg>
                    <svg v-else class="icon icon-sm"><use href="/images/icons.svg#icon-eye-off"></use></svg>
                </button>
            </div>
        </div>

        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 mb-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Войти 
            <svg class="icon icon-sm ms-2"><use href="/images/icons.svg#icon-arrow-right"></use></svg>
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from '../../composables/useAuth';

const { login, loading, error } = useAuth();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

async function handleSubmit() {
    await login(email.value, password.value);
}
</script>