<template>
  <section class="section">
    <div class="container">
      <div class="profile-heading">
        <h1 class="section-title left-title">Личный кабинет</h1>
        <button class="btn secondary-btn" type="button" @click="logoutAndLeave">Выйти</button>
      </div>

      <LoadingState v-if="loading" />
      <p v-else-if="error" class="state-message error">{{ error }}</p>

      <div v-else class="details-grid">
        <article class="profile-box">
          <h2>Пользователь</h2>
          <p>Имя: {{ user.name }}</p>
          <p>Email: {{ user.email }}</p>
          <p>Статус: студент</p>
        </article>

        <article class="profile-box">
          <h2>Мои курсы</h2>
          <div v-if="profile?.courses?.length" class="mini-list">
            <RouterLink
              v-for="course in profile.courses"
              :key="course.id"
              :to="`/courses/${course.id}`"
            >
              {{ course.title }}
            </RouterLink>
          </div>
          <p v-else>Курсы появятся после записи.</p>
        </article>

        <article class="profile-box wide-box">
          <h2>Прогресс</h2>
          <template v-if="profile?.progress?.length">
            <div v-for="item in profile.progress" :key="item.courseTitle" class="progress-item">
              <p class="progress-label">{{ item.courseTitle }}</p>
              <div
                class="progress-bar"
                role="progressbar"
                :aria-label="`Прогресс по курсу ${item.courseTitle}`"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="item.value"
              >
                <div class="progress" :style="{ width: `${item.value}%` }">{{ item.value }}%</div>
              </div>
            </div>
          </template>
          <p v-else>Прогресс пока пустой.</p>
        </article>

        <article class="profile-box">
          <h2>Сертификаты</h2>
          <ul v-if="profile?.certificates?.length" class="plain-list">
            <li v-for="certificate in profile.certificates" :key="certificate">{{ certificate }}</li>
          </ul>
          <p v-else>Сертификаты появятся после завершения курсов.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import LoadingState from '../components/LoadingState.vue';
import { useAuth } from '../composables/useAuth';
import { getProfile } from '../services/api';

const router = useRouter();
const { user, logout } = useAuth();
const profile = ref(null);
const loading = ref(true);
const error = ref('');

function logoutAndLeave() {
  logout();
  router.push('/');
}

onMounted(async () => {
  try {
    profile.value = await getProfile(user.value.id);
  } catch {
    error.value = 'Не удалось загрузить кабинет. Проверьте моковый API.';
  } finally {
    loading.value = false;
  }
});
</script>
