<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useImageHelper } from "../composables/useImageHelper.js";

const { getImageSrc } = useImageHelper();

const allEvents = ref([]);
const filteredEvents = ref([]);
const loading = ref(true);

const filterDate = ref("");
const filterType = ref("");
const filterCity = ref("");

const citySuggestions = ref([]);
const showCitySuggestions = ref(false);

const allCities = computed(() => {
  const cities = new Set();
  allEvents.value.forEach((event) => {
    const city = event.place?.split(",")[0]?.trim();
    if (city) cities.add(city);
  });
  return Array.from(cities).sort();
});

const updateCitySuggestions = () => {
  const query = filterCity.value.toLowerCase().trim();
  if (!query) {
    citySuggestions.value = [];
    showCitySuggestions.value = false;
    return;
  }
  citySuggestions.value = allCities.value.filter((city) => city.toLowerCase().includes(query));
  showCitySuggestions.value = citySuggestions.value.length > 0;
};

const selectCity = (city) => {
  filterCity.value = city;
  showCitySuggestions.value = false;
};

const onCityInputFocus = () => {
  updateCitySuggestions();
};

const onCityInputBlur = () => {
  setTimeout(() => {
    showCitySuggestions.value = false;
  }, 150);
};

const fetchEvents = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/events");
    allEvents.value = response.data;
    filteredEvents.value = response.data;
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  filteredEvents.value = allEvents.value.filter((event) => {
    const eventCity = event.place?.split(",")[0]?.trim().toLowerCase() || "";
    const matchDate = !filterDate.value || event.date === filterDate.value;
    const matchType = !filterType.value || event.type === filterType.value;
    const matchCity =
      !filterCity.value || eventCity.includes(filterCity.value.toLowerCase().trim());
    return matchDate && matchType && matchCity;
  });
};

const resetFilters = () => {
  filterDate.value = "";
  filterType.value = "";
  filterCity.value = "";
  citySuggestions.value = [];
  showCitySuggestions.value = false;
  filteredEvents.value = allEvents.value;
};

onMounted(fetchEvents);
</script>

<template>
  <div class="home-view container my-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold text-rose">Найти мероприятие</h1>
    </div>

    <section class="search-form card p-4 mb-5 shadow-sm border-0 rounded-4 bg-white">
      <form class="row g-4" @submit.prevent="handleSearch">
        <div class="col-md-4">
          <label class="form-label fw-semibold">Дата</label>
          <input type="date" v-model="filterDate" class="form-control form-control-lg" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold">Тип</label>
          <select v-model="filterType" class="form-select form-select-lg">
            <option value="">Все категории</option>
            <option value="Концерт">Концерт</option>
            <option value="Театр">Театр</option>
            <option value="Выставка">Выставка</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold">Город</label>
          <div class="position-relative">
            <input
              v-model="filterCity"
              type="text"
              class="form-control form-control-lg"
              placeholder="Введите город"
              autocomplete="off"
              @input="updateCitySuggestions"
              @focus="onCityInputFocus"
              @blur="onCityInputBlur"
            />
            <ul
              v-if="showCitySuggestions && citySuggestions.length > 0"
              class="list-group position-absolute w-100 mt-1 shadow-sm"
              style="z-index: 1000; max-height: 200px; overflow-y: auto"
            >
              <li
                v-for="city in citySuggestions"
                :key="city"
                class="list-group-item list-group-item-action py-2"
                @mousedown.prevent="selectCity(city)"
                style="cursor: pointer"
              >
                {{ city }}
              </li>
            </ul>
          </div>
        </div>

        <div class="col-12 d-flex justify-content-center gap-3 mt-2">
          <button type="submit" class="btn btn-rose btn-lg px-5">Найти</button>
          <button type="button" @click="resetFilters" class="btn btn-outline-secondary btn-lg px-5">
            Сброс
          </button>
        </div>
      </form>
    </section>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-rose"></div>
    </div>

    <section v-else class="row g-4">
      <div v-if="filteredEvents.length === 0" class="col-12 text-center py-5 text-muted">
        Ничего не найдено. Попробуйте изменить параметры поиска.
      </div>
      <div v-for="event in filteredEvents" :key="event.id" class="col-md-6 col-lg-4">
        <article class="card event-card h-100 shadow-sm border-0">
          <img
            v-if="event.posterUrl"
            :src="getImageSrc(event.posterUrl)"
            class="card-img-top"
            style="height: 200px; object-fit: cover"
            :alt="event.title"
          />
          <div class="card-body p-4 d-flex flex-column">
            <div class="mb-2">
              <span class="badge bg-rose-subtle text-rose">{{
                event.type || "Без категории"
              }}</span>
            </div>
            <h3 class="h5 fw-bold mb-2">{{ event.title }}</h3>
            <p class="text-muted small mb-1">{{ event.date }}</p>
            <p class="text-muted small mb-3">{{ event.place }}</p>
            <div class="mt-auto pt-2">
              <router-link :to="'/event/' + event.id" class="btn btn-outline-rose w-100">
                Подробнее
              </router-link>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
