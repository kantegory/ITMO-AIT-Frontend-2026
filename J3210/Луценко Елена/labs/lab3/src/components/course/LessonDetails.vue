<script setup>
defineProps(['lesson'])
const download = (name) => alert('Скачивание: ' + name)
</script>

<template>
    <div class="card border-0 p-4 mb-4">
        <h1 class="fw-bold mb-3 h3">{{ lesson.title }}</h1>
        <p class="mb-0">{{ lesson.description }}</p>

        <hr>

        <h2 class="fw-bold mb-3 h6">Материалы к уроку:</h2>
        <div class="d-flex flex-wrap gap-2 mb-4" id="materials">
            <button
                v-for="file in lesson.materials"
                :key="file"
                class="btn btn-light border"
                @click="download(file)"
            >
                {{ file }}
            </button>
        </div>

        <div class="p-3 bg-light border-start border-4 border-danger rounded">
            <h2 class="fw-bold h6">Практическое задание:</h2>
            <small id="lessonTask" class="text-dark">{{ lesson.task }}</small>
        </div>
    </div>
</template>
