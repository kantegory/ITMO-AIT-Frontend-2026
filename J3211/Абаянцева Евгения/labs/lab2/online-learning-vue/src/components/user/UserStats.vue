<template>
    <div class="row mb-4">
        <div class="col-md-4 mb-3 mb-md-0">
            <div class="card bg-danger text-white h-100">
                <div class="card-body text-center">
                    <svg class="icon icon-lg icon-inverse mb-2" aria-hidden="true">
                        <use xlink:href="/images/icons.svg#icon-course"></use>
                    </svg>
                    <h3>{{ stats.activeCourses }}</h3>
                    <p class="mb-0">Активных курсов</p>
                </div>
            </div>
        </div>
        
        <div class="col-md-4 mb-3 mb-md-0">
            <div class="card bg-success text-white h-100">
                <div class="card-body text-center">
                    <svg class="icon icon-lg icon-inverse mb-2" aria-hidden="true">
                        <use xlink:href="/images/icons.svg#icon-check"></use>
                    </svg>
                    <h3>{{ stats.completedCourses }}</h3>
                    <p class="mb-0">Завершено</p>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card bg-warning text-white h-100">
                <div class="card-body text-center">
                    <svg class="icon icon-lg icon-inverse mb-2" aria-hidden="true">
                        <use xlink:href="/images/icons.svg#icon-trophy"></use>
                    </svg>
                    <h3>{{ stats.certificates }}</h3>
                    <p class="mb-0">Сертификата</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    stats: {
        type: Object,
        default: () => ({
            activeCourses: 0,
            completedCourses: 0,
            certificates: 0
        })
    }
});
</script>

<style scoped>
.card {
    transition: transform 0.2s;
}
.card:hover {
    transform: translateY(-5px);
}
</style>