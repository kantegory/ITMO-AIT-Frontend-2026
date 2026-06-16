<script setup>
defineProps({
    task: {
        type: Object,
        default: null
    }
});
</script>

<template>
    <article v-if="task" class="card task-card">
        <h2>{{ task.title }}</h2>
        <p class="muted">Тип файла: {{ task.fileType }}. Статус: {{ task.status }}.</p>

        <div
            class="annotation-viewer"
            role="img"
            :aria-label="`Макет изображения для разметки: выделен объект класса ${task.className} и дорожный знак.`"
        >
            <span class="annotation-box" aria-hidden="true">{{ task.className }}</span>
            <span class="annotation-box annotation-box-small" aria-hidden="true">sign</span>
        </div>

        <section class="instruction" aria-labelledby="instruction-title">
            <h3 id="instruction-title">Инструкция</h3>
            <p>{{ task.instruction }}</p>
        </section>
    </article>

    <p v-else class="empty-state">Задача не найдена.</p>
</template>
