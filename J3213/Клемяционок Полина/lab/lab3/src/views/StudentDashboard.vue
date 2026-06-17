<template>
  <h2 class="mb-4">Мои занятия</h2>
  <div v-if="loading">Загрузка...</div>
  <div v-if="!loading && !lessons.length" class="alert alert-info">Нет доступных уроков</div>

  <LessonItem v-for="l in lessons" :key="l.id" :date="l.date" :time="l.time" :duration="l.duration" :student-name="l.studentName">
    <template #badge>
      <span v-if="l.status==='free'" class="badge bg-warning text-dark">Свободно</span>
      <span v-else-if="l.status==='booked'" class="badge bg-success">Вы записаны</span>
      <span v-else class="badge bg-danger">Занято</span>
    </template>
    <template #actions>
      <button v-if="l.status==='free'" @click="book(l)" class="btn btn-success btn-sm">Записаться</button>
      <button v-else class="btn btn-secondary btn-sm" disabled>Подтверждено</button>
    </template>
  </LessonItem>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useLessons } from '../composables/useLessons'
import { useAuth } from '../composables/useAuth'
import LessonItem from '../components/LessonItem.vue'

const { user } = useAuth()
const { lessons, loading, fetchByUser, book: bookLesson } = useLessons()

onMounted(() => fetchByUser(user.value.id, 'student'))

async function book(l) {
  if (!confirm('Записаться на урок?')) return
  await bookLesson(l.id, user.value.id, user.value.name)
  fetchByUser(user.value.id, 'student')
  alert('Вы успешно записаны!')
}
</script>