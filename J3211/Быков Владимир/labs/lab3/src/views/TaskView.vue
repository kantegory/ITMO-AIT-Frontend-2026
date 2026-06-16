<script setup>
import { computed, onMounted } from 'vue';
import TaskPreview from '../components/TaskPreview.vue';
import { useApiData } from '../composables/useApiData';

const {
    tasks,
    isLoading,
    error,
    loadData
} = useApiData();

const currentTask = computed(() => tasks.value[0] || null);

onMounted(loadData);
</script>

<template>
    <section aria-labelledby="task-title">
        <h1 id="task-title">Страница задачи аннотации</h1>

        <p v-if="isLoading" class="state-message" role="status">Задача загружается...</p>
        <p v-else-if="error" class="state-message error" role="alert">{{ error }}</p>

        <div v-else class="task-layout">
            <TaskPreview :task="currentTask" />

            <aside class="card tools-card" aria-labelledby="tools-title">
                <h2 id="tools-title">Инструменты</h2>
                <ul>
                    <li>Прямоугольная область</li>
                    <li>Класс объекта</li>
                    <li>Комментарий валидатора</li>
                    <li>Статус проверки</li>
                </ul>
            </aside>
        </div>
    </section>
</template>
