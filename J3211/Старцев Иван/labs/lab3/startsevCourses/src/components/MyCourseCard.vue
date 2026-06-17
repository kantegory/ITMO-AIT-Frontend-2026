<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    course: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['edit'])
</script>

<template>
    <article class="card h-100">
        <img :src="course.image" class="card-img-top" :alt="course.title">

        <div class="card-body">
            <h2 class="h6 mb-2">{{ course.title }}</h2>
            <p class="small text-muted mb-1">{{ course.authorName }}</p>
            <p class="small mb-1">Рейтинг: <strong>{{ course.rating.toFixed(1) }} / 5</strong></p>
            <p class="small mb-1">Цена: <strong>{{ course.price }} ₽</strong></p>
            <p class="small mb-1">Учеников: <strong>{{ course.studentsCount }}</strong></p>
            <p class="small mb-3">
                Выручка:
                <strong>{{ course.studentsCount * course.price }} ₽</strong>
            </p>

            <div class="d-flex gap-1">
                <RouterLink
                    :to="{ name: 'course', params: { id: course.id } }"
                    class="btn btn-sm btn-outline-primary"
                >
                    Открыть
                </RouterLink>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="emit('edit', course)"
                >
                    Редактировать
                </button>
            </div>
        </div>
    </article>
</template>
