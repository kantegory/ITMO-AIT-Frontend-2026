<template>
  <base-layout>
    <h1 class="h4 mb-3">Кабинет тренера</h1>
    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <h2 class="h5">Мои курсы</h2>
        <div class="small text-secondary mb-3">Всего: {{ myCourses.length }}</div>
        <ul class="mb-0">
          <li v-for="c in myCourses" :key="c.id">{{ c.title }}</li>
        </ul>
      </div>
    </section>

    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <h2 class="h5">Создать курс</h2>
        <div v-if="courseStatus" class="alert py-2 mb-2" :class="courseStatusType">{{ courseStatus }}</div>
        <form class="row g-2" @submit.prevent="createCourse">
          <div class="col-md-4"><input v-model.trim="courseForm.title" class="form-control form-control-sm" placeholder="Название" required /></div>
          <div class="col-md-2"><input v-model="courseForm.direction" class="form-control form-control-sm" placeholder="direction" required /></div>
          <div class="col-md-2"><input v-model="courseForm.level" class="form-control form-control-sm" placeholder="level" required /></div>
          <div class="col-md-2"><input v-model.number="courseForm.price" type="number" class="form-control form-control-sm" placeholder="price" required /></div>
          <div class="col-md-2"><button class="btn btn-sm btn-primary w-100">Создать</button></div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <h2 class="h5">Добавить лекцию</h2>
        <div v-if="lessonStatus" class="alert py-2 mb-2" :class="lessonStatusType">{{ lessonStatus }}</div>
        <form class="row g-2" @submit.prevent="createLesson">
          <div class="col-md-4">
            <select v-model="lessonForm.courseId" class="form-select form-select-sm" required>
              <option disabled value="">Курс</option>
              <option v-for="c in myCourses" :key="c.id" :value="c.id">{{ c.title }}</option>
            </select>
          </div>
          <div class="col-md-4"><input v-model.trim="lessonForm.title" class="form-control form-control-sm" placeholder="Название лекции" required /></div>
          <div class="col-md-3"><input v-model.trim="lessonForm.videoUrl" class="form-control form-control-sm" placeholder="URL видео" required /></div>
          <div class="col-md-1"><button class="btn btn-sm btn-outline-primary w-100">+</button></div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm">
      <div class="card-body">
        <h2 class="h5">Добавить семинар</h2>
        <div v-if="seminarStatus" class="alert py-2 mb-2" :class="seminarStatusType">{{ seminarStatus }}</div>
        <form class="row g-2" @submit.prevent="createSeminar">
          <div class="col-md-4">
            <select v-model="seminarForm.courseId" class="form-select form-select-sm" required>
              <option disabled value="">Курс</option>
              <option v-for="c in myCourses" :key="c.id" :value="c.id">{{ c.title }}</option>
            </select>
          </div>
          <div class="col-md-3"><input v-model.trim="seminarForm.title" class="form-control form-control-sm" placeholder="Название" required /></div>
          <div class="col-md-3"><input v-model.trim="seminarForm.description" class="form-control form-control-sm" placeholder="Описание" required /></div>
          <div class="col-md-1"><input v-model="seminarForm.deadline" type="date" class="form-control form-control-sm" required /></div>
          <div class="col-md-1"><button class="btn btn-sm btn-outline-primary w-100">+</button></div>
        </form>
      </div>
    </section>
  </base-layout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { assignmentsApi, coursesApi, lessonsApi } from '../api'
import BaseLayout from '../layouts/BaseLayout.vue'
import useAuthStore from '../stores/auth'

const authStore = useAuthStore()
const courses = ref([])
const myCourses = computed(() => courses.value.filter((c) => c.teacherId === authStore.user.id))

const courseForm = reactive({
  title: '',
  direction: 'fitness',
  level: 'beginner',
  price: 1000
})
const lessonForm = reactive({ courseId: '', title: '', videoUrl: '' })
const seminarForm = reactive({ courseId: '', title: '', description: '', deadline: '' })
const courseStatus = ref('')
const courseStatusType = ref('alert-secondary')
const lessonStatus = ref('')
const lessonStatusType = ref('alert-secondary')
const seminarStatus = ref('')
const seminarStatusType = ref('alert-secondary')

async function reloadCourses() {
  const response = await coursesApi.getAll()
  courses.value = Array.isArray(response.data) ? response.data : []
  const firstCourseId = myCourses.value[0]?.id || ''
  if (firstCourseId) {
    if (!lessonForm.courseId) lessonForm.courseId = firstCourseId
    if (!seminarForm.courseId) seminarForm.courseId = firstCourseId
  }
}

async function createCourse() {
  courseStatus.value = ''
  try {
    const direction = String(courseForm.direction || 'fitness').trim().toLowerCase()
    const level = String(courseForm.level || 'beginner').trim().toLowerCase()
    await coursesApi.create({
      id: `c_${Date.now()}`,
      title: courseForm.title,
      direction,
      category: direction,
      level,
      price: Number(courseForm.price || 0),
      shortDescription: 'Новый курс тренера.',
      description: 'Описание будет дополнено.',
      teacherId: authStore.user.id,
      author: `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim(),
      durationWeeks: 4,
      modulesCount: 4
    })
    courseForm.title = ''
    await reloadCourses()
    courseStatusType.value = 'alert-success'
    courseStatus.value = 'Курс создан. Он должен появиться в каталоге.'
  } catch (error) {
    courseStatusType.value = 'alert-danger'
    courseStatus.value = error?.response?.data?.message || 'Не удалось создать курс.'
  }
}

async function createLesson() {
  lessonStatus.value = ''
  try {
    await lessonsApi.create({
      id: `l_${Date.now()}`,
      courseId: lessonForm.courseId,
      title: lessonForm.title,
      videoUrl: lessonForm.videoUrl,
      order: 1,
      durationMinutes: 10
    })
    lessonForm.title = ''
    lessonForm.videoUrl = ''
    lessonStatusType.value = 'alert-success'
    lessonStatus.value = 'Лекция добавлена.'
  } catch (error) {
    lessonStatusType.value = 'alert-danger'
    lessonStatus.value = error?.response?.data?.message || 'Не удалось добавить лекцию.'
  }
}

async function createSeminar() {
  seminarStatus.value = ''
  try {
    await assignmentsApi.create({
      id: `a_${Date.now()}`,
      courseId: seminarForm.courseId,
      title: seminarForm.title,
      description: seminarForm.description,
      deadline: seminarForm.deadline
    })
    seminarForm.title = ''
    seminarForm.description = ''
    seminarStatusType.value = 'alert-success'
    seminarStatus.value = 'Семинар добавлен.'
  } catch (error) {
    seminarStatusType.value = 'alert-danger'
    seminarStatus.value = error?.response?.data?.message || 'Не удалось добавить семинар.'
  }
}

onMounted(reloadCourses)
</script>
