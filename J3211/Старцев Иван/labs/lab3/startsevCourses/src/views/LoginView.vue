<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppAlert from '@/components/AppAlert.vue'
import { useAlert } from '@/composables/useAlert'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const sessionStore = useSessionStore()

const form = reactive({
    email: '',
    password: '',
})

const { alert, showAlert, hideAlert } = useAlert()

const sanitizePassword = () => {
    form.password = form.password.replace(/\s/g, '')
}

const handleSubmit = async () => {
    hideAlert()

    try {
        await sessionStore.login({
            email: form.email.trim(),
            password: form.password,
        })

        await router.replace('/courses')
    } catch {
        showAlert('danger', 'Не удалось войти.')
    }
}
</script>

<template>
    <main class="container d-flex justify-content-center align-items-center py-5">
        <section
            class="card p-4 rounded-4"
            style="max-width: 460px; width: 100%;"
            aria-labelledby="authTitle"
        >
            <h1 id="authTitle" class="h5 text-center mb-3">Вход</h1>

            <AppAlert :visible="alert.visible" :type="alert.type" :text="alert.text" />

            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="inputEmail" class="form-label">Адрес</label>
                    <input
                        id="inputEmail"
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        autocomplete="email"
                        required
                    >
                </div>

                <div class="mb-3">
                    <label for="inputPassword" class="form-label">Пароль</label>
                    <input
                        id="inputPassword"
                        v-model="form.password"
                        type="password"
                        class="form-control"
                        autocomplete="current-password"
                        required
                        @input="sanitizePassword"
                    >
                </div>

                <div class="d-flex justify-content-center mb-3">
                    <button type="submit" class="btn btn-primary w-75">Войти</button>
                </div>

                <p class="text-center mt-3 mb-0">
                    Нет аккаунта?
                    <RouterLink to="/register" class="link-primary">
                        Зарегистрироваться
                    </RouterLink>
                </p>
            </form>
        </section>
    </main>
</template>
