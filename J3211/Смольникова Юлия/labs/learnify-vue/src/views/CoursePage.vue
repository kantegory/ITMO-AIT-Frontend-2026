<template>
  <div class="page-with-footer">
    <NavBar />

    <main class="container my-5" id="main-content" tabindex="-1">
      <div v-if="store.loading" class="text-center my-5 py-5">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div>
        <p class="mt-3 text-muted">Загрузка курса...</p>
      </div>

      <div v-else-if="!course" class="text-center my-5 py-5">
        <h2>Курс не найден</h2>
        <p class="text-muted">Проверьте ссылку или попробуйте позже</p>
        <router-link to="/" class="btn btn-primary-custom mt-3">Перейти в каталог</router-link>
      </div>

      <div v-else class="row g-4">
        <div class="col-lg-8">
          <div class="ratio ratio-16x9 bg-dark rounded-4 shadow-sm mb-3 overflow-hidden" id="videoPlayer" role="region" aria-label="Видеоплеер курса">
            <template v-if="canViewContent">
              <iframe v-if="currentVideoEmbed" :src="currentVideoEmbed" title="Видео урока"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;"
                      loading="lazy"></iframe>
              <div v-else-if="currentVideoDirect" class="d-flex align-items-center justify-content-center h-100">
                <video controls autoplay muted style="width: 100%; height: 100%; object-fit: cover; border-radius: 1.5rem;">
                  <source :src="currentVideoDirect" type="video/mp4">
                </video>
              </div>
              <div v-else class="d-flex align-items-center justify-content-center h-100 bg-dark rounded-4 text-white flex-column">
                <span style="font-size: 3rem;">🎬</span>
                <p class="mt-2 mb-0">Выберите урок для просмотра</p>
              </div>
            </template>
            <div v-else class="d-flex align-items-center justify-content-center h-100 bg-dark rounded-4 text-white flex-column">
              <span style="font-size: 3rem;">🔒</span>
              <p class="mt-2 mb-0">Запишитесь на курс для просмотра видео</p>
            </div>
          </div>

          <div class="mb-4">
            <h1 class="h2 mb-2">{{ course.title }}</h1>
            <p class="text-muted mb-0">{{ course.desc }}</p>

            <div v-if="!canViewContent" class="alert alert-info mt-3 d-flex align-items-center justify-content-between">
              <span>Хотите получить доступ ко всем урокам?</span>
              <router-link v-if="!isAuth" to="/login" class="btn btn-primary-custom btn-sm">Войти</router-link>
              <button v-else class="btn btn-primary-custom btn-sm" @click="handleEnroll">Записаться</button>
            </div>
          </div>

          <ul class="nav nav-tabs" id="courseTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-materials" type="button">Материалы</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-tasks" type="button">Задания</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-discussion" type="button">Обсуждения</button>
            </li>
          </ul>

          <div class="tab-content shadow-sm rounded-bottom-4 p-4 mb-4">
            <div class="tab-pane fade show active" id="tab-materials">
              <h2 class="h5 fw-bold mb-3">Материалы курса</h2>
              <div v-if="!canViewContent" class="text-muted">
                <em>Материалы доступны после записи на курс</em>
              </div>
              <div v-else class="list-group">
                <div v-if="!course.materials || course.materials.length === 0" class="list-group-item text-muted">Материалы отсутствуют</div>
                <div v-for="m in course.materials" :key="m.title" class="list-group-item d-flex justify-content-between align-items-center">
                  <div class="fw-semibold">{{ m.title }}</div>
                  <a v-if="m.link && m.link !== '#'" :href="m.link" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-custom">Открыть</a>
                  <span v-else class="btn btn-sm btn-outline-custom disabled">Нет ссылки</span>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab-tasks">
              <h2 class="h5 fw-bold mb-3">Практические задания</h2>
              <div v-if="!canViewContent" class="text-muted">
                <em>Задания доступны после записи на курс</em>
              </div>
              <div v-else>
                <div v-if="!course.tasks || course.tasks.length === 0" class="text-muted">Задания отсутствуют</div>
                <div v-for="(task, i) in course.tasks" :key="i" class="card mb-3">
                  <div class="card-body">
                    <h3 class="fw-bold h6">Задание {{ i + 1 }}</h3>
                    <p class="mb-2">{{ typeof task === 'string' ? task : task.title }}</p>
                    <p class="text-muted small mb-0">Срок: {{ typeof task === 'object' && task.deadline ? task.deadline : 'Без дедлайна' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab-discussion">
              <h2 class="h5 fw-bold mb-3">Обсуждения</h2>
              <div class="border rounded-3 p-3 text-muted">Комментариев пока нет.</div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 rounded-4 mb-4">
            <div class="card-body">
              <h2 class="h5 fw-bold mb-3">Информация о курсе</h2>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Уровень:</span>
                <span class="fw-semibold">{{ course.level || '—' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Предмет:</span>
                <span class="fw-semibold">{{ course.subject || '—' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Цена:</span>
                <span class="fw-semibold">{{ course.price > 0 ? course.price + ' ₽' : 'Бесплатно' }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Количество уроков:</span>
                <span class="fw-semibold">{{ (course.lessons || []).length }}</span>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-header fw-bold rounded-top-4">Программа курса</div>
            <ul class="list-group list-group-flush">
              <li v-if="!course.lessons || course.lessons.length === 0" class="list-group-item text-muted">Уроки отсутствуют</li>
              <li v-for="(lesson, i) in course.lessons" :key="i"
                  class="list-group-item lesson-item"
                  :class="{ active: activeLesson === i, 'disabled-item': !canViewContent }"
                  @click="canViewContent && selectLesson(i)"
                  :role="canViewContent ? 'button' : null"
                  :tabindex="canViewContent ? 0 : null">
                <div class="d-flex justify-content-between align-items-center">
                  <span>
                    <span v-if="!canViewContent" class="me-2">🔒</span>
                    {{ lesson.title }}
                  </span>
                  <small :class="activeLesson === i ? 'text-white' : 'text-muted'">{{ lesson.duration }}</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const auth = useAuthStore()

const activeLesson = ref(0)
const isEnrolled = ref(false)

const course = computed(() => store.currentCourse)
const isAuth = computed(() => auth.isAuthenticated)

const canViewContent = computed(() => {
  if (!isAuth.value) return false
  if (isEnrolled.value) return true
  if (course.value && auth.user && course.value.userId === auth.user.id) return true
  return false
})

function getVideoEmbedUrl(input) {
  if (!input) return { embed: '', direct: '' }
  input = input.trim()

  if (input.endsWith('.mp4') || input.endsWith('.webm')) {
    return { embed: '', direct: input }
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return { embed: `https://www.youtube.com/embed/${input}?rel=0`, direct: '' }
  }

  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const ytMatch = input.match(ytRegex)
  if (ytMatch && ytMatch[1]) {
    return { embed: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`, direct: '' }
  }

  const cleanUrl = input.replace(/autoplay=[01]&?/g, '').replace(/[?&]$/, '')
  return { embed: cleanUrl, direct: '' }
}

const currentVideoEmbed = computed(() => {
  if (!canViewContent.value) return ''
  const lessons = course.value?.lessons || []
  if (!lessons[activeLesson.value]?.videoId) return ''
  return getVideoEmbedUrl(lessons[activeLesson.value].videoId).embed
})

const currentVideoDirect = computed(() => {
  if (!canViewContent.value) return ''
  const lessons = course.value?.lessons || []
  if (!lessons[activeLesson.value]?.videoId) return ''
  return getVideoEmbedUrl(lessons[activeLesson.value].videoId).direct
})

function selectLesson(index) {
  if (canViewContent.value) {
    activeLesson.value = index
  }
}

async function handleEnroll() {
  if (!isAuth.value) {
    router.push('/login')
    return
  }

  if (course.value?.price > 0) {
    alert(`Этот курс платный (${course.value.price} ₽). Модуль оплаты временно недоступен.`)
    return
  }
  
  try {
    await store.enroll({
      userId: auth.user.id,
      courseId: course.value.id,
      progress: 0,
      completed: false,
      enrolledAt: new Date().toISOString()
    })
    isEnrolled.value = true
    alert('Вы успешно записались на курс!')
  } catch (err) {
    alert('Ошибка записи: ' + err.message)
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return

  await store.loadCourse(id)

  if (isAuth.value && auth.user && course.value) {
    if (course.value.userId === auth.user.id) {
      isEnrolled.value = true
    } else {
      try {
        isEnrolled.value = await store.checkEnrollment(auth.user.id, id)
      } catch {
        isEnrolled.value = false
      }
    }
  }
})
</script>

<style scoped>
.lesson-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.lesson-item:hover:not(.disabled-item) {
  background-color: var(--primary-light);
}

.lesson-item.active {
  background-color: var(--primary);
  color: white;
}

.lesson-item.disabled-item {
  cursor: default;
  opacity: 0.8;
}

.alert-info {
  background-color: var(--primary-light);
  border-color: var(--primary);
  color: var(--text-primary);
}
</style>