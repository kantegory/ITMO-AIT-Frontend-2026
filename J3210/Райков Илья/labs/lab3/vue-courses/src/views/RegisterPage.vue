<template>
    <main class="auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div class="card shadow-lg auth-card border-0">
            <div class="card-body p-5">
                <div class="text-center mb-4">
                    <router-link to="/" class="logo-link h4 fw-bold d-block mb-3">
                        <svg-icon name="mortarboard-fill" class="text-warning" /> EduPlatform
                    </router-link>
                    <h2 class="fw-bold">Создать аккаунт</h2>
                </div>

                <form @submit.prevent="handleRegister" :class="{ 'was-validated': submitted }" novalidate>
                    <div class="row g-2 mb-3">
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="text" class="form-control" v-model="form.firstName" placeholder="Имя" required>
                                <label>Имя</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="text" class="form-control" v-model="form.lastName" placeholder="Фамилия" required>
                                <label>Фамилия</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" v-model="form.email" placeholder="Email" required @input="error = ''">
                        <label>Email адрес</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" v-model="form.password" placeholder="Пароль" required minlength="6">
                        <label>Пароль (мин. 6 симв.)</label>
                    </div>

                    <div class="form-floating mb-4">
                        <input type="password" class="form-control" v-model="confirmPassword" placeholder="Повтор" required @input="error = ''">
                        <label>Повторите пароль</label>
                        <div class="invalid-feedback d-block" v-if="error">{{ error }}</div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-3 fw-bold" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                        <span v-else>Зарегистрироваться</span>
                    </button>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SvgIcon from '@/components/SvgIcon.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    courses: [],
    certificates: []
});
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const submitted = ref(false);

const handleRegister = async (e) => {
    submitted.value = true;
    if (!e.target.checkValidity()) return;

    if (form.password !== confirmPassword.value) {
        error.value = "Пароли не совпадают";
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            courses: [],
            certificates: []
        };
        await authStore.register(form);
        alert("Успешно! Теперь войдите.");
        router.push('/login');
    } catch (err) {
        error.value = "Ошибка (возможно Email уже занят)";
    } finally {
        loading.value = false;
    }
};
</script>