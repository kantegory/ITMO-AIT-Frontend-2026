import { computed, ref } from 'vue';
import { getTasks } from '../services/api';

export const STATUS_OPTIONS = ['Планирование', 'В работе', 'На проверке', 'Завершен', 'Заморожен'];
export const PRIORITY_OPTIONS = ['Низкий', 'Средний', 'Высокий', 'Критический'];

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function useTasks() {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref('');
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const priorityFilter = ref('all');
  const sortValue = ref('az');

  const filteredTasks = computed(() => {
    const query = normalizeText(searchQuery.value);

    return [...tasks.value]
      .filter((task) => statusFilter.value === 'all' || task.status === statusFilter.value)
      .filter((task) => priorityFilter.value === 'all' || task.priority === priorityFilter.value)
      .filter((task) => {
        if (!query) {
          return true;
        }

        return (
          normalizeText(task.title).includes(query) ||
          normalizeText(task.description).includes(query) ||
          normalizeText(task.createdBy?.name).includes(query)
        );
      })
      .sort((a, b) => {
        const firstCreator = normalizeText(a.createdBy?.name);
        const secondCreator = normalizeText(b.createdBy?.name);

        if (sortValue.value === 'za') {
          return secondCreator.localeCompare(firstCreator, 'ru');
        }

        return firstCreator.localeCompare(secondCreator, 'ru');
      });
  });

  async function fetchTasks() {
    loading.value = true;
    error.value = '';

    try {
      tasks.value = await getTasks();
    } catch (requestError) {
      console.error(requestError);
      error.value = 'Не удалось загрузить задачи с JSON Server. Проверьте, что сервер API запущен на порту 3001.';
    } finally {
      loading.value = false;
    }
  }

  function resetFilters() {
    searchQuery.value = '';
    statusFilter.value = 'all';
    priorityFilter.value = 'all';
    sortValue.value = 'az';
  }

  return {
    tasks,
    loading,
    error,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortValue,
    statusOptions: STATUS_OPTIONS,
    priorityOptions: PRIORITY_OPTIONS,
    filteredTasks,
    fetchTasks,
    resetFilters
  };
}
