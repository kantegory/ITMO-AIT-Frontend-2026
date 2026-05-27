<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StateNotice from '../components/StateNotice.vue';
import { useAuth } from '../composables/useAuth';
import { useCourses } from '../composables/useCourses';

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();
const { courses, enroll, fetchCourses, getCourse, getEnrollment } = useCourses();

const course = computed(() => getCourse(route.params.id));
const enrollment = computed(() => getEnrollment(route.params.id));

onMounted(async () => {
  if (!courses.value.length) {
    await fetchCourses();
  }
});

async function handleEnroll() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }

  await enroll(route.params.id);
}
</script>

<template>
  <StateNotice v-if="!course" title="Курс не найден" text="Вернитесь в каталог и выберите курс из списка." />

  <section v-else class="panel details-layout" aria-labelledby="course-title">
    <article>
      <span class="pill">{{ course.subjectLabel }}</span>
      <h1 id="course-title">{{ course.title }}</h1>
      <p>{{ course.description }}</p>

      <dl class="details-list">
        <div>
          <dt>Преподаватель</dt>
          <dd>{{ course.teacher }}</dd>
        </div>
        <div>
          <dt>Уровень</dt>
          <dd>{{ course.levelLabel }}</dd>
        </div>
        <div>
          <dt>Лекций</dt>
          <dd>{{ course.lessons }}</dd>
        </div>
        <div>
          <dt>Рейтинг</dt>
          <dd>{{ course.rating }}</dd>
        </div>
      </dl>

      <button class="primary-button" type="button" @click="handleEnroll">
        {{ enrollment ? `Открыть курс, ${enrollment.progress}%` : 'Записаться на курс' }}
      </button>
    </article>

    <aside class="side-panel">
      <h2>Материалы и задания</h2>
      <ul>
        <li v-for="material in course.materials" :key="material">{{ material }}</li>
      </ul>
    </aside>
  </section>
</template>
