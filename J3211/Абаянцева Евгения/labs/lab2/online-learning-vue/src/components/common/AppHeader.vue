<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-custom-red" role="navigation" aria-label="Основная навигация">
        <div class="container">
            <router-link to="/" class="navbar-brand text-danger fw-bold d-inline-flex align-items-center" aria-label="OnlineLearning - главная страница">
                <i class="bi bi-mortarboard-fill me-2 fs-4" aria-hidden="true"></i>
                OnlineLearning
            </router-link>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Открыть меню" aria-expanded="false" aria-controls="navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link btn btn-light text-primary ms-2 px-3" active-class="active">Главная</router-link>
                    </li>
                    
                    <li class="nav-item">
                        <router-link to="/courses" class="nav-link btn btn-light text-primary ms-2 px-3" active-class="active">
                            Курсы
                        </router-link>
                    </li>
                    
                    <template v-if="!isAuthenticated">
                        <li class="nav-item">
                            <router-link to="/login" class="btn btn-light text-primary ms-2 px-3">
                                Вход
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/register" class="btn btn-outline-primary text-white ms-2 px-3">
                                Регистрация
                            </router-link>
                        </li>
                    </template>
                    
                    <template v-if="isAuthenticated && user">
                        <li class="nav-item dropdown ms-2">
                            <a class="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span class="me-1">{{ user.name }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <router-link to="/dashboard" class="dropdown-item">Личный кабинет</router-link>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <a href="#" class="dropdown-item text-danger" @click.prevent="handleLogout">
                                        Выйти
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue';
import useAuth from '../../composables/useAuth';

const { user, isAuthenticated, logout } = useAuth();

function handleLogout() {
    logout();
}
</script>

<style scoped>
.dropdown-toggle::after {
    margin-left: 0.5em;
    vertical-align: middle;
}
.navbar-nav .nav-item {
    display: flex;
    align-items: center;
}
</style>