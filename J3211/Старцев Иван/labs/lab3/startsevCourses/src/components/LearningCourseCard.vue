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
            <h2 class="card-title">{{ course.title }}</h2>
            <p class="card-text text-muted small mb-1">{{ course.description }}</p>

            <p class="card-text mb-2">
                <svg class="rating__star" aria-hidden="true">
                    <use href="/sprites.svg#ratingStar"></use>
                </svg>
                {{ course.rating.toFixed(1) }} / 5
            </p>

            <div class="mt-auto">
                <RouterLink
                    :to="{ name: 'lesson', params: { id: course.id } }"
                    class="btn btn-success btn-sm"
                >
                    Продолжить
                </RouterLink>

                <RouterLink
                    :to="{ name: 'course', params: { id: course.id } }"
                    class="btn btn-outline-primary btn-sm ms-1"
                >
                    О курсе
                </RouterLink>
            </div>
        </div>
    </article>
</template>
