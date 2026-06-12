<template>
    <div>
        <section class="hero-section bg-light py-5">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-4 fw-bold">Учитесь новому онлайн</h1>
                        <p class="lead">Тысячи курсов от лучших преподавателей</p>
                        <router-link to="/courses" class="btn btn-danger btn-lg">
                            <svg class="icon icon-sm me-1"><use href="/images/icons.svg#icon-search"></use></svg> Найти курс
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5">
            <div class="container">
                <h2 class="text-center mb-5 fw-bold">Популярные курсы</h2>
                
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-danger" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>
                    <p class="text-muted mt-2">Загрузка популярных курсов...</p>
                </div>

                <div v-else-if="error" class="alert alert-danger text-center" role="alert">
                    Ошибка при загрузке курсов: {{ error }}
                </div>

                <div v-else-if="courses && courses.length > 0" class="row g-4" id="popularCourses">
                    <div 
                        v-for="course in courses.slice(0, 3)" 
                        :key="course.id" 
                        class="col-md-6 col-lg-4"
                    >
                        <div class="card h-100 shadow-sm border-0 position-relative">
                            <span v-if="course.levelName" class="badge bg-dark position-absolute top-0 start-0 m-3 opacity-75">
                                {{ course.levelName }}
                            </span>
                            <span v-if="course.oldPrice" class="badge bg-danger position-absolute top-0 end-0 m-3">
                                -{{ Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100) }}%
                            </span>

                            <img 
                                :src="course.image || '/images/course-placeholder.jpg'" 
                                class="card-img-top" 
                                :alt="course.title"
                                style="height: 200px; object-fit: cover;"
                            >
                            
                            <div class="card-body d-flex flex-column p-4">
                                <small class="text-muted text-uppercase fw-semibold mb-1 block">
                                    {{ course.subjectName || 'Курс' }}
                                </small>
                                
                                <h5 class="card-title fw-bold mb-2 line-clamp">
                                    {{ course.title }}
                                </h5>
                                
                                <p class="card-text text-muted small flex-grow-1 line-clamp-3">
                                    {{ course.description }}
                                </p>
                                
                                <div class="d-flex justify-content-between align-items-center my-3 pt-3 border-top">
                                    <div class="small text-muted text-truncate me-2">
                                        {{ course.instructor }}
                                    </div>
                                    <div class="d-flex align-items-center flex-shrink-0">
                                        <svg class="icon icon-sm text-warning me-1"><use href="/images/icons.svg#icon-star"></use></svg>
                                        <span class="fw-bold small">{{ course.rating }}</span>
                                        <span class="text-muted small ms-1">({{ course.reviews }})</span>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center mt-auto pt-2">
                                    <div>
                                        <span class="fs-4 fw-bold text-danger">{{ course.price }} ₽</span>
                                        <del v-if="course.oldPrice" class="text-muted small d-block">{{ course.oldPrice }} ₽</del>
                                    </div>
                                    <router-link :to="`/course/${course.id}`" class="btn btn-outline-danger">
                                        Подробнее
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-5">
                    <p class="text-muted">Доступных курсов пока нет.</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import useCourses from '../composables/useCourses'; // Проверьте правильность пути к папке composables

const { courses, loading, error, fetchCourses } = useCourses();

onMounted(async () => {
    await fetchCourses(1);
});
</script>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.1) !important;
}
</style>