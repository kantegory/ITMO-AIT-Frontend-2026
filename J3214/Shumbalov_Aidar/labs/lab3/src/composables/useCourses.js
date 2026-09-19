import { computed, ref } from 'vue';
import { api } from '../services/api';
import { useAuth } from './useAuth';

const courses = ref([]);
const enrollments = ref([]);
const coursesLoading = ref(false);
const coursesError = ref('');

export function useCourses() {
  const { user, isAuthenticated } = useAuth();

  const completedCount = computed(() => enrollments.value.filter((item) => item.progress === 100).length);
  const averageProgress = computed(() => {
    if (!enrollments.value.length) return 0;
    const total = enrollments.value.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(total / enrollments.value.length);
  });

  async function fetchCourses() {
    coursesLoading.value = true;
    coursesError.value = '';

    try {
      const { data } = await api.get('/courses');
      courses.value = data;
    } catch (error) {
      coursesError.value = 'Не удалось загрузить курсы. Запустите mock API.';
    } finally {
      coursesLoading.value = false;
    }
  }

  async function fetchEnrollments() {
    if (!isAuthenticated.value) {
      enrollments.value = [];
      return;
    }

    const { data } = await api.get('/enrollments', {
      params: { userId: user.value.id },
    });
    enrollments.value = data;
  }

  function getEnrollment(courseId) {
    return enrollments.value.find((item) => item.courseId === Number(courseId));
  }

  async function enroll(courseId) {
    if (!isAuthenticated.value || getEnrollment(courseId)) return;

    await api.post('/enrollments', {
      userId: user.value.id,
      courseId: Number(courseId),
      progress: 0,
    });
    await fetchEnrollments();
  }

  function getCourse(courseId) {
    return courses.value.find((course) => course.id === Number(courseId));
  }

  return {
    averageProgress,
    completedCount,
    courses,
    coursesError,
    coursesLoading,
    enroll,
    enrollments,
    fetchCourses,
    fetchEnrollments,
    getCourse,
    getEnrollment,
  };
}
