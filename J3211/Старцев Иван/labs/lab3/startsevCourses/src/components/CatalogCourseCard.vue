<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    course: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <article class="card h-100">
        <img :src="course.image" class="card-img-top" :alt="course.title">

        <div class="card-body d-flex flex-column">
            <h2 class="h5 card-title">{{ course.title }}</h2>
            <p class="card-text text-muted small mb-2">{{ course.description }}</p>
            <p class="card-text mb-1">
                <strong>Автор:</strong> {{ course.authorName }}
            </p>
            <p class="card-text mb-1">
                <strong>Уровень:</strong> {{ course.level }}
            </p>
            <p class="card-text mb-1">
                <strong>Язык:</strong> {{ course.language }}
            </p>
            <p class="card-text mb-1">
                <svg class="rating__star" aria-hidden="true">
                    <use href="/sprites.svg#ratingStar"></use>
                </svg>
                {{ course.rating.toFixed(1) }} / 5
            </p>
            <p class="card-text mb-3">
                <svg class="card__users" aria-hidden="true">
                    <use href="/sprites.svg#users"></use>
                </svg>
                {{ course.studentsCount }} участников
            </p>

            <div class="mt-auto">
                <span class="badge bg-primary fs-6">{{ course.price }} ₽</span>
                <RouterLink
                    :to="{ name: 'course', params: { id: course.id } }"
                    class="btn btn-sm btn-outline-primary ms-2"
                >
                    Подробнее
                </RouterLink>
            </div>
        </div>
    </article>
</template>
