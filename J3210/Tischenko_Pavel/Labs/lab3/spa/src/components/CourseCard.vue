<template>
  <article class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="small text-secondary mb-2">
        {{ course.category }} · {{ course.level }}
      </div>
      <h3 class="h6">{{ course.title }}</h3>
      <p class="small text-secondary flex-grow-1">
        {{ course.shortDescription || 'Описание отсутствует.' }}
      </p>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="fw-semibold">{{ Number(course.price || 0).toLocaleString('ru-RU') }} ₽</span>
        <router-link
          class="btn btn-sm btn-primary"
          :to="{ name: 'course', params: { id: course.id } }"
        >
          Открыть
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
})
</script>
