<script setup>
import SvgIcon from './SvgIcon.vue';

defineProps({
    project: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <article class="card project-card">
        <span class="badge">{{ project.statusText }}</span>
        <h2>{{ project.title }}</h2>
        <p class="muted">{{ project.description }}</p>

        <dl class="meta-list">
            <div>
                <dt>Тип</dt>
                <dd>{{ project.typeText }}</dd>
            </div>
            <div>
                <dt>Исполнитель</dt>
                <dd>{{ project.workerText }}</dd>
            </div>
            <div>
                <dt>Размечено</dt>
                <dd>{{ project.itemsDone }} / {{ project.itemsTotal }}</dd>
            </div>
            <div>
                <dt>Качество</dt>
                <dd>{{ project.quality }}%</dd>
            </div>
        </dl>

        <RouterLink class="button ghost small" to="/task" :aria-label="`Открыть задачу проекта ${project.title}`">
            <SvgIcon name="icon-open" />
            <span>Открыть задачу</span>
        </RouterLink>
    </article>
</template>
