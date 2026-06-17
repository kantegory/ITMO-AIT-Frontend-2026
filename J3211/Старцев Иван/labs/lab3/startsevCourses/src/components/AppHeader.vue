<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences'
import { useSessionStore } from '@/stores/session'

const route = useRoute()
const router = useRouter()

const sessionStore = useSessionStore()
const preferencesStore = usePreferencesStore()

const currentUser = computed(() => sessionStore.currentUser)
const hasUser = computed(() => Boolean(currentUser.value))

const getLinkClass = (name) => (route.name === name ? 'nav-link active' : 'nav-link')

const getLinks = computed(() => {
    const result = [{ key: 'courses', to: '/courses', label: 'Курсы' }]

    if (hasUser.value) {
        result.push(
            { key: 'my-courses', to: '/my-courses', label: 'Мои курсы' },
            { key: 'my-learning', to: '/my-learning', label: 'Моё обучение' },
        )
    }

    return result
})

const handleLogout = async () => {
    sessionStore.clearSession()
    await router.replace('/courses')
}

const toggleTheme = () => {
    preferencesStore.toggleTheme()
}
</script>

<template>
    <header class="sticky-top" data-app-header>
        <nav class="navbar navbar-expand-lg bg-dark navbar-dark border-bottom">
            <div class="container-fluid">
                <RouterLink class="navbar-brand" to="/courses">Старцев Курсы</RouterLink>

                <button
                    class="navbar-toggler ms-auto me-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavCollapse"
                    aria-controls="mainNavCollapse"
                    aria-expanded="false"
                    aria-label="Открыть меню"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="d-flex align-items-center order-lg-last gap-2">
                    <button
                        class="btn btn-outline-light header__button rounded-circle object-fit-cover"
                        type="button"
                        aria-label="Переключить тему"
                        @click="toggleTheme"
                    >
                        <svg class="header_svg" aria-hidden="true">
                            <use href="/sprites.svg#circleHalf"></use>
                        </svg>
                    </button>

                    <div v-if="hasUser" class="dropdown">
                        <button
                            class="btn p-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="true"
                            data-bs-display="static"
                            aria-expanded="false"
                            aria-label="Открыть меню профиля"
                        >
                            <img
                                :src="currentUser.avatar"
                                :alt="currentUser.name"
                                class="rounded-circle object-fit-cover"
                                width="40"
                                height="40"
                            >
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end shadow-sm rounded-3 p-2">
                            <li>
                                <RouterLink class="dropdown-item rounded-2 px-3 py-2" to="/profile">
                                    Профиль
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item rounded-2 px-3 py-2" to="/my-learning">
                                    Моё обучение
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item rounded-2 px-3 py-2" to="/my-courses">
                                    Мои курсы
                                </RouterLink>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <button
                                    class="dropdown-item rounded-2 px-3 py-2 text-danger"
                                    type="button"
                                    @click="handleLogout"
                                >
                                    Выйти
                                </button>
                            </li>
                        </ul>
                    </div>

                    <RouterLink
                        v-else
                        class="btn btn-outline-light header__button"
                        to="/login"
                        aria-label="Войти"
                    >
                        <svg class="header_svg" aria-hidden="true">
                            <use href="/sprites.svg#door"></use>
                        </svg>
                    </RouterLink>
                </div>

                <div class="collapse navbar-collapse" id="mainNavCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li
                            v-for="link in getLinks"
                            :key="link.key"
                            class="nav-item"
                        >
                            <RouterLink :class="getLinkClass(link.key)" :to="link.to">
                                {{ link.label }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>
