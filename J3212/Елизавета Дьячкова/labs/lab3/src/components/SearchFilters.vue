<template>
  <form class="row g-3 mb-4" aria-label="Фильтры поиска мероприятий" @submit.prevent="onSubmit">
    <div class="col-12 col-md-3">
      <label for="searchQuery" class="form-label">Название или артист</label>
      <input
        id="searchQuery"
        v-model="local.query"
        type="search"
        class="form-control"
        name="q"
        placeholder="Например, концерт"
        autocomplete="off"
        aria-describedby="searchQueryHint"
      />
    </div>
    <div class="col-6 col-md-2">
      <label for="filterType" class="form-label">Тип</label>
      <select id="filterType" v-model="local.type" class="form-select">
        <option value="">Любой</option>
        <option value="concert">Концерт</option>
        <option value="theatre">Театр</option>
        <option value="festival">Фестиваль</option>
      </select>
    </div>
    <div class="col-6 col-md-3">
      <label for="filterDate" class="form-label">Дата (необязательно)</label>
      <div class="d-flex gap-1">
        <input
          id="filterDate"
          v-model="local.date"
          type="text"
          class="form-control flex-grow-1"
          name="filterDate"
          inputmode="text"
          autocomplete="off"
          placeholder="2026-03-29"
          maxlength="10"
          aria-describedby="filterDateHint"
          title="Формат: ГГГГ-ММ-ДД"
        />
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm align-self-end"
          title="Очистить дату"
          aria-label="Очистить дату"
          @click="clearDate"
        >
          ×
        </button>
      </div>
      <p id="filterDateHint" class="form-text small mb-0">
        Введите дату в формате <strong>ГГГГ-ММ-ДД</strong> (как в данных событий).
      </p>
    </div>
    <div class="col-6 col-md-2">
      <label for="filterCity" class="form-label">Город</label>
      <select id="filterCity" v-model="local.city" class="form-select">
        <option value="">Любой</option>
        <option value="spb">Санкт‑Петербург</option>
        <option value="msk">Москва</option>
        <option value="nsk">Новосибирск</option>
        <option value="ptz">Петрозаводск</option>
      </select>
    </div>
    <div class="col-12 col-md-2 d-flex align-items-end">
      <button type="submit" class="btn btn-primary w-100">Найти</button>
    </div>
  </form>
  <p id="searchQueryHint" class="visually-hidden">Поиск по названию, описанию или артисту.</p>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['search'])

const local = reactive({
  query: '',
  type: '',
  date: '',
  city: '',
})

function onSubmit() {
  emit('search', { ...local })
}

function clearDate() {
  local.date = ''
  emit('search', { ...local })
}
</script>
