<script setup>
defineProps({
  filters: {
    type: Object,
    required: true
  }
});

defineEmits(["reset"]);
</script>

<template>
  <form class="filters-card row g-3 align-items-end" @submit.prevent>
    <div class="col-lg-4">
      <label class="form-label" for="destination-search">Название</label>
      <input
        id="destination-search"
        v-model.trim="filters.search"
        class="form-control"
        type="search"
        placeholder="Например, Казань"
      >
    </div>
    <div class="col-sm-4 col-lg-2">
      <label class="form-label" for="type">Тип отдыха</label>
      <select id="type" v-model="filters.type" class="form-select">
        <option value="all">Любой</option>
        <option value="city">Город</option>
        <option value="nature">Природа</option>
      </select>
    </div>
    <div class="col-sm-4 col-lg-2">
      <label class="form-label" for="budget">Бюджет</label>
      <select id="budget" v-model="filters.budget" class="form-select">
        <option value="all">Любой</option>
        <option value="low">До 30 000 ₽</option>
        <option value="medium">До 60 000 ₽</option>
        <option value="high">От 60 000 ₽</option>
      </select>
    </div>
    <div class="col-sm-4 col-lg-2">
      <label class="form-label" for="duration">Длительность</label>
      <select id="duration" v-model="filters.duration" class="form-select">
        <option value="all">Любая</option>
        <option value="short">До 3 дней</option>
        <option value="medium">4–7 дней</option>
        <option value="long">Более недели</option>
      </select>
    </div>
    <div class="col-lg-2 d-grid">
      <button class="btn btn-outline-secondary" type="button" @click="$emit('reset')">
        Сбросить
      </button>
    </div>
  </form>
</template>
