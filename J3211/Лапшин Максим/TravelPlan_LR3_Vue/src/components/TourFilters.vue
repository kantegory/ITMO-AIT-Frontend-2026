<script setup>
defineProps({
  model: { type: Object, required: true },
  options: { type: Object, required: true },
})
defineEmits(['reset'])
</script>

<template>
  <form class="card shadow-sm p-3 mb-4" aria-label="Фильтр туров" @submit.prevent>
    <div class="row g-3 align-items-end">
      <div class="col-lg-4">
        <label class="form-label" for="search">Направление</label>
        <input id="search" v-model.trim="model.search" type="search" class="form-control" placeholder="Например, Париж">
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label" for="type">Тип отдыха</label>
        <select id="type" v-model="model.type" class="form-select">
          <option value="all">Все типы</option>
          <option v-for="type in options.types" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label" for="budget">Бюджет</label>
        <select id="budget" v-model="model.budget" class="form-select">
          <option value="all">Любой</option>
          <option v-for="range in options.priceRanges" :key="range.id" :value="range.id">{{ range.label }}</option>
        </select>
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label" for="duration">Дней</label>
        <select id="duration" v-model="model.duration" class="form-select">
          <option value="">Любая</option>
          <option v-for="duration in options.durations" :key="duration" :value="duration">{{ duration }}</option>
        </select>
      </div>
      <div class="col-lg-2 d-grid">
        <button type="button" class="btn btn-outline-secondary" @click="$emit('reset')">Сбросить</button>
      </div>
    </div>
  </form>
</template>
