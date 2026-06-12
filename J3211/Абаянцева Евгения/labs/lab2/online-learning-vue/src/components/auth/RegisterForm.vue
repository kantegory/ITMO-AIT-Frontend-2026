<template>
    <form @submit.prevent="handleSubmit" novalidate class="needs-validation">
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="regFirstName" class="form-label">Имя</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="regFirstName" 
                    v-model="localData.firstName"
                    :class="{ 'is-invalid': submitted && !localData.firstName }"
                    required
                >
                <div class="invalid-feedback">Введите имя.</div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="regLastName" class="form-label">Фамилия</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="regLastName" 
                    v-model="localData.lastName"
                    :class="{ 'is-invalid': submitted && !localData.lastName }"
                    required
                >
                <div class="invalid-feedback">Введите фамилию.</div>
            </div>
        </div>

        <div class="mb-3">
            <label for="regEmail" class="form-label">Email адрес</label>
            <input 
                type="email" 
                class="form-control" 
                id="regEmail" 
                v-model="localData.email"
                :class="{ 'is-invalid': submitted && !isValidEmail }"
                required
            >
            <div class="invalid-feedback">Введите корректный email.</div>
            <div class="form-text">Мы не передаём ваш email третьим лицам</div>
        </div>

        <div class="mb-3">
            <label for="regPassword" class="form-label">Пароль</label>
            <input 
                type="password" 
                class="form-control" 
                id="regPassword" 
                v-model="localData.password"
                :class="{ 'is-invalid': submitted && localData.password.length < 6 }"
                minlength="6"
                required
            >
            <div class="invalid-feedback">Пароль должен содержать минимум 6 символов.</div>
        </div>

        <div class="mb-3">
            <label for="regConfirmPassword" class="form-label">Подтвердите пароль</label>
            <input 
                type="password" 
                class="form-control" 
                id="regConfirmPassword" 
                v-model="localData.confirmPassword"
                :class="{ 'is-invalid': submitted && passwordsMismatch }"
                required
            >
            <div v-if="submitted && passwordsMismatch" class="invalid-feedback">
                Пароли не совпадают.
            </div>
        </div>

        <div class="mb-4 form-check">
            <input 
                type="checkbox" 
                class="form-check-input" 
                id="regAgreeTerms" 
                v-model="localData.agreeTerms"
                :class="{ 'is-invalid': submitted && !localData.agreeTerms }"
                required
            >
            <label class="form-check-label small" for="regAgreeTerms">
                Я согласен с <a href="#" class="text-primary text-decoration-none">условиями использования</a>
            </label>
            <div v-if="submitted && !localData.agreeTerms" class="invalid-feedback d-block">
                Необходимо согласие с условиями.
            </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Зарегистрироваться
        </button>

        <div v-if="apiError" class="alert alert-danger mt-3">
            {{ apiError }}
        </div>
    </form>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import useAuth from '../../composables/useAuth';

const { register, loading: isLoading, error: apiError } = useAuth();

const localData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
});

const submitted = ref(false);

const isValidEmail = computed(() => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(localData.email);
});

const passwordsMismatch = computed(() => {
    return localData.password !== localData.confirmPassword;
});

async function handleSubmit() {
    submitted.value = true;

    if (!localData.firstName || !localData.lastName || !isValidEmail.value || 
        localData.password.length < 6 || passwordsMismatch.value || !localData.agreeTerms) {
        return;
    }

    const fullName = `${localData.firstName} ${localData.lastName}`;
    const encodedName = encodeURIComponent(fullName);

    const userData = {
        name: fullName,
        firstName: localData.firstName,
        lastName: localData.lastName,
        email: localData.email,
        password: localData.password,
        avatar: `https://ui-avatars.com/api/?name=${encodedName}&background=dc2626&color=fff&size=100&format=png`,
        role: 'student'
    };

    const success = await register(userData);
    
    if (success) {
        console.log('Регистрация успешна');
    } else {
        console.error('Ошибка регистрации');
    }
}
</script>

<style scoped>
</style>