<script setup>
import { onMounted } from 'vue';
import StatCard from '../components/StatCard.vue';
import SvgIcon from '../components/SvgIcon.vue';
import { useApiData } from '../composables/useApiData';
import { useAuth } from '../composables/useAuth';

const { user } = useAuth();
const {
    projects,
    averageQuality,
    activeTasks,
    isLoading,
    error,
    loadData
} = useApiData();

onMounted(loadData);
</script>

<template>
    <section aria-labelledby="dashboard-title">
        <div class="page-heading">
            <div>
                <h1 id="dashboard-title">Личный кабинет пользователя</h1>
                <p class="muted">
                    {{ user?.name || user?.email }}, роль: {{ user?.role || 'Пользователь' }}
                </p>
            </div>

            <button class="button ghost" type="button" @click="loadData">
                <SvgIcon name="icon-refresh" />
                <span>Обновить данные</span>
            </button>
        </div>

        <p v-if="isLoading" class="state-message" role="status">Данные загружаются...</p>
        <p v-else-if="error" class="state-message error" role="alert">{{ error }}</p>

        <section v-else class="stats" aria-label="Показатели кабинета" aria-live="polite">
            <StatCard title="Проекты аннотации" :value="projects.length" />
            <StatCard title="Среднее качество" :value="`${averageQuality}%`" />
            <StatCard title="Задания в работе" :value="activeTasks" />
        </section>
    </section>
</template>
