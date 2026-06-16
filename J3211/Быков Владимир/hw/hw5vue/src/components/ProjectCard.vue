<script setup>
defineProps({
    project: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <article class="project-card">
        <span class="badge">{{ project.status }}</span>
        <h3>{{ project.title }}</h3>

        <dl>
            <div>
                <dt>Тип</dt>
                <dd>{{ project.type }}</dd>
            </div>
            <div>
                <dt>Исполнитель</dt>
                <dd>{{ project.worker }}</dd>
            </div>
            <div>
                <dt>Прогресс</dt>
                <dd>{{ project.done }} / {{ project.total }}</dd>
            </div>
            <div>
                <dt>Качество</dt>
                <dd>{{ project.quality }}%</dd>
            </div>
        </dl>
    </article>
</template>
