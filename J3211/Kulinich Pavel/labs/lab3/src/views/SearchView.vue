<script setup>
import { onMounted, ref, computed } from 'vue';
import { useEvents } from '../composables/useEvents';
import EventCard from '../components/EventCard.vue';

const { events, loading, error, fetchEvents, filterEvents } = useEvents();

const filters = ref({ type: '', date: '', location: '' });
const appliedFilters = ref({ type: '', date: '', location: '' });

const filteredEvents = computed(() => filterEvents(appliedFilters.value));

function applyFilters() {
  appliedFilters.value = { ...filters.value };
}

function resetFilters() {
  filters.value = { type: '', date: '', location: '' };
  appliedFilters.value = { type: '', date: '', location: '' };
}

onMounted(fetchEvents);
</script>

<template>
  <main class="py-5">
    <div class="container">
      <header class="mb-4">
        <h1 class="fw-bold">Поиск мероприятий</h1>
        <p class="text-secondary">Используйте фильтрацию по типу, дате и месту проведения.</p>
      </header>

      <section class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-body p-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label for="typeFilter" class="form-label">Тип</label>
              <select id="typeFilter" v-model="filters.type" class="form-select">
                <option value="">Все типы</option>
                <option value="Концерт">Концерт</option>
                <option value="Театр">Театр</option>
                <option value="Выставка">Выставка</option>
                <option value="Спорт">Спорт</option>
                <option value="Стендап">Стендап</option>
              </select>
            </div>

            <div class="col-md-4">
              <label for="dateFilter" class="form-label">Дата</label>
              <input id="dateFilter" v-model="filters.date" type="date" class="form-control">
            </div>

            <div class="col-md-4">
              <label for="locationFilter" class="form-label">Место</label>
              <input
                id="locationFilter"
                v-model="filters.location"
                type="text"
                class="form-control"
                placeholder="Например, Москва"
              >
            </div>
          </div>

          <div class="d-flex flex-wrap gap-2 mt-3">
            <button class="btn btn-primary" @click="applyFilters">Применить фильтры</button>
            <button class="btn btn-outline-secondary" @click="resetFilters">Сбросить</button>
          </div>
        </div>
      </section>

      <div v-if="loading" class="alert alert-info">Загружаем мероприятия...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <section v-else class="row g-4">
        <div v-if="!filteredEvents.length" class="col-12">
          <div class="alert alert-warning">По заданным фильтрам ничего не найдено.</div>
        </div>
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="col-md-6 col-xl-4"
        >
          <EventCard :event="event" />
        </div>
      </section>
    </div>
  </main>
</template>
