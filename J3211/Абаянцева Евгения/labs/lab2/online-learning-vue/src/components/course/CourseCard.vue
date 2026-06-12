<template>
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card course-card h-100">
            <div class="position-relative">
                <img 
                    :src="course.image" 
                    class="card-img-top" 
                    :alt="course.title" 
                    style="height: 200px; object-fit: cover;"
                >
                <span 
                    v-if="discount > 0" 
                    class="badge bg-danger position-absolute top-0 end-0 m-2"
                >
                    -{{ discount }}%
                </span>
                <span class="badge bg-secondary position-absolute top-0 start-0 m-2">
                    {{ course.levelName }}
                </span>
            </div>
            
            <div class="card-body d-flex flex-column">
                <small class="text-muted mb-1">{{ course.subjectName }}</small>
                
                <h5 class="card-title">{{ course.title }}</h5>
                
                <p class="card-text text-muted small flex-grow-1">
                    {{ truncateText(course.description, 100) }}
                </p>
                
                <div class="mb-2 d-flex align-items-center">
                    <i class="bi bi-person-fill text-danger me-2" aria-hidden="true"></i>
                    <small>{{ course.instructor }}</small>
                </div>
                
                <div class="mb-2 d-flex align-items-center">
                    <i class="bi bi-star-fill text-warning me-2" aria-hidden="true"></i>
                    <strong>{{ course.rating }}</strong>
                    <small class="text-muted ms-1">({{ course.reviews }} отзывов)</small>
                </div>
                
                <div class="mt-auto pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small v-if="course.oldPrice" class="text-muted text-decoration-line-through me-2">
                                {{ course.oldPrice }} ₽
                            </small>
                            <h4 class="text-danger mb-0 d-inline">
                                {{ course.price }} ₽
                            </h4>
                        </div>
                        <router-link 
                            :to="{ name: 'course-detail', params: { id: course.id } }" 
                            class="btn btn-danger btn-sm d-inline-flex align-items-center"
                        >
                            Подробнее
                            <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    course: {
        type: Object,
        required: true,
        validator: (value) => value && value.id && value.title
    }
});

const discount = computed(() => {
    if (!props.course.oldPrice || props.course.oldPrice <= props.course.price) return 0;
    return Math.round((1 - props.course.price / props.course.oldPrice) * 100);
});

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...'; // Исправлено на стандартный substring
}
</script>

<style scoped>
.course-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.card-title {
    font-weight: 600;
    color: var(--text-primary);
}
</style>