<template>
  <div class="col-md-6 col-xl-4 d-flex mb-4">
    <article class="glass glass-hover w-100 d-flex flex-column">
      <img :src="`/${course.image}`" class="glass-img-top w-100" alt="Обложка курса">
      
      <div class="p-4 d-flex flex-column flex-grow-1">
        <span class="badge bg-opacity-25 rounded-pill mb-3 border border-opacity-25 d-inline-block" 
              :class="course.badge" style="width: fit-content;">
          {{ course.category }} • {{ course.level }}
        </span>
        
        <h3 class="fw-bold fs-5">{{ course.title }}</h3>
        <p class="opacity-75 small flex-grow-1">{{ course.desc }}</p>
        
        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25">
          <span class="fw-bold fs-5">{{ formattedPrice }} ₽</span>

          <router-link :to="{ name: 'course', params: { id: course.id } }" class="btn btn-sm glass-btn px-3 py-2">
            Подробнее
          </router-link>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const formattedPrice = computed(() => {
  return props.course.price.toLocaleString('ru-RU')
})
</script>