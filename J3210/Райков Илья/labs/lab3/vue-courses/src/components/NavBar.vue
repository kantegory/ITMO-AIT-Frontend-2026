<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow" aria-label="Основная навигация сайта">
        <div class="container">
            <router-link class="navbar-brand fw-bold" to="/">
                <svg-icon name="mortarboard-fill" class="text-warning me-2" />EduPlatform
            </router-link>
      
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Каталог курсов</router-link>
                    </li>
                    <li class="nav-item" v-if="auth.isLoggedIn">
                        <router-link class="nav-link" to="/dashboard">Мое обучение</router-link>
                    </li>
                    <li class="nav-item" v-else>
                        <a href="#" class="nav-link" @click.prevent="requireLogin">Мое обучение</a>
                    </li>
                </ul>
        
                <div class="d-flex gap-2 align-items-center">
                    <template v-if="auth.isLoggedIn">
                        <span class="text-light me-auto d-none d-md-inline" aria-live="polite">
                            Привет, <strong class="text-warning">{{ auth.user?.firstName }}</strong>!
                        </span>
                        <button class="btn btn-outline-danger btn-sm ms-2" @click="handleLogout" aria-label="Выйти">
                            <svg-icon name="box-arrow-right" /> Выйти
                        </button>
                    </template>
          
                    <template v-else>
                        <router-link to="/login" class="btn btn-outline-light">Войти</router-link>
                        <router-link to="/register" class="btn btn-warning">Регистрация</router-link>
                    </template>

                    <button class="btn btn-outline-light btn-sm ms-3" @click="toggleTheme" aria-label="Переключить тему">
                        <svg-icon :name="currentTheme === 'dark' ? 'sun-fill' : 'moon-stars-fill'" />
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const { currentTheme, toggleTheme } = useTheme();

const requireLogin = () => {
    alert("Чтобы увидеть свои курсы, пожалуйста, войдите.");
    router.push('/login');
};

const handleLogout = () => {
    if (confirm("Выйти из аккаунта?")) {
        auth.logout();
        router.push('/');
    }
};
</script>