<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import instance from '@/api/instance'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const course = ref(null)
const loading = ref(true)

const newComment = ref('')
const discussions = ref([])

const currentUserAvatar = computed(() => {
  if (!authStore.user) return 'https://ui-avatars.com/api/?name=Guest&background=334155&color=fff'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.name)}&background=a855f7&color=fff`
})

const addComment = () => {
  if (!newComment.value.trim()) return
  discussions.value.unshift({
    id: Date.now(),
    author: authStore.user ? authStore.user.name : 'Студент',
    avatar: currentUserAvatar.value,
    text: newComment.value,
    date: 'Только что'
  })
  newComment.value = ''
  localStorage.setItem(`comments_${route.params.id}`, JSON.stringify(discussions.value))
}

const loadComments = () => {
  const saved = localStorage.getItem(`comments_${route.params.id}`)
  if (saved) {
    discussions.value = JSON.parse(saved)
  } else {
    discussions.value =[{ id: 1, author: 'Алексей С.', avatar: 'https://ui-avatars.com/api/?name=Alex&background=334155&color=fff', text: 'Отличный курс!', date: 'Вчера' }]
  }
}

const startLearning = () => alert('Курс успешно добавлен в ваше обучение! 🚀')
const addToBookmarks = () => alert('Курс сохранен в закладки! ⭐️')

onMounted(async () => {
  try {
    const res = await instance.get(`/courses/${route.params.id}`)
    course.value = res.data
    loadComments()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const priceText = computed(() => course.value?.price === 0 ? 'Бесплатно' : `${course.value?.price} ₽`)
const priceClass = computed(() => course.value?.price === 0 ? 'text-white' : 'neon-text')

const imgUrl = computed(() => {
  if (!course.value) return ''
  const img = course.value.image || ''
  return (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/')) ? img : '/' + img
})
</script>

<template>
  <BaseLayout>
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-neon"></div></div>
    
    <div v-else-if="course">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink to="/" class="text-neon text-decoration-none">Каталог</RouterLink></li>
          <li class="breadcrumb-item active text-white-50" aria-current="page">{{ course.title }}</li>
        </ol>
      </nav>

      <div class="row g-5">
        <div class="col-12 col-lg-8">
          <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
            <h1 class="text-white fw-bold mb-0">{{ course.title }}</h1>
            <span class="badge bg-secondary fs-6">{{ course.categoryLabel }}</span>
            <span class="badge fs-6" style="background-color: #a855f7;">{{ course.levelLabel }}</span>
          </div>

          <p class="text-white-50 fs-5 mb-4">{{ course.desc }}</p>
          
          <div class="ratio ratio-16x9 rounded-4 overflow-hidden mb-5 border border-secondary shadow-lg">
            <img :src="imgUrl" alt="Обложка" class="object-fit-cover bg-dark">
            <div class="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50">
              <button class="btn btn-neon rounded-circle d-flex justify-content-center align-items-center" style="width: 80px; height: 80px;">
                <svg width="36" height="36" class="ms-1" fill="currentColor" viewBox="0 0 24 24"><use href="/img/sprite.svg#play"></use></svg>
              </button>
            </div>
          </div>

          <ul class="nav nav-tabs custom-tabs border-secondary mb-4" role="tablist">
            <li class="nav-item"><button class="nav-link active bg-transparent fw-bold" data-bs-toggle="tab" data-bs-target="#desc">Обзор курса</button></li>
            <li class="nav-item"><button class="nav-link bg-transparent fw-bold" data-bs-toggle="tab" data-bs-target="#reviews">Обсуждения</button></li>
          </ul>

          <div class="tab-content text-white-50">
            <div class="tab-pane fade show active" id="desc"><h4 class="text-white mb-3">Подробное описание</h4><p>{{ course.desc }}</p></div>
            
            <div class="tab-pane fade" id="reviews">
              <h4 class="text-white mb-4">Обсуждения ({{ discussions.length }})</h4>
              
              <div class="d-flex mb-4">
                <img :src="currentUserAvatar" class="rounded-circle me-3" width="48" height="48" alt="Аватар">
                <div class="w-100">
                  <textarea v-model="newComment" class="form-control bg-dark text-white border-secondary mb-2" rows="2" placeholder="Напишите комментарий..."></textarea>
                  <button class="btn btn-sm btn-neon fw-bold px-4" @click="addComment">Отправить</button>
                </div>
              </div>

              <div v-for="reply in discussions" :key="reply.id" class="card bg-dark border-secondary rounded-4 p-3 mb-3">
                <div class="d-flex align-items-center mb-2">
                  <img :src="reply.avatar" class="rounded-circle me-2" width="32" height="32" alt="Аватар">
                  <span class="text-white fw-bold">{{ reply.author }}</span>
                  <span class="text-white-50 small ms-auto">{{ reply.date }}</span>
                </div>
                <p class="text-light mb-0 ms-5">{{ reply.text }}</p>
              </div>

            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="filter-top-bar p-4 rounded-4 position-sticky" style="top: 100px;">
            <h2 class="fw-bold mb-3" :class="priceClass">{{ priceText }}</h2>
            <button @click="startLearning" class="btn btn-neon w-100 rounded-pill py-3 fw-bold fs-5 mb-3">Начать учиться</button>
            <button @click="addToBookmarks" class="btn btn-outline-light w-100 rounded-pill py-2 fw-bold mb-4">В закладки</button>
            <hr class="border-secondary my-4">
            <h6 class="text-white fw-bold mb-3">Преподаватель:</h6>
            <div class="d-flex align-items-center">
              <img :src="course.teacherAvatar" class="rounded-circle" width="48" height="48" alt="Препод">
              <div class="ms-3 lh-1">
                <div class="fw-bold text-white mb-1">{{ course.teacherName }}</div>
                <div class="text-white-50 small">{{ course.teacherRole }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>