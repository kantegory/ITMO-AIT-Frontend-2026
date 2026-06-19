<template>
  <main class="container mt-5 mb-5">
    <div class="row g-4">

      <aside class="col-lg-4" aria-label="Информация о пользователе">
        <div class="glass p-4 text-center">
          <div class="rounded-circle mx-auto mb-3 default-avatar" style="width:120px; height:120px; font-size: 3rem;">
            <svg width="50%" height="50%"><use href="#icon-user"></use></svg>
          </div>
          <h1 class="fw-bold fs-4">{{ user?.firstName }} {{ user?.lastName }}</h1>
          <p class="opacity-75 mb-4">{{ user?.email }}</p>
          
          <div class="d-flex justify-content-center gap-4 text-start border-top border-secondary border-opacity-25 pt-4">
            <div class="text-center">
              <span class="d-block opacity-75 small">Курсов</span>
              <span class="fw-bold fs-4 text-info">3</span>
            </div>
            <div class="text-center">
              <span class="d-block opacity-75 small">Сертификатов</span>
              <span class="fw-bold fs-4 text-warning">1</span>
            </div>
          </div>
        </div>
      </aside>

      <section class="col-lg-8" aria-label="Панель обучения">

        <div class="glass p-3 mb-4 border-info border-opacity-25" style="min-height: 86px;">
          <small class="text-info d-block mb-1">Совет дня (Внешнее API):</small>

          <div v-if="isLoading" class="placeholder-glow">
            <span class="placeholder col-8 rounded-pill" style="background-color: var(--text-muted); opacity: 0.2;"></span>
            <span class="placeholder col-5 rounded-pill" style="background-color: var(--text-muted); opacity: 0.1;"></span>
          </div>

          <span v-else class="fst-italic">
            "{{ advice }}"
          </span>
        </div>

        <div class="glass p-4">
          <ul class="nav nav-pills mb-4 border-bottom border-secondary border-opacity-25 pb-3">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === 'student' }" @click="activeTab = 'student'">
                Кабинет Студента
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === 'teacher' }" @click="activeTab = 'teacher'">
                Кабинет Преподавателя
              </button>
            </li>
          </ul>

          <StudentPanel v-if="activeTab === 'student'" />
          <TeacherPanel v-else />
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAdvice } from '@/composables/useAdvice'
import StudentPanel from '@/components/profile/StudentPanel.vue'
import TeacherPanel from '@/components/profile/TeacherPanel.vue'

const { user } = useAuth()
const { advice, isLoading, fetchAdvice } = useAdvice()
const activeTab = ref('student')

onMounted(fetchAdvice)
</script>