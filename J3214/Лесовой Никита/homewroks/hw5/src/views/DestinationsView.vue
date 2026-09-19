<script setup>
import { onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import DestinationList from "../components/DestinationList.vue";
import SearchForm from "../components/SearchForm.vue";
import { useDestinationsStore } from "../stores/destinations";

const destinationsStore = useDestinationsStore();
const { search, filteredDestinations, isLoading, error } = storeToRefs(destinationsStore);

const form = reactive({
  name: "",
  description: "",
  days: 3,
  price: 30000,
  emoji: "✈️"
});

async function submitDestination() {
  const created = await destinationsStore.createDestination({
    name: form.name.trim(),
    description: form.description.trim(),
    days: Number(form.days),
    price: Number(form.price),
    emoji: form.emoji.trim() || "✈️"
  });

  if (created) {
    form.name = "";
    form.description = "";
    form.days = 3;
    form.price = 30000;
    form.emoji = "✈️";
  }
}

onMounted(() => {
  destinationsStore.loadDestinations();
});
</script>

<template>
  <BaseLayout>
    <header class="hero">
      <div class="container">
        <p class="eyebrow">Vue Router · Axios · Pinia</p>
        <h1>Куда отправимся дальше?</h1>
        <p class="hero-text">Направления загружаются из мокового API и хранятся в общем состоянии приложения.</p>
      </div>
    </header>

    <section class="container content" aria-labelledby="directions-title">
      <h2 id="directions-title">Направления</h2>
      <SearchForm v-model="search" @reset="destinationsStore.resetSearch" />

      <div v-if="error" class="alert alert-danger mt-3" role="alert">{{ error }}</div>
      <div v-if="isLoading" class="alert alert-info mt-3" role="status">Загружаем направления…</div>

      <template v-else>
        <p class="result-count" aria-live="polite">Найдено: {{ filteredDestinations.length }}</p>
        <DestinationList :destinations="filteredDestinations" />
      </template>
    </section>

    <section class="container pb-5" aria-labelledby="add-title">
      <div class="form-card">
        <h2 class="h3" id="add-title">Добавить направление</h2>
        <form class="row g-3" @submit.prevent="submitDestination">
          <div class="col-md-6">
            <label class="form-label" for="name">Название</label>
            <input class="form-control" id="name" v-model="form.name" required>
          </div>
          <div class="col-md-2">
            <label class="form-label" for="days">Дней</label>
            <input class="form-control" id="days" type="number" min="1" v-model="form.days" required>
          </div>
          <div class="col-md-3">
            <label class="form-label" for="price">Стоимость</label>
            <input class="form-control" id="price" type="number" min="0" v-model="form.price" required>
          </div>
          <div class="col-md-1">
            <label class="form-label" for="emoji">Значок</label>
            <input class="form-control" id="emoji" v-model="form.emoji" maxlength="4">
          </div>
          <div class="col-12">
            <label class="form-label" for="description">Описание</label>
            <textarea class="form-control" id="description" rows="3" v-model="form.description" required></textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-primary" type="submit">Добавить</button>
          </div>
        </form>
      </div>
    </section>
  </BaseLayout>
</template>
