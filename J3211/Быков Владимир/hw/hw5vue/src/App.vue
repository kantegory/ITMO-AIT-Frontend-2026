<script setup>
import { computed, ref } from 'vue';
import ProjectCard from './components/ProjectCard.vue';
import StatCard from './components/StatCard.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';

const projects = ref([
    {
        id: 1,
        title: 'Разметка дорожных сцен',
        status: 'Активен',
        type: 'Изображения',
        worker: 'Анна Смирнова',
        done: 9720,
        total: 12480,
        quality: 96
    },
    {
        id: 2,
        title: 'Классификация отзывов',
        status: 'Проверка',
        type: 'Текст',
        worker: 'Игорь Павлов',
        done: 8040,
        total: 8400,
        quality: 94
    },
    {
        id: 3,
        title: 'Транскрибация звонков',
        status: 'Готов',
        type: 'Аудио',
        worker: 'Команда OCR',
        done: 3200,
        total: 3200,
        quality: 91
    }
]);

const selectedStatus = ref('all');

const filteredProjects = computed(() => {
    if (selectedStatus.value === 'all') {
        return projects.value;
    }

    return projects.value.filter((project) => project.status === selectedStatus.value);
});

const totalProjects = computed(() => projects.value.length);

const totalItems = computed(() => {
    return projects.value.reduce((sum, project) => sum + project.total, 0);
});

const completedItems = computed(() => {
    return projects.value.reduce((sum, project) => sum + project.done, 0);
});

const averageQuality = computed(() => {
    const sum = projects.value.reduce((result, project) => result + project.quality, 0);

    return Math.round(sum / projects.value.length);
});
</script>

<template>
    <header class="app-header">
        <div class="container header-content">
            <a class="brand" href="#">DataMark</a>
            <ThemeSwitcher />
        </div>
    </header>

    <main class="container page">
        <section class="hero" aria-labelledby="page-title">
            <div>
                <p class="section-label">Дз5</p>
                <h1 id="page-title">Vue-приложение для просмотра проектов разметки</h1>
                <p class="hero-text">
                    компоненты, реактивные данные,
                    вычисляемые значения, списки и обработку пользовательского выбора
                </p>
            </div>
        </section>

        <section class="stats" aria-label="Сводка по проектам">
            <StatCard title="Проекты" :value="totalProjects" />
            <StatCard title="Объекты" :value="totalItems" />
            <StatCard title="Размечено" :value="completedItems" />
            <StatCard title="Среднее качество" :value="`${averageQuality}%`" />
        </section>

        <section class="toolbar" aria-labelledby="projects-title">
            <div>
                <h2 id="projects-title">Проекты аннотации</h2>
                <p class="muted">Фильтрация выполняется без перезагрузки страницы.</p>
            </div>

            <label class="filter-label" for="status-filter">
                Статус
                <select id="status-filter" v-model="selectedStatus">
                    <option value="all">Все</option>
                    <option value="Активен">Активен</option>
                    <option value="Проверка">Проверка</option>
                    <option value="Готов">Готов</option>
                </select>
            </label>
        </section>

        <section class="project-grid" aria-live="polite">
            <ProjectCard
                v-for="project in filteredProjects"
                :key="project.id"
                :project="project"
            />

            <p v-if="filteredProjects.length === 0" class="empty-state">
                Проекты с выбранным статусом не найдены.
            </p>
        </section>
    </main>
</template>
