<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import DestinationFilters from "../components/DestinationFilters.vue";
import DestinationList from "../components/DestinationList.vue";
import { useDestinationsStore } from "../stores/destinations";

const destinationsStore = useDestinationsStore();
const { filteredDestinations, filters, isLoading, error } = storeToRefs(destinationsStore);

onMounted(() => destinationsStore.loadDestinations());
</script>

<template>
  <BaseLayout>
    <header class="hero">
      <div class="container">
        <p class="eyebrow">Путешествия по России</p>
        <h1>Соберите маршрут для следующей поездки</h1>
        <p class="hero-text">
          Выберите направление, посмотрите программу и прогноз погоды, а затем сохраните маршрут в профиле.
        </p>
        <a class="btn btn-light btn-lg mt-4" href="#directions">Выбрать направление</a>
      </div>
    </header>

    <section id="directions" class="container content" aria-labelledby="directions-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow text-primary">Каталог</p>
          <h2 id="directions-title">Направления</h2>
        </div>
        <span class="result-count">Найдено: {{ filteredDestinations.length }}</span>
      </div>

      <DestinationFilters :filters="filters" @reset="destinationsStore.resetFilters" />

      <div v-if="error" class="alert alert-danger mt-4" role="alert">{{ error }}</div>
      <div v-if="isLoading" class="loading-card" role="status">Загружаем направления…</div>
      <DestinationList v-else class="mt-4" :destinations="filteredDestinations" />
    </section>
  </BaseLayout>
</template>
