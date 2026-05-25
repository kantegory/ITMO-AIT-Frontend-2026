<script setup>
import { onMounted } from 'vue';
import { useApiData } from '../composables/useApiData';
import StatCard from '../components/StatCard.vue';
import SvgIcon from '../components/SvgIcon.vue';

const {
    projects,
    totalItems,
    doneItems,
    averageQuality,
    isLoading,
    error,
    loadData
} = useApiData();

onMounted(loadData);
</script>

<template>
    <section class="hero" aria-labelledby="home-title">
        <p class="section-label">Платформа для ML-разметки</p>
        <h1 id="home-title">DataMark на Vue: проекты, задания и контроль качества</h1>
        <p class="hero-text">
            Приложение перенесено на Vue, использует маршрутизацию, компоненты,
            composable-функции и получает данные из мокового API через axios.
        </p>

        <div class="hero-actions">
            <RouterLink class="button primary" to="/projects">
                <SvgIcon name="icon-folder" />
                <span>Смотреть проекты</span>
            </RouterLink>
            <RouterLink class="button ghost" to="/dashboard">
                <SvgIcon name="icon-login" />
                <span>Открыть кабинет</span>
            </RouterLink>
        </div>
    </section>

    <p v-if="isLoading" class="state-message" role="status">Данные загружаются...</p>
    <p v-else-if="error" class="state-message error" role="alert">{{ error }}</p>

    <section v-else class="stats" aria-label="Сводка из API" aria-live="polite">
        <StatCard title="Проекты" :value="projects.length" />
        <StatCard title="Объекты" :value="totalItems" />
        <StatCard title="Размечено" :value="doneItems" />
        <StatCard title="Среднее качество" :value="`${averageQuality}%`" />
    </section>
</template>
