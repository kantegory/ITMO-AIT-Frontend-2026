<template>
  <div class="glass p-4 sticky-top" style="top: 20px;">
    <h2 class="fw-bold fs-5 mb-4">Фильтры</h2>
    <form @submit.prevent aria-label="Форма фильтрации курсов">
      
      <div class="mb-3">
        <label for="searchCourse" class="form-label opacity-75">Поиск</label>
        <input v-model="searchQuery" type="text" id="searchCourse" class="form-control glass-input" placeholder="Например: Python...">
      </div>
      
      <div class="mb-3">
        <label for="categoryFilter" class="form-label opacity-75">Направление</label>
        <select v-model="selectedCategory" id="categoryFilter" class="form-select glass-input">
          <option value="">Все направления</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Data Science">Data Science</option>
          <option value="AI">AI / Deep Learning</option>
        </select>
      </div>
      
      <div class="mb-4 mt-4">
        <label for="priceRange" class="form-label opacity-75 d-flex justify-content-between w-100">
          <span>Цена</span><span class="fw-bold">До {{ maxPrice.toLocaleString('ru-RU') }} ₽</span>
        </label>
        <input v-model.number="maxPrice" type="range" class="form-range" min="0" max="150000" step="5000" id="priceRange">
      </div>
      
      <div class="mb-4">
        <label class="form-label opacity-75">Уровень</label>
        <div class="form-check mb-2 d-flex align-items-center gap-2">
          <input v-model="selectedLevels" class="form-check-input glass-input m-0" type="checkbox" id="lvl1" value="Junior">
          <label class="form-check-label" for="lvl1">Junior</label>
        </div>
        <div class="form-check mb-2 d-flex align-items-center gap-2">
          <input v-model="selectedLevels" class="form-check-input glass-input m-0" type="checkbox" id="lvl2" value="Middle">
          <label class="form-check-label" for="lvl2">Middle</label>
        </div>
        <div class="form-check d-flex align-items-center gap-2">
          <input v-model="selectedLevels" class="form-check-input glass-input m-0" type="checkbox" id="lvl3" value="Senior">
          <label class="form-check-label" for="lvl3">Senior</label>
        </div>
      </div>
      
    </form>
  </div>
</template>
<script setup>
const searchQuery = defineModel('searchQuery')
const selectedCategory = defineModel('selectedCategory')
const maxPrice = defineModel('maxPrice')
const selectedLevels = defineModel('selectedLevels')
</script>