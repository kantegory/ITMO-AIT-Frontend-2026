<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()

const alert = ref({
    type: '',
    text: '',
    visible: false,
})

const form = reactive({
    name: '',
    email: '',
    avatar: '',
    password: '',
})

const showMessage = (type, text) => {
    alert.value = {
        type,
        text,
        visible: true,
    }
}

const hideMessage = () => {
    alert.value = {
        type: '',
        text: '',
        visible: false,
    }
}

const sanitizePassword = () => {
    form.password = form.password.replace(/\s/g, '')
}

const fillForm = () => {
    form.name = sessionStore.currentUser.name
    form.email = sessionStore.currentUser.email
    form.avatar = sessionStore.currentUser.avatar
    form.password = ''
}

const handleSubmit = async () => {
    hideMessage()

    const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim(),
    }

    if (form.password) {
        payload.password = form.password
    }

    try {
        await sessionStore.patchCurrentUser(payload)
        fillForm()
        showMessage('success', 'Профиль обновлен.')

        const modal = window.bootstrap?.Modal.getInstance(document.getElementById('editProfileModal'))

        if (modal) {
            modal.hide()
        }
    } catch {
        showMessage('danger', 'Не удалось сохранить изменения.')
    }
}

onMounted(() => {
    document.title = 'Профиль'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Профиль пользователя.')
    }

    fillForm()
})
</script>

<template>
    <main class="py-4">
        <div class="container">
            <div
                v-if="alert.visible"
                :class="`alert alert-${alert.type} mb-4`"
                role="alert"
            >
                {{ alert.text }}
            </div>

            <div class="row g-4">
                <div class="col-12 col-lg-8">
                    <div class="card border-0 shadow-lg rounded-4">
                        <div class="card-body p-4 p-md-5">
                            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                                <div>
                                    <h1 class="h3 mb-1">Профиль</h1>
                                    <p class="text-muted mb-0">Основная информация пользователя</p>
                                </div>

                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editProfileModal"
                                >
                                    Изменить данные
                                </button>
                            </div>

                            <div class="mb-4">
                                <img
                                    :src="sessionStore.currentUser.avatar"
                                    :alt="sessionStore.currentUser.name"
                                    class="rounded-circle object-fit-cover"
                                    width="96"
                                    height="96"
                                >
                            </div>

                            <dl class="row g-4">
                                <div class="col-12 col-md-6">
                                    <dt class="small mb-1">Имя</dt>
                                    <dd class="fs-5 fw-bold mb-0">{{ sessionStore.currentUser.name }}</dd>
                                </div>

                                <div class="col-12 col-md-6">
                                    <dt class="small mb-1">Email</dt>
                                    <dd class="fs-5 fw-bold mb-0">{{ sessionStore.currentUser.email }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-4">
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="card border-0 shadow-lg rounded-4">
                                <div class="card-body p-4">
                                    <dl class="mb-2">
                                        <dt class="text-muted mb-2">Курсы в обучении</dt>
                                        <dd class="display-6 fw-bold mb-2">
                                            {{ sessionStore.currentUser.learningCourseIds.length }}
                                        </dd>
                                    </dl>

                                    <RouterLink to="/my-learning" class="btn btn-sm btn-outline-primary">
                                        Моё обучение
                                    </RouterLink>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="card border-0 shadow-lg rounded-4">
                                <div class="card-body p-4">
                                    <dl class="mb-2">
                                        <dt class="text-muted mb-2">Создано курсов</dt>
                                        <dd class="display-6 fw-bold mb-2">
                                            {{ sessionStore.currentUser.createdCourseIds.length }}
                                        </dd>
                                    </dl>

                                    <RouterLink to="/my-courses" class="btn btn-sm btn-outline-success">
                                        Мои курсы
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div
        id="editProfileModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="editProfileModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="editProfileModalLabel" class="modal-title fs-5">
                        Изменить данные
                    </h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                <div class="modal-body">
                    <form id="editProfileForm" @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="editName" class="form-label">Имя</label>
                            <input
                                id="editName"
                                v-model="form.name"
                                type="text"
                                class="form-control"
                                placeholder="Ivan"
                                autocomplete="name"
                                required
                            >
                        </div>

                        <div class="mb-3">
                            <label for="editEmail" class="form-label">Email</label>
                            <input
                                id="editEmail"
                                v-model="form.email"
                                type="email"
                                class="form-control"
                                placeholder="email@example.com"
                                autocomplete="email"
                                required
                            >
                        </div>

                        <div class="mb-3">
                            <label for="editAvatar" class="form-label">Ссылка на аватар</label>
                            <input
                                id="editAvatar"
                                v-model="form.avatar"
                                type="url"
                                class="form-control"
                                placeholder="https://example.com/avatar.jpg"
                                required
                            >
                        </div>

                        <div class="mb-0">
                            <label for="editPassword" class="form-label">Новый пароль</label>
                            <input
                                id="editPassword"
                                v-model="form.password"
                                type="password"
                                class="form-control"
                                placeholder="Введите новый пароль"
                                autocomplete="new-password"
                                @input="sanitizePassword"
                            >
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        Отмена
                    </button>
                    <button type="submit" class="btn btn-primary" form="editProfileForm">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
