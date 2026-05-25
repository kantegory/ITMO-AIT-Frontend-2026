<script setup>

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import instance from '../api/instance'

const route = useRoute()
const activeTab = ref('materials')
const course = ref(null)

const fetchCourse = async () => {
  const response = await instance.get(`/courses/${route.params.id}`)
  course.value = response.data
}

onMounted(fetchCourse)
</script>

<template>
  <main
    v-if="course"
    class="container py-5"
  >
    <h1 class="mb-2">
      {{ course.title }}
    </h1>

    <p class="text-muted mb-4">
      Преподаватель: {{ course.teacher }}
    </p>

    <div class="row g-4">

      <section class="col-lg-8">

        <div class="ratio ratio-16x9 mb-4">

          <iframe
            :src="course.video"
            title="Видео курса"
            allowfullscreen
          >
          </iframe>

        </div>

        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'materials' }"
              @click="activeTab = 'materials'"
            >
              Материалы
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'tasks' }"
              @click="activeTab = 'tasks'"
            >
              Задания
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'discussion' }"
              @click="activeTab = 'discussion'"
            >
              Обсуждения
            </button>
          </li>
        </ul>

        <div class="border rounded p-4 bg-light">
          <div v-if="activeTab === 'materials'">
            <ul>
              <li
                v-for="material in course.materials"
                :key="material"
              >
                {{ material }}
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'tasks'">
            <ul>
              <li
                v-for="task in course.tasks"
                :key="task"
              >
                {{ task }}
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'discussion'">
            <div
              v-for="message in course.discussion"
              :key="message.text"
              class="mb-3"
            >
              <strong>{{ message.author }}:</strong>
              {{ message.text }}
            </div>
          </div>
        </div>

      </section>

      <aside class="col-lg-4">

        <div class="card shadow-sm">

          <div class="card-body">

            <h2 class="h4 mb-3">
              О курсе
            </h2>

            <p>
              {{ course.description }}
            </p>

            <ul class="list-unstyled">

              <li>
                <strong>Категория:</strong>
                {{ course.category }}
              </li>

              <li>
                <strong>Уровень:</strong>
                {{ course.level }}
              </li>

              <li>
                <strong>Длительность:</strong>
                {{ course.duration }}
              </li>

              <li>
                <strong>Уроков:</strong>
                {{ course.lessonsCount }}
              </li>

              <li>
                <strong>Формат:</strong>
                {{ course.format }}
              </li>

            </ul>

            <p class="fw-bold fs-5 mt-3">
              {{ course.price }}
            </p>

            <button class="btn btn-success w-100">
              Купить курс
            </button>

          </div>

        </div>

      </aside>

    </div>

  </main>
</template>