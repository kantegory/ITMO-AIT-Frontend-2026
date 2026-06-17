<template>
  <div class="page-wrapper">
    <AppHeader />
    <main>
      <template v-if="destination">
        <DestinationHero :destination="destination" />
        <section class="py-4">
          <div class="container">
            <ul class="nav nav-pills mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: tab === 'attractions' }"
                  type="button"
                  @click="tab = 'attractions'"
                >
                  Достопримечательности
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: tab === 'reviews' }"
                  type="button"
                  @click="tab = 'reviews'"
                >
                  Отзывы
                </button>
              </li>
            </ul>

            <AttractionsTab
              v-show="tab === 'attractions'"
              :attractions="destination.attractions || []"
              :recommendations="destination.recommendations || []"
            />

            <div v-show="tab === 'reviews'">
              <AddReviewForm v-if="currentUser" @submit="onAddReview" />
              <ReviewList :reviews="reviews" @delete="onDeleteReview" />
            </div>
          </div>
        </section>
      </template>
      <div v-else-if="loading" class="container py-5 text-muted-sm">
        Загрузка маршрута…
      </div>
      <div v-else class="container py-5">
        <div class="alert alert-danger">Не удалось загрузить маршрут.</div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import DestinationHero from "../components/DestinationHero.vue";
import AttractionsTab from "../components/AttractionsTab.vue";
import AddReviewForm from "../components/AddReviewForm.vue";
import ReviewList from "../components/ReviewList.vue";
import { useDestinations } from "../composables/useDestinations.js";
import { useReviews } from "../composables/useReviews.js";
import { useAuth } from "../composables/useAuth.js";

const route = useRoute();
const { destination, loading, fetchOne } = useDestinations();
const { reviews, load: loadReviews, add: addReview, remove: removeReview } = useReviews();
const { currentUser } = useAuth();

const tab = ref("attractions");

async function onAddReview({ text, rating }) {
  try {
    await addReview({
      destinationId: String(route.params.id),
      author: currentUser.value?.name || "Гость",
      authorId: currentUser.value ? String(currentUser.value.id) : null,
      rating,
      text
    });
  } catch (e) {
    alert("Не удалось добавить отзыв");
  }
}

async function onDeleteReview(review) {
  try {
    await removeReview(review.id);
  } catch (e) {
    alert("Не удалось удалить отзыв");
  }
}

async function load() {
  const id = route.params.id;
  await fetchOne(id);
  await loadReviews(id);
}

watch(() => route.params.id, load);
onMounted(load);
</script>
