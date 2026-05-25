<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useTheme } from '../composables/useTheme';
import SvgIcon from './SvgIcon.vue';

const router = useRouter();
const { isLoggedIn, logout } = useAuth();
const { isDark, buttonText, toggleTheme } = useTheme();

function logoutUser() {
    logout();
    router.push('/');
}
</script>

<template>
    <header class="app-header">
        <nav class="container header-inner" aria-label="Основная навигация">
            <RouterLink class="brand" to="/">DataMark</RouterLink>

            <div class="nav-links">
                <RouterLink to="/projects">Проекты</RouterLink>
                <RouterLink to="/task">Задача</RouterLink>
                <RouterLink to="/workers">Рабочие</RouterLink>
                <RouterLink to="/dashboard">Кабинет</RouterLink>
            </div>

            <div class="auth-links">
                <button
                    class="button ghost"
                    type="button"
                    :aria-pressed="isDark"
                    :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
                    @click="toggleTheme"
                >
                    <SvgIcon name="icon-theme" />
                    <span>{{ buttonText }}</span>
                </button>
                <RouterLink v-if="!isLoggedIn" class="button ghost" to="/login">
                    <SvgIcon name="icon-login" />
                    <span>Войти</span>
                </RouterLink>
                <RouterLink v-if="!isLoggedIn" class="button primary" to="/register">
                    <SvgIcon name="icon-login" />
                    <span>Регистрация</span>
                </RouterLink>
                <button v-else class="button ghost" type="button" @click="logoutUser">
                    <SvgIcon name="icon-logout" />
                    <span>Выйти</span>
                </button>
            </div>
        </nav>
    </header>
</template>
