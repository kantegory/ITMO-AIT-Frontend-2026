<script setup>
const query = defineModel('query', { type: String, default: '' })
const type = defineModel('type', { type: String, default: 'all' })
const sortKey = defineModel('sortKey', { type: String, default: 'downloads' })

const emit = defineEmits(['search'])
</script>

<template>
  <div class="hub-card d-flex flex-column gap-3">
    <div>
      <label class="form-label fw-semibold" for="searchInput">Поиск</label>
      <input
        id="searchInput"
        v-model="query"
        class="form-control"
        placeholder="Например: bert, translation, imdb"
        @keydown.enter="emit('search')"
      />
    </div>

    <div>
      <label class="form-label fw-semibold" for="typeFilter">Тип</label>
      <select id="typeFilter" v-model="type" class="form-select">
        <option value="all">Все</option>
        <option value="model">Модели</option>
        <option value="dataset">Датасеты</option>
      </select>
    </div>

    <div>
      <label class="form-label fw-semibold" for="sortSelect">Сортировка</label>
      <select id="sortSelect" v-model="sortKey" class="form-select">
        <option value="downloads">По загрузкам</option>
        <option value="likes">По лайкам</option>
        <option value="updatedAt">По дате обновления</option>
      </select>
    </div>

    <button class="btn btn-primary" type="button" @click="emit('search')">Найти</button>
  </div>
</template>
