<template>
  <div class="destination-hero" :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${destination.image}')` }">
    <div class="destination-hero-overlay">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h1 class="destination-title">{{ destination.name }}</h1>
            <div class="d-flex align-items-center mb-3">
              <span class="rating-large me-2">
                <template v-for="i in 5" :key="i">
                  <svg class="icon" v-if="i <= fullStars"><use xlink:href="/sprite.svg#icon-star-fill"></use></svg>
                  <svg class="icon" v-else-if="i === fullStars + 1 && hasHalf"><use xlink:href="/sprite.svg#icon-star-half"></use></svg>
                  <svg class="icon" v-else><use xlink:href="/sprite.svg#icon-star"></use></svg>
                </template>
              </span>
              <span class="fs-4 fw-bold me-2">{{ destination.rating }}</span>
              <span class="text-white-50">({{ destination.reviews }} отзывов)</span>
            </div>
            <div class="d-flex flex-wrap gap-3">
              <span class="badge bg-white text-dark p-2">
                <svg class="icon"><use xlink:href="/sprite.svg#icon-calendar"></use></svg>
                {{ destination.duration }}
              </span>
              <span class="badge bg-white text-dark p-2">
                {{ destination.budget }} бюджет
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  destination: {
    type: Object,
    required: true
  }
})

const fullStars = computed(() => Math.floor(props.destination.rating))
const hasHalf = computed(() => props.destination.rating % 1 >= 0.5)
</script>