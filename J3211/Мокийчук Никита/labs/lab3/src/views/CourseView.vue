<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppAPI } from '../api/api'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useFormatters } from '../composables/useFormatters'
import CommentItem from '../components/CommentItem.vue'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()
const { showToast } = useToast()
const { formatPrice, formatStudents } = useFormatters()

const course = ref(null)
const lessons = ref([])
const enrollment = ref(null)
const comments = ref([])
const activeLessonId = ref(null)
const error = ref(null)
const activeTab = ref('materials')
const newComment = ref('')

const courseId = computed(() => route.params.id)

const progress = computed(() => enrollment.value?.progress || 0)

const currentLessonTitle = computed(() => {
  const lesson = lessons.value.find(
    (item) => Number(item.id) === Number(activeLessonId.value)
  )
  return lesson?.title || 'Нет уроков'
})

const isLessonCompleted = (lessonId) =>
  Boolean(
    enrollment.value?.completedLessons
      ?.map(Number)
      .includes(Number(lessonId))
  )

const buyMeta = computed(() => {
  if (!course.value) return ''
  const priceLabel = course.value.price === 0 ? 'Бесплатный курс' : formatPrice(course.value.price)
  return `${priceLabel} — ${lessons.value.length} уроков, ${course.value.durationHours} часа(ов) контента`
})

const loadCourse = async () => {
  try {
    course.value = await AppAPI.getCourseById(courseId.value)
    lessons.value = await AppAPI.getLessonsByCourse(courseId.value)
    activeLessonId.value = lessons.value[0]?.id ? Number(lessons.value[0].id) : null

    if (currentUser.value) {
      enrollment.value = await AppAPI.getEnrollment(currentUser.value.id, courseId.value)
    }
    comments.value = await AppAPI.getCommentsByCourse(courseId.value)
  } catch (err) {
    error.value = 'Не удалось загрузить страницу курса'
  }
}

const handleSelectLesson = (lessonId) => {
  activeLessonId.value = Number(lessonId)
}

const handleConfirmBuy = async () => {
  if (!currentUser.value) {
    showToast('Сначала войдите в аккаунт', 'warning')
    setTimeout(() => router.push({ name: 'login' }), 700)
    return
  }
  try {
    enrollment.value = await AppAPI.enrollUser(currentUser.value.id, courseId.value)
    showToast('Вы успешно записались на курс!', 'success')
  } catch (err) {
    showToast('Не удалось записаться на курс', 'danger')
  }
}

const handleCompleteLesson = async () => {
  if (!currentUser.value) {
    showToast('Сначала войдите в аккаунт', 'warning')
    return
  }
  if (!activeLessonId.value) return

  try {
    if (!enrollment.value) {
      enrollment.value = await AppAPI.enrollUser(currentUser.value.id, courseId.value)
    }
    const set = new Set(enrollment.value.completedLessons || [])
    set.add(activeLessonId.value)
    const completedLessons = [...set]
    const newProgress = lessons.value.length
      ? Math.round((completedLessons.length / lessons.value.length) * 100)
      : 0

    enrollment.value = await AppAPI.updateEnrollment(enrollment.value.id, {
      completedLessons,
      progress: newProgress
    })
    showToast('Урок отмечен как пройденный!', 'success')
  } catch (err) {
    showToast('Не удалось обновить прогресс', 'danger')
  }
}

const handleSubmitComment = async () => {
  const text = newComment.value.trim()
  if (!text) {
    showToast('Введите комментарий', 'danger')
    return
  }
  try {
    await AppAPI.addComment({
      courseId: Number(courseId.value),
      author: currentUser.value ? currentUser.value.name : 'Гость',
      text,
      createdAt: new Date().toISOString()
    })
    comments.value = await AppAPI.getCommentsByCourse(courseId.value)
    newComment.value = ''
    showToast('Комментарий отправлен', 'success')
  } catch (err) {
    showToast('Не удалось отправить комментарий', 'danger')
  }
}

watch(courseId, () => loadCourse())
onMounted(loadCourse)
</script>

<template>
  <div v-if="error" class="container py-5">
    <div class="card-custom p-4 text-center text-danger">{{ error }}</div>
  </div>

  <template v-else-if="course">
    <section class="course-hero mt-navbar">
      <div class="container">
        <nav aria-label="Навигация по разделам">
          <ol class="breadcrumb mb-3 breadcrumb-sm">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'catalog' }" class="text-white-50 text-decoration-none">
                Каталог
              </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link
                :to="{ name: 'catalog', query: { category: course.subject } }"
                class="text-white-50 text-decoration-none"
              >{{ course.subjectLabel }}</router-link>
            </li>
            <li class="breadcrumb-item text-white active">{{ course.title }}</li>
          </ol>
        </nav>

        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1>{{ course.title }}</h1>
            <p class="mb-3 opacity-85">{{ course.description }}</p>
            <div class="d-flex flex-wrap gap-3 align-items-center mb-3">
              <div class="rating text-lg">
                <i class="bi bi-star-fill"></i>
                <span class="text-white ms-1">
                  {{ course.rating }} ({{ course.reviews }} отзыва)
                </span>
              </div>
              <span class="text-white-50">
                <i class="bi bi-people me-1"></i>{{ formatStudents(course.students) }} студентов
              </span>
              <span class="text-white-50">
                <i class="bi bi-clock me-1"></i>{{ course.durationHours }} часов
              </span>
            </div>
            <p class="mb-0 opacity-70 text-sm-2">
              Автор: <strong>{{ course.teacherName }}</strong>
            </p>
          </div>

          <div class="col-lg-4 mt-4 mt-lg-0">
            <div class="card-custom p-4 text-center color-gray-800">
              <div class="price-free mb-2 text-2xl">{{ formatPrice(course.price) }}</div>
              <button
                class="btn btn-accent w-100 mb-2"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#buyModal"
              >
                <i class="bi bi-play-circle me-2"></i>Начать обучение
              </button>
              <button
                class="btn btn-outline-primary w-100"
                type="button"
                @click="showToast('Курс добавлен в избранное', 'success')"
              >
                <i class="bi bi-heart me-2"></i>В избранное
              </button>
              <hr />
              <ul class="text-start text-sm list-unstyled mb-0">
                <li class="mb-1">
                  <i class="bi bi-collection-play me-2 text-primary"></i>{{ lessons.length }} видео-лекций
                </li>
                <li class="mb-1">
                  <i class="bi bi-award me-2 text-primary"></i>Сертификат по окончании
                </li>
                <li>
                  <i class="bi bi-infinity me-2 text-primary"></i>Бессрочный доступ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section pt-reduced">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="video-placeholder mb-4">
              <button
                class="play-btn"
                type="button"
                @click="showToast('Воспроизведение видео (заглушка)', 'info')"
              >
                <i class="bi bi-play-circle-fill"></i>
              </button>
            </div>

            <h2 class="fw-bold mb-1 h4">{{ currentLessonTitle }}</h2>
            <p class="text-muted mb-4">Знакомство с темой урока</p>

            <div class="card-custom p-3 mb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-sm-2">Прогресс курса</span>
                <span class="fw-bold text-primary">{{ progress }}%</span>
              </div>
              <div class="progress progress-custom">
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <button class="btn btn-primary mb-4" type="button" @click="handleCompleteLesson">
              <i class="bi bi-check2-circle me-2"></i>Отметить урок пройденным
            </button>

            <ul class="nav nav-tabs-custom mb-4" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: activeTab === 'materials' }"
                  href="#"
                  @click.prevent="activeTab = 'materials'"
                >Материалы</a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: activeTab === 'tasks' }"
                  href="#"
                  @click.prevent="activeTab = 'tasks'"
                >Задания</a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: activeTab === 'discussion' }"
                  href="#"
                  @click.prevent="activeTab = 'discussion'"
                >Обсуждение</a>
              </li>
            </ul>

            <div v-show="activeTab === 'materials'">
              <ul class="list-unstyled mb-0">
                <li class="card-custom p-3 mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <i class="bi bi-file-earmark-pdf text-danger text-icon"></i>
                    <div class="flex-grow-1">
                      <div class="fw-bold text-md-2">Конспект лекции</div>
                      <small class="text-muted">PDF, 2.3 MB</small>
                    </div>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="showToast('Скачивание файла (заглушка)', 'info')"
                    >
                      <i class="bi bi-download"></i>
                    </button>
                  </div>
                </li>
                <li class="card-custom p-3 mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <i class="bi bi-file-earmark-code text-primary text-icon"></i>
                    <div class="flex-grow-1">
                      <div class="fw-bold text-md-2">Исходный код примеров</div>
                      <small class="text-muted">ZIP, 540 KB</small>
                    </div>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="showToast('Скачивание файла (заглушка)', 'info')"
                    >
                      <i class="bi bi-download"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <div v-show="activeTab === 'tasks'">
              <div class="card-custom p-4 mb-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h3 class="h6 fw-bold mb-0">Задание 1: Hello World</h3>
                  <span class="badge bg-success">Легкое</span>
                </div>
                <p class="text-muted mb-3 text-sm-2">
                  Напишите программу, которая выводит «Hello, World!» в консоль.
                </p>
                <textarea class="form-control mb-3" rows="4" placeholder="Введите ваш код здесь..."></textarea>
                <div class="d-flex gap-2">
                  <button class="btn btn-primary btn-sm" @click="showToast('Решение отправлено!', 'success')">
                    <i class="bi bi-send me-1"></i>Отправить
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" @click="showToast('Подсказка: используйте print()', 'info')">
                    <i class="bi bi-lightbulb me-1"></i>Подсказка
                  </button>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'discussion'">
              <form class="mb-4" @submit.prevent="handleSubmitComment">
                <div class="d-flex gap-3">
                  <div class="comment-avatar">{{ currentUser ? currentUser.name?.[0] : 'Я' }}</div>
                  <div class="flex-grow-1">
                    <textarea
                      class="form-control mb-2"
                      rows="3"
                      placeholder="Напишите комментарий или задайте вопрос..."
                      v-model="newComment"
                    ></textarea>
                    <button type="submit" class="btn btn-primary btn-sm">
                      <i class="bi bi-send me-1"></i>Отправить
                    </button>
                  </div>
                </div>
              </form>

              <section aria-label="Комментарии к уроку">
                <CommentItem
                  v-for="comment in comments"
                  :key="comment.id"
                  :comment="comment"
                />
                <div v-if="comments.length === 0" class="text-muted text-center p-3">
                  Пока нет комментариев — будьте первым
                </div>
              </section>
            </div>
          </div>

          <aside class="col-lg-4">
            <div class="card-custom course-sidebar-sticky">
              <div class="p-3 border-bottom">
                <h2 class="h6 fw-bold mb-0">
                  <i class="bi bi-list-ul me-2"></i>Содержание курса
                </h2>
              </div>
              <div class="lesson-list-scroll">
                <div
                  v-for="lesson in lessons"
                  :key="lesson.id"
                  class="lesson-item"
                  :class="{
                    active: Number(activeLessonId) === Number(lesson.id),
                    completed: isLessonCompleted(lesson.id)
                  }"
                  @click="handleSelectLesson(lesson.id)"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="lesson-title">{{ lesson.title }}</span>
                    <small class="text-muted">{{ lesson.duration }}</small>
                  </div>
                </div>
                <div v-if="lessons.length === 0" class="p-3 text-muted text-center">
                  Уроки пока не добавлены
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div class="modal fade" id="buyModal" tabindex="-1" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">
              <i class="bi bi-cart-check me-2"></i>Начать обучение
            </h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <i class="bi bi-mortarboard text-icon-xl color-primary"></i>
            </div>
            <h3 class="h5 text-center fw-bold">{{ course.title }}</h3>
            <p class="text-center text-muted">{{ buyMeta }}</p>
            <div class="card-custom p-3 bg-gray-100-card">
              <div class="d-flex justify-content-between mb-1">
                <span>Курс</span>
                <span class="fw-bold">{{ formatPrice(course.price) }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Сертификат</span>
                <span class="fw-bold">Включен</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
            <button
              type="button"
              class="btn btn-accent"
              data-bs-dismiss="modal"
              @click="handleConfirmBuy"
            >
              <i class="bi bi-check2 me-1"></i>Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
