<script setup>
const reviews = [
  { author: 'Анна П.', text: 'Очень удобный интерфейс. Понравилось, что сразу видно дату, место и цену.' },
  { author: 'Игорь Л.', text: 'Хорошая идея со схемой зала и быстрым оформлением покупки.' },
  { author: 'Мария С.', text: 'Карточка мероприятия выглядит понятно и современно.' }
];
</script>

<template>
  <section class="card border-0 shadow-sm rounded-4">
    <div class="card-body p-4">
      <h2 class="h4 fw-bold mb-3">Отзывы</h2>
      <article
        v-for="(review, idx) in reviews"
        :key="idx"
        class="review-item"
        :class="{ 'mb-3': idx < reviews.length - 1 }"
      >
        <h6 class="mb-1">{{ review.author }}</h6>
        <p class="text-secondary mb-0">{{ review.text }}</p>
      </article>
    </div>
  </section>
</template>
