<template>
  <section>
    <h2 class="h4">Отзывы</h2>

    <ul v-if="reviews.length" class="list-unstyled" aria-live="polite">
      <li v-for="(review, index) in reviews" :key="index" class="review-card mb-3">
        <div class="d-flex justify-content-between">
          <span class="review-card__author">{{ review.author }}</span>
          <span class="review-card__rating">{{ stars(review.rating) }}</span>
        </div>
        <p class="mb-0 mt-1">{{ review.text }}</p>
      </li>
    </ul>

    <p v-else class="text-muted">Отзывов пока нет — будьте первым.</p>
  </section>
</template>

<script>
export default {
  name: 'ReviewList',
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  methods: {
    stars(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating)
    },
  },
}
</script>
