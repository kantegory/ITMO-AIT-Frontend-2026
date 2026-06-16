<script setup>
import { onMounted, ref } from 'vue';
import AppNavbar from '../components/AppNavbar.vue';
import EmptyState from '../components/EmptyState.vue';
import ErrorAlert from '../components/ErrorAlert.vue';
import FooterBar from '../components/FooterBar.vue';
import LoadingState from '../components/LoadingState.vue';
import SkipLink from '../components/SkipLink.vue';
import TaskCard from '../components/TaskCard.vue';
import TaskFilters from '../components/TaskFilters.vue';
import TaskModal from '../components/TaskModal.vue';
import { useApplications } from '../composables/useApplications';
import { useAuth } from '../composables/useAuth';
import { useTasks } from '../composables/useTasks';

const selectedTask = ref(null);
const { currentUser } = useAuth();
const {
  loading: tasksLoading,
  error: tasksError,
  searchQuery,
  statusFilter,
  priorityFilter,
  sortValue,
  statusOptions,
  priorityOptions,
  filteredTasks,
  fetchTasks
} = useTasks();
const {
  loading: applicationsLoading,
  saving,
  error: applicationsError,
  fetchApplications,
  hasApplied,
  applyToPosition
} = useApplications();

function openTask(task) {
  selectedTask.value = task;
}

function closeTask() {
  selectedTask.value = null;
}

async function applyForSelectedTask(position) {
  await applyToPosition(selectedTask.value, position, currentUser.value);
}

onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchApplications(currentUser.value?.email)
  ]);
});
</script>

<template>
  <div class="page-shell">
    <SkipLink />
    <AppNavbar title="Task Search" />

    <main id="main-content">
      <section aria-labelledby="tasks-heading">
        <div class="container pt-4">
          <h1 id="tasks-heading" class="h2 mb-1">Каталог задач</h1>
          <p class="text-muted mb-0">Используйте поиск, фильтры и сортировку для выбора подходящей задачи.</p>
        </div>

        <TaskFilters
          v-model:search-query="searchQuery"
          v-model:status-filter="statusFilter"
          v-model:priority-filter="priorityFilter"
          v-model:sort-value="sortValue"
          :status-options="statusOptions"
          :priority-options="priorityOptions"
        />

        <div class="container my-4">
          <div class="d-flex flex-wrap gap-3" aria-live="polite" :aria-busy="tasksLoading || applicationsLoading">
            <LoadingState v-if="tasksLoading || applicationsLoading" text="Загрузка задач..." />
            <ErrorAlert v-else-if="tasksError" :text="tasksError" />
            <ErrorAlert v-else-if="applicationsError" :text="applicationsError" />
            <EmptyState v-else-if="!filteredTasks.length" text="По вашему запросу задачи не найдены." />
            <template v-else>
              <TaskCard
                v-for="task in filteredTasks"
                :key="task.id"
                :task="task"
                @open="openTask"
              />
            </template>
          </div>
        </div>
      </section>
    </main>

    <FooterBar />

    <TaskModal
      :task="selectedTask"
      :saving="saving"
      :has-applied="hasApplied"
      @close="closeTask"
      @apply="applyForSelectedTask"
    />
  </div>
</template>
