<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  course: Object
})
</script>

<template>
  <div class="card h-100 shadow-sm">
    <img
      v-if="course.image"
      :src="course.image"
      class="card-img-top"
      style="height: 200px; object-fit: cover;"
      :alt="course.title"
    >

    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ course.title }}</h5>

      <p class="card-text">
        {{ course.description }}
      </p>

      <p class="card-text">
        <strong>Язык:</strong> {{ course.category }}
      </p>

      <p class="card-text">
        <strong>Уровень:</strong> {{ course.level }}
      </p>

      <p class="card-text">
        <strong>Длительность:</strong> {{ course.duration }}
      </p>

      <p class="card-text">
        <strong>Цена:</strong>
        {{ Number(course.price) === 0 ? 'Бесплатно' : course.price + ' ₽' }}
      </p>

      <RouterLink
        :to="`/courses/${course.id}`"
        class="btn btn-primary mt-auto"
      >
        Подробнее
      </RouterLink>
    </div>
  </div>
</template>