<template>
    <article class="card h-100 course-card shadow-sm border-0">
        <img :src="course.imgSrc" class="card-img-top" :alt="`Обложка курса: ${course.title}`" style="height: 160px; object-fit: cover;">
    
        <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-primary text-white px-2 py-1 text-capitalize">{{ course.category }}</span>
                <span class="small fw-bold" :aria-label="`Рейтинг: ${course.rating} из 5`">
                    <svg-icon name="star-fill" class="text-warning" /> {{ course.rating }}
                </span>
            </div>
      
            <h3 class="h6 card-title fw-bold m-0">{{ course.title }}</h3>
            <p class="card-text small mt-2 mb-0 opacity-75">
                {{ course.level === 'beginner' ? 'Для начинающих' : 'Для профи' }}
            </p>
      
            <div class="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
                <span class="fw-bold fs-5">{{ formattedPrice }} ₽</span>
        
                <button v-if="!hideButton" class="buy-btn" @click="$emit('buy', course)" :aria-label="`Записаться на ${course.title}`">
                    Записаться
                </button>
            </div>

            <div v-if="hideButton" class="mt-3">
                <div class="d-flex justify-content-between small mb-1 text-muted">
                    <span>Прогресс: 0%</span>
                </div>
                <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-primary" style="width: 0%;"></div>
                </div>
                <button class="btn btn-outline-primary w-100 mt-3" @click="openPlayer">Продолжить</button>
            </div>

        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
    course: {
        type: Object,
        required: true
    },
    hideButton: {
        type: Boolean,
        default: false
    }
});

defineEmits(['buy']);

const formattedPrice = computed(() => {
    return props.course.price.toLocaleString();
});

const openPlayer = () => {
    alert("Открытие плеера курса...");
};
</script>