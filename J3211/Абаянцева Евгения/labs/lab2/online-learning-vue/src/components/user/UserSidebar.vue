<template>
    <aside class="col-lg-3 mb-4">
        <div class="card text-center mb-3">
            <div class="card-body">
                <img 
                    :src="userAvatar" 
                    class="rounded-circle mb-3" 
                    alt="Аватар пользователя" 
                    style="width: 100px; height: 100px; object-fit: cover;"
                >
                <h5>{{ userName }}</h5>
                <p class="text-muted small">{{ userEmail }}</p>
                <span class="badge bg-secondary">Студент</span>
            </div>
        </div>

        <nav class="list-group" aria-label="Меню личного кабинета">
            <router-link 
                to="/dashboard" 
                exact-active-class="active"
                class="list-group-item list-group-item-action d-flex align-items-center"
            >
                <svg class="icon icon-sm me-3" aria-hidden="true"><use xlink:href="/images/icons.svg#icon-course"></use></svg>
                Мои курсы
            </router-link>
            
            <router-link 
                to="/dashboard/certificates" 
                active-class="active"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
            >
                <div class="d-flex align-items-center">
                    <svg class="icon icon-sm me-3" aria-hidden="true"><use xlink:href="/images/icons.svg#icon-trophy"></use></svg>
                    Сертификаты
                </div>
                <span class="badge bg-primary rounded-pill">{{ certificateCount }}</span>
            </router-link>
            
            <router-link 
                to="/dashboard/history" 
                active-class="active"
                class="list-group-item list-group-item-action d-flex align-items-center"
            >
                <svg class="icon icon-sm me-3" aria-hidden="true"><use xlink:href="/images/icons.svg#icon-clock"></use></svg>
                История обучения
            </router-link>
            
            <router-link 
                to="/dashboard/favorites" 
                active-class="active"
                class="list-group-item list-group-item-action d-flex align-items-center"
            >
                <svg class="icon icon-sm me-3" aria-hidden="true"><use href="/images/icons.svg#icon-heart"></use></svg>
                Избранное
            </router-link>
            
            <router-link 
                to="/dashboard/settings" 
                active-class="active"
                class="list-group-item list-group-item-action d-flex align-items-center"
            >
                <svg class="icon icon-sm me-3" aria-hidden="true"><use href="/images/icons.svg#icon-gear"></use></svg>
                Настройки
            </router-link>
        </nav>
    </aside>
</template>

<script setup>
import { computed } from 'vue';
import useAuth from '../../composables/useAuth';

const { user } = useAuth();

const userName = computed(() => user.value ? user.value.name : 'Гость');
const userEmail = computed(() => user.value ? user.value.email : '');
const userAvatar = computed(() => {
    const name = user.value ? user.value.name : 'Guest User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&size=128`;
});

const certificateCount = computed(() => 2); 
</script>

<style scoped>
.list-group-item {
    border-left: 3px solid transparent;
    transition: all 0.2s;
}

.list-group-item.active {
    background-color: var(--bg-card); /* Или цвет темы */
    color: var(--primary-color);
    border-left-color: var(--primary-color);
    font-weight: 600;
}

.list-group-item:hover:not(.active) {
    background-color: var(--bg-secondary);
    border-left-color: var(--border-color);
}
</style>