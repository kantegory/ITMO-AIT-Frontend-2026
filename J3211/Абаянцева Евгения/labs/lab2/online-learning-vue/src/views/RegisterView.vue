<template>
    <div class="auth-container">
        <div class="card auth-card shadow-lg">
            <div class="auth-header bg-custom-red text-white p-4 text-center">
                <h3>Создать аккаунт</h3>
                <p class="mb-0 opacity-75">Начните обучение бесплатно</p>
            </div>
            
            <div class="card-body p-4">
                <form @submit.prevent="handleRegister" novalidate>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName" class="form-label">Имя</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="firstName" 
                                v-model="formData.firstName"
                                required
                            >
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="lastName" class="form-label">Фамилия</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="lastName" 
                                v-model="formData.lastName"
                                required
                            >
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email адрес</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            id="email" 
                            v-model="formData.email"
                            required
                        >
                        <div class="form-text">Мы не передаём ваш email третьим лицам</div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Пароль</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="password" 
                            v-model="formData.password"
                            minlength="6"
                            required
                        >
                        <div class="form-text">Минимум 6 символов</div>
                    </div>

                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="confirmPassword" 
                            v-model="formData.confirmPassword"
                            required
                        >
                        <div v-if="passwordError" class="text-danger small mt-1">
                            {{ passwordError }}
                        </div>
                    </div>

                    <div class="mb-4 form-check">
                        <input 
                            type="checkbox" 
                            class="form-check-input" 
                            id="agreeTerms" 
                            v-model="formData.agreeTerms"
                            required
                        >
                        <label class="form-check-label small" for="agreeTerms">
                            Я согласен с <a href="#" class="text-primary">условиями использования</a>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зарегистрироваться
                    </button>
                    
                    <div v-if="apiError" class="alert alert-danger mt-3">
                        {{ apiError }}
                    </div>
                </form>

                <div class="text-center mt-4">
                    <span class="text-muted small">Уже есть аккаунт? </span>
                    <router-link to="/login" class="text-primary fw-bold">Войти</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '../composables/useAuth';

const router = useRouter();
const { register, loading: isLoading, error: apiError } = useAuth();

const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
});

const passwordError = ref('');

async function handleRegister() {
    passwordError.value = '';
    
    if (formData.password !== formData.confirmPassword) {
        passwordError.value = 'Пароли не совпадают';
        return;
    }
    
    if (!formData.agreeTerms) {
        alert('Необходимо принять условия использования');
        return;
    }

    const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: 'student'
    };

    const success = await register(userData);
    
    if (success) {
        console.log('Регистрация успешна');
    }
}
</script>

<style scoped>
.auth-container {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-secondary);
}

.auth-card {
    width: 100%;
    max-width: 500px;
    border-radius: 15px;
    overflow: hidden;
}

.auth-header {
    background: var(--gradient-primary); 
}
</style>