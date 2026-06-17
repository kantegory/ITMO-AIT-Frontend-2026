import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'

export function useTasks() {
  const tasksStore = useTasksStore()

  return {
    tasks: computed(() => tasksStore.tasks),
    projectTasks: computed(() => tasksStore.projectTasks),
    loading: computed(() => tasksStore.loading),
    error: computed(() => tasksStore.error),
    fetchUserTasks: tasksStore.fetchUserTasks,
    fetchProjectTasks: tasksStore.fetchProjectTasks,
    addTask: tasksStore.addTask
  }
}