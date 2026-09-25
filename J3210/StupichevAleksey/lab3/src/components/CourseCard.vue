<template>
  <div class="col">
    <div class="card course-card h-100">
      <img :src="course.image" :alt="course.title" class="card-img-top"/>
      <div class="card-body d-flex flex-column p-3">
        <h3 class="card-title fs-6 fw-semibold mb-1">{{ course.title }}</h3>
        <p class="card-text small mb-2">{{ course.shortDescription }}</p>
        <div class="mt-auto d-flex align-items-center justify-content-between">
          <router-link :to="`/course/${course.id}`" class="btn btn-primary btn-sm">Подробнее
          </router-link>
          <span class="text-muted small">
            <svg class="icon text-warning"><use href="#icon-star-fill"></use></svg>
            {{ course.rating }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  course: {type: Object, required: true},
})
</script>
