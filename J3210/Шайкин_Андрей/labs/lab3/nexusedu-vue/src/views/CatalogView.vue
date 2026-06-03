<template>
  <main class="container mt-5 mb-5">
    <h1 class="visually-hidden">Каталог учебных курсов</h1>
    
    <div class="row g-4">
      <aside class="col-lg-3">
        <CatalogFilters 
          v-model:searchQuery="searchQuery"
          v-model:selectedCategory="selectedCategory"
          v-model:maxPrice="maxPrice"
          v-model:selectedLevels="selectedLevels"
        />
      </aside>

      <section class="col-lg-9" aria-label="Список курсов">
        <h2 class="visually-hidden">Доступные курсы</h2>

        <div v-if="isLoading" class="text-center mt-5" aria-live="polite">
          <span class="spinner-border text-primary" role="status"></span> Загрузка...
        </div>

        <div v-else-if="error" class="text-center mt-5">
          <h3 class="text-danger">{{ error }}</h3>
        </div>

        <div v-else-if="filteredCourses.length === 0" class="text-center mt-5">
          <h3 class="opacity-75">По вашему запросу ничего не найдено</h3>
        </div>

        <TransitionGroup name="course-list" tag="div" class="row g-4 position-relative" v-else>
          <CourseCard 
              v-for="course in filteredCourses" 
              :key="course.id" 
              :course="course" 
          />
        </TransitionGroup>
      </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import CourseCard from '@/components/catalog/CourseCard.vue'
import CatalogFilters from '@/components/catalog/CatalogFilters.vue'
import { useCourses } from '@/composables/useCourses'

const { 
  filteredCourses, isLoading, error, fetchCourses,
  searchQuery, selectedCategory, maxPrice, selectedLevels 
} = useCourses()

onMounted(fetchCourses)
</script>