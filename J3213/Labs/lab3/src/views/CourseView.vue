<template>
  <section class="section">
    <div class="container">
      <LoadingState v-if="loading" />
      <p v-else-if="error" class="state-message error">{{ error }}</p>

      <template v-else>
        <p class="eyebrow">{{ course.subject }}</p>
        <h1 class="section-title left-title">{{ course.title }}</h1>

        <div class="details-grid">
          <article class="profile-box">
            <p><strong>Преподаватель:</strong> {{ course.teacher }}</p>
            <p><strong>Уровень:</strong> {{ course.level }}</p>
            <p><strong>Длительность:</strong> {{ course.duration }}</p>
            <p><strong>Цена:</strong> {{ course.price }}</p>
            <p>{{ course.description }}</p>
            <RouterLink class="btn" :to="authenticated ? '/profile' : '/login'">
              {{ authenticated ? 'Открыть кабинет' : 'Записаться' }}
            </RouterLink>
          </article>

          <article class="profile-box">
            <h2>Видео-лекции</h2>
            <ol class="course-program">
              <li v-for="lesson in course.lessons" :key="lesson">{{ lesson }}</li>
            </ol>
          </article>

          <article class="profile-box">
            <h2>Материалы</h2>
            <ul class="plain-list">
              <li v-for="material in course.materials" :key="material">{{ material }}</li>
            </ul>
          </article>

          <article class="profile-box">
            <h2>Задания и обсуждения</h2>
            <p>{{ course.assignment }}</p>
            <p class="muted">{{ course.discussion }}</p>
          </article>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import LoadingState from '../components/LoadingState.vue';
import { useAuth } from '../composables/useAuth';
import { getCourse } from '../services/api';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const { authenticated } = useAuth();
const course = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    course.value = await getCourse(props.id);
  } catch {
    error.value = 'Курс не найден или API временно недоступен.';
  } finally {
    loading.value = false;
  }
});
</script>
