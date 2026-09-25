<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Мои курсы</h4>
      <router-link to="/teacher/add" class="btn btn-primary">
        <svg class="icon me-1">
          <use href="#icon-plus-lg"></use>
        </svg>
        Новый курс
      </router-link>
    </div>

    <div v-if="isLoading" class="spinner-center">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else class="settings-section p-0" style="overflow: hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
          <tr>
            <th></th>
            <th>Название</th>
            <th>Статус</th>
            <th>Студенты</th>
            <th>Рейтинг</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="courses.length === 0">
            <td colspan="6" class="text-center text-muted py-4">Нет курсов</td>
          </tr>
          <tr v-for="course in courses" :key="course.id">
            <td>
              <img :src="course.image" class="rounded"
                   style="width:48px; height:36px; object-fit:cover" :alt="course.title"/>
            </td>
            <td class="fw-semibold">{{ course.title }}</td>
            <td>
              <span v-if="course.isPublished" class="badge bg-success">Опубликован</span>
              <span v-else class="badge bg-warning text-dark">Черновик</span>
            </td>
            <td>{{ course.studentsCount || '—' }}</td>
            <td>
                <span v-if="course.rating">
                  <svg class="icon text-warning"><use
                    href="#icon-star-fill"></use></svg> {{ course.rating }}
                </span>
              <span v-else>—</span>
            </td>
            <td>
              <router-link :to="`/teacher/edit/${course.id}`"
                           class="btn btn-sm btn-outline-primary me-1">
                <svg class="icon">
                  <use href="#icon-pencil-square"></use>
                </svg>
              </router-link>
              <button class="btn btn-sm btn-outline-danger"
                      @click="deleteCourse(course.id, course.title)">
                <svg class="icon">
                  <use href="#icon-trash"></use>
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useAuthStore} from '@/stores/auth'
import {coursesApi} from '@/api'

const auth = useAuthStore()
const isLoading = ref(true)
const courses = ref([])

async function load() {
  try {
    const {data} = await coursesApi.getAll({teacherId: auth.user.id})
    courses.value = data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function deleteCourse(id, title) {
  if (!confirm(`Удалить курс "${title}"?`)) return
  try {
    await coursesApi.remove(id)
    courses.value = courses.value.filter((c) => c.id !== id)
  } catch {
    alert('Ошибка удаления')
  }
}

onMounted(load)
</script>
