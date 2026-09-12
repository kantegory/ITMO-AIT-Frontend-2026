<template>
  <h2 class="mb-4">Ваше расписание</h2>
  <div class="d-flex gap-3 mb-4">
    <button @click="view='today'" :class="view==='today'?'btn btn-danger':'btn btn-outline-danger'">Сегодня</button>
    <button @click="view='week'" :class="view==='week'?'btn btn-danger':'btn btn-outline-danger'">Ближайшая неделя</button>
  </div>

  <div v-if="loading">Загрузка...</div>
  <div v-if="!loading && !filtered.length" class="alert alert-light">Нет занятий</div>

  <LessonItem v-for="l in filtered" :key="l.id" :date="formatDate(l.date)" :time="l.time" :duration="l.duration" :student-name="l.studentName">
    <template #badge>
      <span v-if="l.status==='completed'" class="badge bg-secondary">Проведено</span>
      <span v-else-if="l.status==='booked'" class="badge bg-success">Записан</span>
      <span v-else class="badge bg-warning text-dark">Свободно</span>
    </template>
    <template #actions>
      <button v-if="l.status==='booked'" @click="complete(l)" class="btn btn-success btn-sm">Отметить проведённым</button>
      <button v-else class="btn btn-outline-danger btn-sm" disabled>Свободен</button>
    </template>
  </LessonItem>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLessons } from '../composables/useLessons'
import { useAuth } from '../composables/useAuth'
import LessonItem from '../components/LessonItem.vue'

const { user } = useAuth()
const { lessons, loading, fetchByUser, complete: completeLesson } = useLessons()
const view = ref('today')

onMounted(() => fetchByUser(user.value.id, 'instructor'))

const today = new Date().toISOString().split('T')[0]
const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

const filtered = computed(() => {
  const sorted = [...lessons.value].sort((a,b) => a.time.localeCompare(b.time))
  if (view.value === 'today') return sorted.filter(l => l.date === today)
  return sorted.filter(l => l.date > today && l.date <= weekEnd)
})

async function complete(l) {
  if (!confirm('Отметить занятие как проведённое?')) return
  await completeLesson(l.id)
  fetchByUser(user.value.id, 'instructor')
  alert('Занятие отмечено как пройденное!')
}

function formatDate(d) {
  const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
  const date = new Date(d)
  return `${days[date.getDay()]}, ${d.slice(8,10)}.${d.slice(5,7)}`
}
</script>