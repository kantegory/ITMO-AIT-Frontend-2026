<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import EventCard from "../components/common/EventCard.vue";
import PageLoading from "../components/common/PageLoading.vue";
import { fetchJson } from "../services/api";
import { matchesDateRange } from "../utils/formatters";

const events = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

const formFilters = reactive({
  type: "all",
  date: "all",
  city: "all"
});

const appliedFilters = reactive({
  type: "all",
  date: "all",
  city: "all"
});

const filteredEvents = computed(() => events.value.filter((event) => {
  const typeMatch = appliedFilters.type === "all" || event.type === appliedFilters.type;
  const cityMatch = appliedFilters.city === "all" || event.city === appliedFilters.city;
  const dateMatch = matchesDateRange(event.dateTime, appliedFilters.date);

  return typeMatch && cityMatch && dateMatch;
}));

function applyFilters() {
  appliedFilters.type = formFilters.type;
  appliedFilters.date = formFilters.date;
  appliedFilters.city = formFilters.city;
}

function resetFilters() {
  formFilters.type = "all";
  formFilters.date = "all";
  formFilters.city = "all";
  applyFilters();
}

async function loadEvents() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    events.value = await fetchJson("/events");
  } catch (error) {
    errorMessage.value = `${error.message} Запустите mock API командой npm run api.`;
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadEvents);
</script>

<template>
  <div class="container">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
      <div>
        <h1 class="h2 fw-bold mb-1">Поиск мероприятий</h1>
        <p class="text-secondary mb-0">
          Найдено событий:
          <span class="fw-bold" aria-live="polite" aria-atomic="true">{{ filteredEvents.length }}</span>
        </p>
      </div>
    </div>

    <div class="row g-4">
      <aside class="col-lg-3">
        <section class="card filter-sticky" aria-labelledby="filtersTitle">
          <div class="card-body">
            <h2 id="filtersTitle" class="h5 fw-bold">Фильтры</h2>
            <form class="d-grid gap-3" @submit.prevent="applyFilters">
              <fieldset class="d-grid gap-3 mb-0">
                <legend class="form-legend">Параметры поиска</legend>

                <div>
                  <label for="eventType" class="form-label">Тип</label>
                  <select id="eventType" v-model="formFilters.type" class="form-select">
                    <option value="all">Все</option>
                    <option value="concert">Концерты</option>
                    <option value="theater">Театр</option>
                    <option value="festival">Фестивали</option>
                    <option value="sport">Спорт</option>
                  </select>
                </div>

                <div>
                  <label for="eventDate" class="form-label">Дата</label>
                  <select id="eventDate" v-model="formFilters.date" class="form-select">
                    <option value="all">Любая</option>
                    <option value="week">Ближайшие 7 дней</option>
                    <option value="month">Ближайший месяц</option>
                  </select>
                </div>

                <div>
                  <label for="eventCity" class="form-label">Город</label>
                  <select id="eventCity" v-model="formFilters.city" class="form-select">
                    <option value="all">Все города</option>
                    <option value="moscow">Москва</option>
                    <option value="spb">Санкт-Петербург</option>
                    <option value="kazan">Казань</option>
                  </select>
                </div>
              </fieldset>

              <button type="submit" class="btn btn-primary">Применить</button>
              <button type="button" class="btn btn-outline-secondary" @click="resetFilters">Сбросить</button>
            </form>
          </div>
        </section>
      </aside>

      <section class="col-lg-9" aria-labelledby="resultsTitle">
        <h2 id="resultsTitle" class="visually-hidden">Результаты поиска</h2>

        <div v-if="errorMessage" class="alert alert-danger" role="status" aria-live="polite">
          {{ errorMessage }}
        </div>

        <PageLoading v-else-if="isLoading">Загрузка списка событий из mock API...</PageLoading>

        <template v-else>
          <div v-if="filteredEvents.length" class="row g-3 g-lg-4" role="list" aria-live="polite">
            <div v-for="event in filteredEvents" :key="event.id" class="col-md-6 event-card" role="listitem">
              <EventCard :event="event" />
            </div>
          </div>

          <div v-else class="alert alert-secondary mt-4" role="status" aria-live="polite">
            По выбранным фильтрам ничего не найдено. Измените параметры и попробуйте снова.
          </div>
        </template>
      </section>
    </div>
  </div>
</template>
