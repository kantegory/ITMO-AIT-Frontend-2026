<template>
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top border-bottom border-secondary">
        <div class="container">
            <router-link class="navbar-brand" to="/">
            AI <span class="text-info">HUB</span>
            </router-link>
        
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <router-link class="nav-link" to="/explore">Models</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/explore">Datasets</router-link>
                </li>
                </ul>
                
                <div class="d-flex align-items-center ms-auto gap-3">
                    <button @click="toggleTheme" class="btn btn-outline-secondary btn-sm border-0 px-2" title="Toggle Theme">
                        <span v-if="currentTheme === 'dark'">☀️</span>
                        <span v-else>🌙</span>
                    </button>
                
                    <template v-if="!authStore.isLoggedIn">
                        <button 
                        class="btn btn-outline-info" 
                        data-bs-toggle="modal" 
                        data-bs-target="#loginModal"
                        >
                        Sign in
                        </button>
                        
                        <button 
                        class="btn btn-info" 
                        data-bs-toggle="modal" 
                        data-bs-target="#regModal"
                        >
                        Sign up
                        </button>
                    </template>

                    <template v-else>
                        <!-- Кнопки профиля и выхода, которые мы уже настроили -->
                        <span class="text-secondary d-none d-md-block">
                        Welcome, <span class="text-info fw-bold">{{ authStore.userName }}</span>
                        </span>
                        <router-link to="/profile" class="btn btn-outline-info btn-sm">Profile</router-link>
                        <button @click="authStore.logout()" class="btn btn-outline-danger btn-sm">Log out</button>
                    </template>
                </div>
            </div>
        </div>
    </nav>
    <LoginModal />
    <RegisterModal />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const currentTheme = ref(localStorage.getItem('theme') || 'dark')

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
}

const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    localStorage.setItem('theme', currentTheme.value)
}

const handleLogout = () => {
    authStore.logout()
    router.push('/')
}

onMounted(() => {
    applyTheme()
})
</script>