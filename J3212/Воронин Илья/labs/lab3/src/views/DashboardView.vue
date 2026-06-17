<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useI18n } from '../composables/useI18n';
import { getProjects, addProject } from '../api/projects';
import { searchTasks } from '../api/tasks';
import { getNotifications } from '../api/notifications';
import ProjectCard from '../components/ProjectCard.vue';
import TaskListItem from '../components/TaskListItem.vue';
import NotificationItem from '../components/NotificationItem.vue';
import AddProjectModal from '../components/AddProjectModal.vue';

const { user } = useAuth();
const { t } = useI18n();

const projects = ref([]);
const tasks = ref([]);
const notifications = ref([]);
const projectsError = ref('');
const tasksError = ref('');
const notificationsError = ref('');

const modal = useTemplateRef('modal');

async function loadProjects() {
  projectsError.value = '';
  try {
    projects.value = (await getProjects()) || [];
  } catch (e) {
    projects.value = [];
    projectsError.value = t('common_error');
  }
}

async function loadTasks() {
  tasksError.value = '';
  try {
    tasks.value = (await searchTasks({ assigneeId: user.value?.id })) || [];
  } catch (e) {
    tasks.value = [];
    tasksError.value = t('common_error');
  }
}

async function loadNotifications() {
  notificationsError.value = '';
  try {
    notifications.value = (await getNotifications(user.value?.id)) || [];
  } catch (e) {
    notifications.value = [];
    notificationsError.value = t('common_error');
  }
}

onMounted(() => {
  loadProjects();
  loadTasks();
  loadNotifications();
});

async function onCreate({ name, description }) {
  if (!name) return;
  try {
    const created = await addProject(name, description);
    projects.value.push(created);
  } catch (e) {
    projects.value.push({ id: Date.now(), name, description: description || '0 задач · 0 участников' });
  }
}
</script>

<template>
  <section class="container py-4">
    <h1 class="mb-4">{{ t('dash_title') }}</h1>

    <section class="dashboard-section">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">{{ t('dash_projects') }}</h2>
        <button type="button" class="btn btn-primary btn-sm" @click="modal?.show()">
          {{ t('dash_add_project') }}
        </button>
      </div>
      <div v-if="projectsError" class="text-muted">{{ projectsError }}</div>
      <div v-else-if="!projects.length" class="text-muted">{{ t('dash_no_projects') }}</div>
      <div v-else class="row g-3">
        <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
      </div>
    </section>

    <section class="dashboard-section">
      <h2 class="h5 mb-3">{{ t('dash_tasks') }}</h2>
      <div v-if="tasksError" class="list-group">
        <div class="list-group-item text-muted">{{ tasksError }}</div>
      </div>
      <div v-else-if="!tasks.length" class="list-group">
        <div class="list-group-item text-muted">{{ t('dash_no_tasks') }}</div>
      </div>
      <div v-else class="list-group">
        <TaskListItem v-for="task in tasks" :key="task.id" :task="task" />
      </div>
    </section>

    <section class="dashboard-section">
      <h2 class="h5 mb-3">{{ t('dash_notifications') }}</h2>
      <div v-if="notificationsError" class="list-group">
        <div class="list-group-item text-muted">{{ notificationsError }}</div>
      </div>
      <div v-else-if="!notifications.length" class="list-group">
        <div class="list-group-item text-muted">{{ t('dash_no_notifications') }}</div>
      </div>
      <div v-else class="list-group">
        <NotificationItem v-for="n in notifications" :key="n.id" :notification="n" />
      </div>
    </section>

    <AddProjectModal ref="modal" @created="onCreate" />
  </section>
</template>
