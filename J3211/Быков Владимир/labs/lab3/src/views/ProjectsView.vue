<script setup>
import { computed, onMounted, ref } from 'vue';
import ProjectCard from '../components/ProjectCard.vue';
import SvgIcon from '../components/SvgIcon.vue';
import { useApiData } from '../composables/useApiData';

const {
    projects,
    isLoading,
    error,
    loadData
} = useApiData();

const statusFilter = ref('all');
const typeFilter = ref('all');
const workerFilter = ref('all');

const filteredProjects = computed(() => {
    return projects.value.filter((project) => {
        return (statusFilter.value === 'all' || project.status === statusFilter.value)
            && (typeFilter.value === 'all' || project.type === typeFilter.value)
            && (workerFilter.value === 'all' || project.worker === workerFilter.value);
    });
});

function resetFilters() {
    statusFilter.value = 'all';
    typeFilter.value = 'all';
    workerFilter.value = 'all';
}

onMounted(loadData);
</script>

<template>
    <section aria-labelledby="projects-title">
        <div class="page-heading">
            <div>
                <h1 id="projects-title">Поиск проектов и заданий</h1>
                <p class="muted">Фильтрация по статусу, типу аннотации и исполнителю.</p>
            </div>

            <button class="button ghost" type="button" @click="resetFilters">
                <SvgIcon name="icon-filter-x" />
                <span>Сбросить фильтры</span>
            </button>
        </div>

        <form class="filters" role="search" aria-label="Фильтры проектов">
            <label>
                Статус
                <select v-model="statusFilter">
                    <option value="all">Все</option>
                    <option value="active">Активен</option>
                    <option value="review">Проверка</option>
                    <option value="done">Готов</option>
                </select>
            </label>

            <label>
                Тип аннотации
                <select v-model="typeFilter">
                    <option value="all">Все</option>
                    <option value="image">Изображения</option>
                    <option value="text">Текст</option>
                    <option value="audio">Аудио</option>
                </select>
            </label>

            <label>
                Исполнитель
                <select v-model="workerFilter">
                    <option value="all">Все</option>
                    <option value="anna">Анна</option>
                    <option value="igor">Игорь</option>
                    <option value="team">Команда</option>
                </select>
            </label>
        </form>

        <p v-if="isLoading" class="state-message" role="status">Проекты загружаются...</p>
        <p v-else-if="error" class="state-message error" role="alert">{{ error }}</p>

        <section v-else class="project-grid" aria-live="polite">
            <ProjectCard
                v-for="project in filteredProjects"
                :key="project.id"
                :project="project"
            />

            <p v-if="!filteredProjects.length" class="empty-state" role="status">Проекты не найдены.</p>
        </section>
    </section>
</template>
