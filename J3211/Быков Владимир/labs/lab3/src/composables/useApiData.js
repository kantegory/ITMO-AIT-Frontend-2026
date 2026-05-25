import { computed, ref } from 'vue';
import { api } from '../services/api';

const projects = ref([]);
const workers = ref([]);
const tasks = ref([]);
const isLoading = ref(false);
const error = ref('');

export function useApiData() {
    const averageQuality = computed(() => {
        if (!projects.value.length) {
            return 0;
        }

        const sum = projects.value.reduce((result, project) => result + project.quality, 0);

        return Math.round(sum / projects.value.length);
    });

    const totalItems = computed(() => {
        return projects.value.reduce((sum, project) => sum + project.itemsTotal, 0);
    });

    const doneItems = computed(() => {
        return projects.value.reduce((sum, project) => sum + project.itemsDone, 0);
    });

    const activeTasks = computed(() => {
        return projects.value
            .filter((project) => project.status !== 'done')
            .reduce((sum, project) => sum + (project.itemsTotal - project.itemsDone), 0);
    });

    async function loadData() {
        isLoading.value = true;
        error.value = '';

        try {
            const [projectsResponse, workersResponse, tasksResponse] = await Promise.all([
                api.get('/projects'),
                api.get('/workers'),
                api.get('/tasks')
            ]);

            projects.value = projectsResponse.data;
            workers.value = workersResponse.data;
            tasks.value = tasksResponse.data;
        } catch {
            error.value = 'Не удалось получить данные из API. Проверьте запуск JSON-server.';
        } finally {
            isLoading.value = false;
        }
    }

    return {
        projects,
        workers,
        tasks,
        isLoading,
        error,
        averageQuality,
        totalItems,
        doneItems,
        activeTasks,
        loadData
    };
}
