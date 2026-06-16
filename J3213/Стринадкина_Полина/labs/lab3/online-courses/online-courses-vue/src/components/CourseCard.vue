<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="mb-2">
        <span class="badge bg-primary me-2">
          {{ course.category }}
        </span>

        <span class="badge bg-secondary">
          {{ course.level }}
        </span>
      </div>

      <h3 class="card-title h5">
        {{ course.title }}
      </h3>

      <p class="card-text">
        {{ course.description }}
      </p>

      <ul class="list-unstyled small mb-3">
        <li>
          <strong>Преподаватель:</strong>
          {{ course.teacher }}
        </li>

        <li>
          <strong>Длительность:</strong>
          {{ course.duration }}
        </li>

        <li>
          <strong>Количество уроков:</strong>
          {{ course.lessonsCount }}
        </li>

        <li>
          <strong>Формат:</strong>
          {{ course.format }}
        </li>
      </ul>

      <div class="mt-auto">
        <p class="fw-bold fs-5 mb-3">
          {{ course.price }}
        </p>

        <RouterLink
          class="btn btn-primary w-100"
          :to="`/course/${course.id}`"
        >
          Подробнее
        </RouterLink>
      </div>
    </div>
  </article>
</template>