<template>
  <div class="card shadow-sm border-0">
    <div class="card-header bg-danger text-white py-3">
      <h5 class="card-title mb-0 d-flex align-items-center">
        <i class="bi bi-funnel-fill me-2"></i> Фильтры
      </h5>
    </div>
    <div class="card-body">
      <div class="mb-4">
        <label for="subjectSelect" class="form-label fw-bold text-muted small text-uppercase">Предмет</label>
        <select 
          id="subjectSelect" 
          v-model="filters.subject" 
          class="form-select"
        >
          <option value="">Все предметы</option>
          <option value="Искусственный интеллект">Искусственный интеллект</option>
          <option value="Физика">Физика</option>
          <option value="Математика">Математика</option>
          <option value="Data Science">Data Science</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold text-muted small text-uppercase d-block">Уровень</label>
        <div class="form-check mb-2">
          <input class="form-check-input" type="checkbox" value="Начальный" id="lvlBeginner" v-model="filters.level">
          <label class="form-check-label" for="lvlBeginner">Начальный</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="checkbox" value="Средний" id="lvlMedium" v-model="filters.level">
          <label class="form-check-label" for="lvlMedium">Средний</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="checkbox" value="Продвинутый" id="lvlAdvanced" v-model="filters.level">
          <label class="form-check-label" for="lvlAdvanced">Продвинутый</label>
        </div>
      </div>

      <div class="mb-4">
        <label for="priceRange" class="form-label fw-bold text-muted small text-uppercase d-flex justify-content-between">
          <span>Цена до:</span>
          <span class="text-danger fw-bold">{{ filters.maxPrice }} ₽</span>
        </label>
        <input 
          type="range" 
          class="form-range" 
          id="priceRange" 
          min="0" 
          max="15000" 
          step="500" 
          v-model.number="filters.maxPrice"
        >
      </div>

      <div class="d-grid gap-2 pt-2 border-top">
        <button type="button" class="btn btn-danger btn-block d-flex align-items-center justify-content-center py-2 shadow-sm">
          <i class="bi bi-search me-2"></i> Применить
        </button>
        <button @click="resetFilters" type="button" class="btn btn-outline-danger d-flex align-items-center justify-content-center py-2">
          <i class="bi bi-arrow-counterclockwise me-2"></i> Сбросить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import useCourses from '../../composables/useCourses';

const { filters, resetFilters } = useCourses();
</script>