<script setup>
defineProps(['course'])
</script>

<template>
    <div class="col">
        <div class="card h-100 border-0 course-card">
            <div class="card-body d-flex flex-column p-4">
                <div class="d-flex justify-content-between mb-4">
                    <span class="badge bg-light text-dark border">{{ course.level }}</span>
                    <small class="text-muted">{{ course.category }}</small>
                </div>
                <h1 class="fw-bold h5 my-auto pb-4">{{ course.title }}</h1>
                <div class="mt-auto pt-4 border-top d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-primary">{{ course.price }} ₽</span>
                    <button @click="$emit('show-info', course.id)" class="btn btn-dark btn-sm">
                        Узнать больше
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
