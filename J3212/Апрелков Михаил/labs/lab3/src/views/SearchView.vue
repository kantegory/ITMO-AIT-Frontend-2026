<template>
  <div class="page-wrapper">
    <AppHeader />
    <main>
      <section class="hero-section bg-light border-bottom">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-7">
              <h1 class="hero-title mb-2">Найдите следующий маршрут для путешествия</h1>
              <p class="text-muted mb-0">
                Tripatropa помогает быстро собрать удобный маршрут с учётом
                бюджета, формата отдыха и длительности поездки.
              </p>
            </div>
            <div class="col-lg-5 mt-3 mt-lg-0 text-lg-end text-muted-sm">
              <span class="badge rounded-pill bg-primary-subtle text-primary me-2 hero-badge">
                <i class="bi bi-globe2 me-1"></i> 120+ направлений
              </span>
              <span class="badge rounded-pill bg-success-subtle text-success hero-badge">
                <i class="bi bi-people me-1"></i> Совместное планирование
              </span>
            </div>
          </div>
        </div>
      </section>
      <section class="py-4">
        <div class="container">
          <SearchFilters :count-text="countText" @change="onFilters" />
          <div v-if="loading" class="text-muted-sm">Загрузка маршрутов…</div>
          <div v-else-if="error" class="alert alert-danger">
            Не удалось загрузить маршруты.
          </div>
          <div v-else class="row g-4">
            <DestinationCard
              v-for="d in visibleSorted"
              :key="d.id"
              :destination="d"
              :saved="savedSet.has(String(d.id))"
              @toggle-save="onToggleSave"
            />
            <div v-if="!visibleSorted.length" class="col-12">
              <p class="text-muted-sm mb-0">Ничего не найдено по выбранным фильтрам.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import SearchFilters from "../components/SearchFilters.vue";
import DestinationCard from "../components/DestinationCard.vue";
import {
  useDestinations,
  getDurationGroup,
  getRoutesWord
} from "../composables/useDestinations.js";
import { useAuth } from "../composables/useAuth.js";
import { savedApi } from "../api/api.js";

const { destinations, loading, error, fetchAll } = useDestinations();
const { currentUser } = useAuth();
const savedItems = ref([]);
const filters = ref({
  query: "",
  type: "any",
  budget: 200000,
  duration: "any",
  sort: "popular"
});

const savedSet = computed(
  () => new Set(savedItems.value.map((item) => String(item.destinationId)))
);

const filtered = computed(() => {
  const q = filters.value.query.trim().toLowerCase();
  return destinations.value.filter((d) => {
    if (q && !String(d.title).toLowerCase().includes(q)) return false;
    if (filters.value.type !== "any" && d.type !== filters.value.type) return false;
    if (Number(d.budget) > Number(filters.value.budget)) return false;
    if (
      filters.value.duration !== "any" &&
      getDurationGroup(d.durationDays) !== filters.value.duration
    ) {
      return false;
    }
    return true;
  });
});

const visibleSorted = computed(() => {
  const arr = [...filtered.value];
  if (filters.value.sort === "price") {
    arr.sort((a, b) => Number(a.budget) - Number(b.budget));
  } else if (filters.value.sort === "duration") {
    arr.sort((a, b) => Number(a.durationDays) - Number(b.durationDays));
  }
  return arr;
});

const countText = computed(
  () => `${visibleSorted.value.length} ${getRoutesWord(visibleSorted.value.length)}`
);

function onFilters(val) {
  filters.value = val;
}

async function loadSaved() {
  if (!currentUser.value) {
    savedItems.value = [];
    return;
  }
  try {
    savedItems.value = await savedApi.listByUser(currentUser.value.id);
  } catch (e) {
    savedItems.value = [];
  }
}

async function onToggleSave(destination) {
  if (!currentUser.value) {
    alert("Войдите, чтобы сохранять маршруты");
    return;
  }
  const did = String(destination.id);
  const existing = savedItems.value.find(
    (item) => String(item.destinationId) === did
  );
  try {
    if (existing) {
      await savedApi.remove(existing.id);
      savedItems.value = savedItems.value.filter((item) => item.id !== existing.id);
    } else {
      const created = await savedApi.add(currentUser.value.id, destination.id);
      savedItems.value = [...savedItems.value, created];
    }
  } catch (e) {
    alert("Ошибка сохранения маршрута");
  }
}

onMounted(async () => {
  await fetchAll();
  await loadSaved();
});
</script>
