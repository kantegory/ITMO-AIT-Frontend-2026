<template>
  <base-layout>
    <!-- Поисковая шапка — из search.html -->
    <div class="bg-primary py-4 rounded mb-4">
      <div>
        <h4 class="text-white fw-bold mb-3">Найдите свой курс</h4>
        <div class="input-group input-group-lg">
          <span class="input-group-text bg-white border-0" aria-hidden="true">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input type="text" class="form-control border-0" v-model="searchQuery"
            placeholder="Например: Python, дизайн..." aria-label="Поиск курса" />
          <button class="btn btn-warning fw-semibold" type="button">Найти</button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Фильтры -->
      <div class="col-12 col-md-3">
        <div class="card border-0 shadow-sm p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">Фильтры</h6>
            <button class="btn btn-link btn-sm p-0 text-muted text-decoration-none" @click="resetFilters">Сбросить</button>
          </div>

          <p class="text-muted small mb-2 fw-semibold">ПРЕДМЕТ</p>
          <div class="mb-3">
            <div class="form-check" v-for="cat in categories" :key="cat">
              <input class="form-check-input" type="checkbox" :id="`cat-${cat}`"
                :value="cat" v-model="checkedCats" />
              <label class="form-check-label small" :for="`cat-${cat}`">{{ cat }}</label>
            </div>
          </div>

          <hr />
          <p class="text-muted small mb-2 fw-semibold">УРОВЕНЬ</p>
          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="level" id="lvlAll" value="" v-model="selectedLevel" />
              <label class="form-check-label small" for="lvlAll">Все уровни</label>
            </div>
            <div class="form-check" v-for="lvl in levels" :key="lvl">
              <input class="form-check-input" type="radio" name="level" :id="`lvl-${lvl}`"
                :value="lvl" v-model="selectedLevel" />
              <label class="form-check-label small" :for="`lvl-${lvl}`">{{ lvl }}</label>
            </div>
          </div>

          <hr />
          <p class="text-muted small mb-2 fw-semibold">ЦЕНА</p>
          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="price" id="priceAll" value="" v-model="selectedPrice" />
              <label class="form-check-label small" for="priceAll">Любая</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="price" id="priceFree" value="free" v-model="selectedPrice" />
              <label class="form-check-label small" for="priceFree">Бесплатные</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="price" id="pricePaid" value="paid" v-model="selectedPrice" />
              <label class="form-check-label small" for="pricePaid">Платные</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Список курсов -->
      <div class="col-12 col-md-9">
        <!-- Спиннер -->
        <div v-if="loading" class="text-center py-5" role="status" aria-label="Загрузка курсов">
          <div class="spinner-border text-primary" aria-hidden="true"></div>
          <p class="text-muted mt-3">Загружаем курсы...</p>
        </div>

        <template v-else>
          <p class="text-muted mb-3 small" aria-live="polite">Найдено: {{ filteredCourses.length }} курсов</p>

          <div class="row g-3">
            <div class="col-12 col-sm-6 col-xl-4" v-for="course in filteredCourses" :key="course.id">
              <course-card v-bind="course" />  // сокращенная запись вместо отдельных props
            </div>
          </div>

          <div v-if="filteredCourses.length === 0" class="text-center py-5" role="alert">
            <i class="bi bi-search text-muted" style="font-size:3rem;" aria-hidden="true"></i>
            <p class="text-muted mt-3">Курсы не найдены. Попробуйте изменить фильтры.</p>
            <button class="btn btn-outline-primary btn-sm" @click="resetFilters">Сбросить фильтры</button>
          </div>
        </template>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
// CoursesPage использует два composable:
// - useFilters для логики фильтрации (вынесена из search.html)
// - storeToRefs для реактивного доступа к данным store

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useCoursesStore from '@/stores/courses'
import { useFilters }  from '@/composables/useFilters'

import BaseLayout from '@/layouts/BaseLayout.vue'
import CourseCard from '@/components/CourseCard.vue'

const coursesStore = useCoursesStore()
const { courses, loading } = storeToRefs(coursesStore)

const {
  searchQuery, checkedCats, selectedLevel, selectedPrice,
  filteredCourses, categories, levels, resetFilters
} = useFilters(courses)

onMounted(() => coursesStore.loadCourses())
</script>
