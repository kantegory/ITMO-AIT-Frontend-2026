<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAuth, logout } = useAuth()
const router = useRouter()

function handleLogout() {
    logout()
    router.push('/')
}
</script>

<template>
    <header class="header">
        <div class="container header-inner">
            <RouterLink to="/" class="brand">AInator</RouterLink>
            <nav class="nav">
                <RouterLink to="/">Каталог</RouterLink>
                <template v-if="isAuth">
                    <RouterLink to="/dashboard">
                        <svg class="icon" aria-hidden="true"><use :href="`/sprites.svg#user`"/></svg>
                        Аккаунт
                    </RouterLink>
                    <button class="btn btn-sm" @click="handleLogout">Выйти</button>
                </template>
                <template v-else>
                    <RouterLink to="/login">Вход</RouterLink>
                    <RouterLink to="/register" class="btn btn-sm">Регистрация</RouterLink>
                </template>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.header {
    background: var(--navbar-bg);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    backdrop-filter: blur(10px);
}
.header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.brand {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--text);
}
.nav { 
    display: flex; 
    gap: 1rem; 
    align-items: center; 
}
.nav { 
    color: var(--muted); 
}
.nav a.router-link-active { 
    color: var(--text); 
}
</style>