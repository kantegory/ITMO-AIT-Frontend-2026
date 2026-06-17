<script setup>
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import {coursesApi} from '@/api'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()

const form = reactive({
    surname: '',
    name: '',
    email: '',
    pass_1: '',
    pass_2: '',
    role: 'student'
})

const handleRegister = async () => {
    if (!form.surname || !form.name || !form.email || !form.pass_1 || !form.pass_2) {
        alert("Пожалуйста, заполните все поля формы")
        return
    }

    if (form.pass_1 !== form.pass_2) {
        alert("Пароли не совпадают")
        return
    }

    try {
        const userData = {
            email: form.email,
            password: form.pass_1,
            name: `${form.surname} ${form.name}`,
            role: form.role,
            courses: [],
            progress: {},
            certificates: []
        }

        const response = await coursesApi.signup(userData)

        if (response.status === 201 || response.status === 200) {
            alert("Регистрация успешна! Теперь вы можете войти")
            router.push('/login')
        }
    } catch (error) {
        if (error.response?.data === "Email already exists") {
            alert("Пользователь с такой почтой уже зарегистрирован")
        } else {
            alert("Ошибка при регистрации")
            console.error(error)
        }
    }
}
</script>

<template>
    <AuthLayout>
        <main class="container">
            <div class="row justify-content-center">
                <div class="col-sm-10 col-md-6 col-lg-4">
                    <div class="card p-5 reg-card">
                        <h3 class="text-center mb-4 fw-bold">Регистрация</h3>

                        <form @submit.prevent="handleRegister">
                            <div class="mb-3">
                                <label for="surname" class="form-label small">Фамилия</label>
                                <input v-model="form.surname" type="text" class="form-control"
                                       id="surname"
                                       placeholder="Семенов" required>
                            </div>

                            <div class="mb-3">
                                <label for="name" class="form-label small">Имя</label>
                                <input v-model="form.name" type="text" class="form-control"
                                       id="name"
                                       placeholder="Семен" required>
                            </div>

                            <div class="mb-3">
                                <label for="email" class="form-label small">Email</label>
                                <input v-model="form.email" type="email" class="form-control"
                                       id="email"
                                       placeholder="semen@test.ru" required>
                            </div>

                            <div class="mb-3">
                                <label for="pass_1" class="form-label small">Пароль</label>
                                <input v-model="form.pass_1" type="password" class="form-control"
                                       id="pass_1"
                                       required>
                            </div>

                            <div class="mb-4">
                                <label for="pass_2" class="form-label small">Повторите
                                    пароль</label>
                                <input v-model="form.pass_2" type="password" class="form-control"
                                       id="pass_2"
                                       required>
                            </div>

                            <div class="mb-3">
                                <label for="role" class="form-label small">Кто вы?</label>
                                <select v-model="form.role" class="form-select" id="role" required>
                                    <option value="student">Я ученик</option>
                                    <option value="teacher">Я преподаватель</option>
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Создать аккаунт
                            </button>
                        </form>

                        <div class="text-center mt-4">
                            <p class="small mb-1">
                                Уже есть аккаунт?
                                <router-link to="/login" class="text-decoration-none">Войти
                                </router-link>
                            </p>
                            <router-link to="/"
                                         class="text-muted text-decoration-none mt-2 d-inline-block small">
                                Вернуться в каталог
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </AuthLayout>
</template>
