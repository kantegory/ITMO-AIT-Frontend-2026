<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import WeatherPanel from "../components/WeatherPanel.vue";
import { useAuthStore } from "../stores/auth";
import { useDestinationsStore } from "../stores/destinations";
import { useFormatters } from "../composables/useFormatters";

const route = useRoute();
const authStore = useAuthStore();
const destinationsStore = useDestinationsStore();
const { currentUser, isAuthenticated } = storeToRefs(authStore);
const { selectedDestination, isLoading, error } = storeToRefs(destinationsStore);
const { formatPrice, formatDays } = useFormatters();
const saveMessage = ref("");
const saveError = ref(false);

async function loadPage(id) {
  saveMessage.value = "";
  await destinationsStore.loadDestination(id);
  if (isAuthenticated.value) {
    await destinationsStore.loadSavedRoutes(currentUser.value.id);
  }
}

async function saveRoute() {
  saveMessage.value = "";
  saveError.value = false;

  try {
    saveMessage.value = await destinationsStore.saveRoute(
      currentUser.value.id,
      selectedDestination.value.id
    );
  } catch (requestError) {
    saveError.value = true;
    saveMessage.value = requestError.message;
  }
}

watch(() => route.params.id, loadPage, { immediate: true });
</script>

<template>
  <BaseLayout>
    <section class="container page-section">
      <RouterLink class="back-link" to="/">← Все направления</RouterLink>

      <div v-if="isLoading" class="loading-card">Загружаем маршрут…</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <template v-else-if="selectedDestination">
        <header :class="['destination-hero', selectedDestination.coverClass]">
          <div>
            <p class="eyebrow">{{ selectedDestination.typeLabel }} · {{ selectedDestination.season }}</p>
            <h1>{{ selectedDestination.name }}</h1>
            <p>{{ selectedDestination.description }}</p>
          </div>
          <span class="destination-hero-icon" aria-hidden="true">{{ selectedDestination.emoji }}</span>
        </header>

        <div class="route-facts">
          <div><span>Длительность</span><strong>{{ formatDays(selectedDestination.days) }}</strong></div>
          <div><span>Темп</span><strong>{{ selectedDestination.pace }}</strong></div>
          <div><span>Стоимость</span><strong>от {{ formatPrice(selectedDestination.price) }}</strong></div>
        </div>

        <div v-if="saveMessage" :class="['alert', saveError ? 'alert-danger' : 'alert-success']">
          {{ saveMessage }}
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <section class="detail-card h-100" aria-labelledby="program-title">
              <h2 id="program-title" class="h4">Программа поездки</h2>
              <ol class="program-list">
                <li v-for="item in selectedDestination.program" :key="item">{{ item }}</li>
              </ol>
            </section>
          </div>
          <div class="col-lg-5">
            <section class="detail-card h-100" aria-labelledby="tips-title">
              <h2 id="tips-title" class="h4">Рекомендации</h2>
              <ul class="tips-list">
                <li v-for="item in selectedDestination.recommendations" :key="item">{{ item }}</li>
              </ul>
              <button v-if="isAuthenticated" class="btn btn-primary w-100 mt-3" @click="saveRoute">
                Сохранить маршрут
              </button>
              <RouterLink v-else class="btn btn-primary w-100 mt-3" :to="`/login?redirect=${route.fullPath}`">
                Войти и сохранить
              </RouterLink>
            </section>
          </div>
        </div>

        <div class="row g-4 mt-1">
          <div class="col-lg-7">
            <WeatherPanel
              :latitude="selectedDestination.latitude"
              :longitude="selectedDestination.longitude"
            />
          </div>
          <div class="col-lg-5">
            <section class="detail-card h-100" aria-labelledby="reviews-title">
              <h2 id="reviews-title" class="h4">Отзывы</h2>
              <blockquote v-for="review in selectedDestination.reviews" :key="review" class="review">
                «{{ review }}»
              </blockquote>
            </section>
          </div>
        </div>
      </template>
    </section>
  </BaseLayout>
</template>
