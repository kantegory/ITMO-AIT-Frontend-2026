<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import StateNotice from '../components/StateNotice.vue';
import { useCourses } from '../composables/useCourses';
import { api } from '../services/api';

const { courses, fetchCourses } = useCourses();
const materials = ref([]);
const message = ref('');
const form = reactive({
  courseId: '',
  title: '',
  type: 'Лекция',
});

const courseOptions = computed(() => courses.value.map((course) => ({ id: course.id, title: course.title })));

async function fetchMaterials() {
  const { data } = await api.get('/materials');
  materials.value = data;
}

async function handleSubmit() {
  if (!form.courseId || !form.title.trim()) return;

  const { data } = await api.post('/materials', {
    courseId: Number(form.courseId),
    title: form.title.trim(),
    type: form.type,
    status: 'Черновик',
  });

  materials.value.push(data);
  form.title = '';
  message.value = 'Материал сохранён в mock API.';
}

function getCourseTitle(courseId) {
  return courses.value.find((course) => course.id === courseId)?.title || 'Курс не найден';
}

onMounted(async () => {
  if (!courses.value.length) {
    await fetchCourses();
  }
  if (!form.courseId && courses.value[0]) {
    form.courseId = String(courses.value[0].id);
  }
  await fetchMaterials();
});
</script>

<template>
  <section class="panel" aria-labelledby="teacher-title">
    <div class="section-heading">
      <div>
        <h1 id="teacher-title">Кабинет преподавателя</h1>
        <p>Раздел показывает защищённую работу с API: список и создание материалов курса.</p>
      </div>
    </div>

    <form class="teacher-form" @submit.prevent="handleSubmit">
      <label>
        Курс
        <select v-model="form.courseId">
          <option v-for="course in courseOptions" :key="course.id" :value="course.id">{{ course.title }}</option>
        </select>
      </label>
      <label>
        Тип
        <select v-model="form.type">
          <option>Лекция</option>
          <option>Задание</option>
          <option>Материал</option>
        </select>
      </label>
      <label>
        Название материала
        <input v-model="form.title" type="text" placeholder="Например, Практика по DOM" required />
      </label>
      <button class="primary-button" type="submit">Сохранить</button>
    </form>

    <p class="form-message" aria-live="polite">{{ message }}</p>

    <StateNotice v-if="!materials.length" title="Материалы не найдены" text="Создайте первый материал через форму." />
    <ul v-else class="profile-list">
      <li v-for="material in materials" :key="material.id">
        <span>
          <strong>{{ material.title }}</strong>
          <small>{{ material.type }} - {{ getCourseTitle(material.courseId) }}</small>
        </span>
        <span class="pill">{{ material.status }}</span>
      </li>
    </ul>
  </section>
</template>
