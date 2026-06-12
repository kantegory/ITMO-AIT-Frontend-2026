<template>
    <div class="container py-5">
        <h1 class="mb-4">Каталог курсов</h1>
        
        <div class="row">
            <aside class="col-lg-3 mb-4">
                <CourseFilters 
                    :filters="filters" 
                    @apply="applyFilters" 
                    @reset="resetFilters" 
                />
            </aside>
            
            <section class="col-lg-9">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <p class="text-muted mb-0">Найдено курсов: <strong>{{ pagination.total }}</strong></p>
                    <select v-model="filters.sort" @change="applyFilters" class="form-select w-auto">
                        <option value="popular">По популярности</option>
                        <option value="price-asc">Цена: по возрастанию</option>
                        <option value="price-desc">Цена: по убыванию</option>
                        <option value="rating">По рейтингу</option>
                    </select>
                </div>
                
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-danger" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>
                </div>
                
                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>
                
                <div v-else class="row">
                    <CourseCard 
                        v-for="course in courses" 
                        :key="course.id" 
                        :course="course" 
                    />
                </div>
                
                <nav v-if="pagination.total > pagination.perPage" class="mt-4">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                            <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage - 1)">
                                <svg class="icon icon-sm"><use href="/images/icons.svg#icon-arrow-left"></use></svg>
                            </a>
                        </li>
                        
                        <li 
                            v-for="page in totalPages" 
                            :key="page" 
                            class="page-item" 
                            :class="{ active: page === pagination.currentPage }"
                        >
                            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                        </li>
                        
                        <li class="page-item" :class="{ disabled: pagination.currentPage === totalPages }">
                            <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage + 1)">
                                <svg class="icon icon-sm"><use href="/images/icons.svg#icon-arrow-right"></use></svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </section>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import CourseCard from '../components/course/CourseCard.vue';
import CourseFilters from '../components/course/CourseFilters.vue';
import useCourses from '../composables/useCourses';

const { 
    courses, 
    loading, 
    error, 
    filters, 
    pagination, 
    fetchCourses, 
    applyFilters, 
    resetFilters 
} = useCourses();

const totalPages = computed(() => Math.ceil(pagination.total / pagination.perPage));

function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
        fetchCourses(page);
    }
}

onMounted(() => {
    fetchCourses(1);
});
</script>