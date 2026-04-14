<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useTheme} from '@/composables/useTheme.js'
import {useAuth} from '@/composables/useAuth.js'

const route = useRoute()
const {theme, toggleTheme} = useTheme()
const {user, logout} = useAuth()

const isHomePage = computed(() => route.path === '/')
const isCoursePage = computed(() => route.path.startsWith('/course'))

const profilePath = computed(() => {
    if (!user.value) {
        return '/login'
    }
    return user.value.role === 'teacher' ? '/teacher' : '/profile'
})
</script>

<template>
    <header class="navbar navbar-dark bg-dark py-3">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand fw-bold">TopCourses</router-link>

            <div class="d-flex align-items-center gap-2">
                <template v-if="isHomePage">
                    <div v-if="user" class="d-flex align-items-center gap-2">
                        <router-link
                            :to="user.role === 'teacher' ? '/teacher' : '/profile'"
                            class="btn btn-link text-white text-decoration-none fw-bold me-2"
                        >
                            {{ user.name }}
                        </router-link>
                        <button @click="logout" class="btn btn-outline-light">Выйти</button>
                    </div>

                    <div v-else class="d-flex align-items-center gap-2">
                        <router-link to="/login" class="btn btn-outline-light">Вход</router-link>
                        <router-link to="/register" class="btn btn-primary">Регистрация
                        </router-link>
                    </div>
                </template>

                <template v-else-if="isCoursePage">
                    <router-link :to="profilePath" class="btn btn-light">В кабинет</router-link>
                    <button v-if="user" @click="logout" class="btn btn-outline-light ms-2">Выйти
                    </button>
                </template>

                <template v-else>
                    <div class="d-flex align-items-center gap-2">
                        <router-link to="/" class="btn btn-outline-light">В каталог</router-link>

                        <button v-if="user" @click="logout" class="btn btn-outline-light">Выйти
                        </button>
                    </div>
                </template>

                <button @click="toggleTheme" class="theme-toggle-nav" title="Сменить тему">
                    <svg class="icon">
                        <use :href="`/sprite.svg#icon-${theme === 'light' ? 'moon' : 'sun'}`"></use>
                    </svg>
                </button>
            </div>
        </div>
    </header>
</template>
