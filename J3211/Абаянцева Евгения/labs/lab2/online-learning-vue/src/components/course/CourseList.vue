<template>
  <div class="row">
    <div class="col-lg-3 mb-4">
      <CourseFilters />
    </div>
    
    <section class="col-lg-9" aria-label="Список курсов">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <p class="text-muted mb-0">
          Найдено курсов: <span class="fw-bold">{{ totalCourses }}</span>
        </p>
        
        <label for="sortCourses" class="visually-hidden">Сортировка курсов</label>
        <select 
          class="form-select w-auto" 
          id="sortCourses" 
          v-model="filters.sort" 
          aria-label="Сортировка курсов"
        >
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

      <div v-else-if="error" class="alert alert-danger" role="alert">
        Ошибка при загрузке данных: {{ error }}
      </div>

      <div v-else>
        <div class="row" id="coursesList" role="list">
          <div v-if="courses.length === 0" class="col-12 text-center text-muted py-5">
            Курсы по выбранным критериям не найдены.
          </div>
          
          <CourseCard 
            v-for="course in courses" 
            :key="course.id" 
            :course="course" 
          />
        </div>

        <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-5" aria-label="Навигация по страницам">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
              <button 
                class="page-link" 
                @click="changePage(pagination.currentPage - 1)" 
                :disabled="pagination.currentPage === 1"
                aria-label="Предыдущая страница"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>

            <li 
              v-for="page in totalPages" 
              :key="page" 
              class="page-item" 
              :class="{ active: pagination.currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>

            <li class="page-item" :class="{ disabled: pagination.currentPage === totalPages }">
              <button 
                class="page-link" 
                @click="changePage(pagination.currentPage + 1)" 
                :disabled="pagination.currentPage === totalPages"
                aria-label="Следующая страница"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import CourseFilters from './CourseFilters.vue';
import CourseCard from './CourseCard.vue';
import useCourses from '../composables/useCourses';

const {
  courses,
  loading,
  error,
  filters,
  pagination,
  totalCourses,
  fetchCourses
} = useCourses();

const totalPages = computed(() => {
  return Math.ceil(totalCourses.value / pagination.perPage);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
.pagination {
  margin-bottom: 0;
}
.page-link {
  color: #0d6efd;
  cursor: pointer;
}
.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}
.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #f8f9fa;
}
</style>