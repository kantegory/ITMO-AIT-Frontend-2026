<template>
    <MainLayout>
        <div class="container my-5">
            <!-- Шапка профиля -->
            <div class="profile-header shadow-sm mb-4 d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                <img :src="`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0D8ABC&color=fff&size=120`" class="profile-avatar mb-3 mb-md-0 me-md-4 bg-white" alt="Аватар">
                <div>
                    <h2 class="fw-bold mb-1 text-white">{{ user?.firstName }} {{ user?.lastName }}</h2>
                    <p class="mb-2 opacity-75 text-white">{{ user?.email }}</p>
                </div>
            </div>

            <!-- Вкладки -->
            <ul class="nav nav-tabs mb-4 custom-tabs" role="tablist">
                <li class="nav-item">
                    <button class="nav-link" :class="{active: tab === 'courses'}" @click="tab = 'courses'">Мои курсы</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" :class="{active: tab === 'certs'}" @click="tab = 'certs'">Сертификаты</button>
                </li>
            </ul>

            <!-- Контент -->
            <div v-if="tab === 'courses'">
                <div class="row g-4" v-if="user?.courses?.length">
                    <div class="col-md-6 col-xl-4" v-for="course in user.courses" :key="course.id">
                        <CourseCard :course="course" :hide-button="true" />
                    </div>
                </div>
                <div v-else class="text-center py-5">
                    <h4 class="text-muted">У вас пока нет курсов</h4>
                    <router-link to="/" class="btn btn-primary mt-3">В каталог</router-link>
                </div>
            </div>

            <div v-if="tab === 'certs'" class="text-center py-5">
                <p class="text-muted">У вас пока нет сертификатов.</p>
            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import CourseCard from '@/components/CourseCard.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const tab = ref('courses');

onMounted(() => {
    authStore.fetchProfile();
});
</script>