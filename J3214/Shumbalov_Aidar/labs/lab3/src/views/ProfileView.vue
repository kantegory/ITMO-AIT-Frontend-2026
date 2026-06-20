<script setup>
import { computed, onMounted } from 'vue';
import MetricGrid from '../components/MetricGrid.vue';
import StateNotice from '../components/StateNotice.vue';
import { useAuth } from '../composables/useAuth';
import { useCourses } from '../composables/useCourses';

const { user } = useAuth();
const { averageProgress, completedCount, courses, enrollments, fetchEnrollments, getCourse } = useCourses();

const metrics = computed(() => [
  { label: 'Курсов', value: enrollments.value.length },
  { label: 'Средний прогресс', value: `${averageProgress.value}%` },
  { label: 'Сертификатов', value: completedCount.value },
]);

const enrolledCourses = computed(() => {
  return enrollments.value
    .map((enrollment) => ({
      ...enrollment,
      course: getCourse(enrollment.courseId),
    }))
    .filter((item) => item.course);
});

onMounted(fetchEnrollments);
</script>

<template>
  <section class="panel" aria-labelledby="profile-title">
    <div class="section-heading">
      <div>
        <h1 id="profile-title">Личный кабинет</h1>
        <p>{{ user?.name }} видит записанные курсы, прогресс и сертификаты.</p>
      </div>
    </div>

    <MetricGrid :items="metrics" />

    <StateNotice v-if="!courses.length" title="Курсы загружаются" text="Каталог будет доступен после ответа API." />
    <StateNotice v-else-if="!enrolledCourses.length" title="Пока нет курсов" text="Запишитесь на курс из каталога." />

    <ul v-else class="profile-list">
      <li v-for="item in enrolledCourses" :key="item.id">
        <RouterLink :to="{ name: 'course', params: { id: item.course.id } }">{{ item.course.title }}</RouterLink>
        <strong>{{ item.progress }}%</strong>
      </li>
    </ul>
  </section>
</template>
