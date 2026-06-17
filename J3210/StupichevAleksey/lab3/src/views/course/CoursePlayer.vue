<template>
  <div style="display:flex;flex-direction:column;min-height:100vh">
    <AppHeader/>
    <div class="player-layout">
      <nav class="course-sidebar-player">
        <div class="p-3 border-bottom border-secondary">
          <h6 class="text-white fw-bold mb-1" style="font-size:0.9rem">{{ course?.title }}</h6>
          <div class="small" style="color:rgba(255,255,255,0.45)">{{ allLessons.length }} уроков
          </div>
        </div>
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-light"></div>
        </div>
        <template v-else>
          <div v-for="(mod, mi) in course?.modules" :key="mod.id" class="py-2">
            <div class="px-3 py-1 small fw-semibold"
                 style="color:rgba(255,255,255,0.35);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em">
              Модуль {{ mi + 1 }}: {{ mod.title }}
            </div>
            <div v-for="lesson in mod.lessons" :key="lesson.id">
              <a
                href="#"
                class="lesson-link"
                :class="{ active: currentLesson?.id === lesson.id }"
                @click.prevent="goToLesson(lesson)"
              >
                <svg class="icon">
                  <use :href="`#${lessonIcon(lesson.type)}`"></use>
                </svg>
                <span style="font-size:0.85rem">{{ lesson.title }}</span>
              </a>
            </div>
          </div>
        </template>
      </nav>

      <div class="player-main">
        <div v-if="isLoading" class="spinner-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        <template v-else-if="currentLesson">
          <div style="background:#000;position:relative;aspect-ratio:16/9;max-height:55vh">
            <img
              :src="course?.image"
              :alt="currentLesson.title"
              style="width:100%;height:100%;object-fit:cover;opacity:0.6"
            />
            <div
              style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
              <div
                style="width:72px;height:72px;border-radius:50%;background:rgba(37,99,235,0.9);display:flex;align-items:center;justify-content:center;cursor:pointer">
                <svg class="icon text-white">
                  <use href="#icon-play-fill"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge bg-primary">Модуль {{ currentLesson.moduleIndex + 1 }}</span>
              <span class="badge bg-secondary">{{
                  lessonTypeLabel(currentLesson.type)
                }} • {{ currentLesson.duration }}</span>
            </div>
            <h3 class="fw-bold mb-4">{{ currentLesson.title }}</h3>

            <p class="text-muted">
              Урок <strong>«{{ currentLesson.title }}»</strong> из модуля
              <em>«{{ currentLesson.moduleTitle }}»</em>.
              Длительность: {{ currentLesson.duration }}. Тип:
              {{ lessonTypeLabel(currentLesson.type) }}.
            </p>

            <div class="d-flex gap-2 mt-4 pt-4 border-top">
              <button class="btn btn-outline-secondary" :disabled="currentIndex === 0"
                      @click="prev">
                <svg class="icon me-1">
                  <use href="#icon-arrow-left"></use>
                </svg>
                Предыдущий
              </button>
              <button class="btn btn-outline-secondary ms-auto"
                      :disabled="currentIndex === allLessons.length - 1" @click="next">
                Следующий
                <svg class="icon ms-1">
                  <use href="#icon-arrow-right"></use>
                </svg>
              </button>
            </div>
          </div>
        </template>
        <div v-else class="p-4 text-muted">У этого курса пока нет уроков</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {coursesApi} from '@/api'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const courseId = parseInt(route.params.id)

const course = ref(null)
const allLessons = ref([])
const currentIndex = ref(0)
const isLoading = ref(true)

const currentLesson = computed(() => allLessons.value[currentIndex.value] || null)

function lessonIcon(type) {
  if (type === 'video') return 'icon-play-circle'
  if (type === 'quiz') return 'icon-pencil-square'
  return 'icon-file-text'
}

function lessonTypeLabel(type) {
  if (type === 'video') return 'Видео'
  if (type === 'quiz') return 'Тест'
  return 'Текст'
}

function goToLesson(lesson) {
  const idx = allLessons.value.findIndex((l) => l.id === lesson.id)
  if (idx >= 0) currentIndex.value = idx
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < allLessons.value.length - 1) currentIndex.value++
}

onMounted(async () => {
  try {
    const {data} = await coursesApi.getById(courseId)
    course.value = data
    if (data.modules) {
      data.modules.forEach((mod, mi) => {
        mod.lessons.forEach((lesson) => {
          allLessons.value.push({...lesson, moduleIndex: mi, moduleTitle: mod.title})
        })
      })
    }
    const lessonParam = parseInt(route.query.lesson)
    if (lessonParam) {
      const idx = allLessons.value.findIndex((l) => l.id === lessonParam)
      if (idx >= 0) currentIndex.value = idx
    }
  } finally {
    isLoading.value = false
  }
})
</script>
