<script setup>
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useI18n } from '../composables/useI18n';
import { useUsers } from '../composables/useUsers';
import { getProject } from '../api/projects';
import { getTasks, addTask, updateTask } from '../api/tasks';
import { getDiscussions, addDiscussion } from '../api/discussions';
import KanbanBoard from '../components/KanbanBoard.vue';
import DeadlinesTable from '../components/DeadlinesTable.vue';
import DiscussionList from '../components/DiscussionList.vue';
import AddTaskModal from '../components/AddTaskModal.vue';
import RolesModal from '../components/RolesModal.vue';
import TaskDetailsModal from '../components/TaskDetailsModal.vue';

const route = useRoute();
const { user } = useAuth();
const { t } = useI18n();
const { users, load: loadUsers } = useUsers();

const projectId = computed(() => parseInt(route.params.id, 10) || 1);
const projectTitle = ref('');
const tasks = ref([]);
const discussions = ref([]);

const addTaskModal = useTemplateRef('addTaskModal');
const rolesModal = useTemplateRef('rolesModal');
const taskDetailsModal = useTemplateRef('taskDetailsModal');

async function loadProject() {
  try {
    const project = await getProject(projectId.value);
    projectTitle.value = project?.name || t('nav_project');
  } catch (e) {
    projectTitle.value = t('nav_project');
  }
}

async function loadTasks() {
  try {
    tasks.value = (await getTasks(projectId.value)) || [];
  } catch (e) {
    tasks.value = [];
  }
}

async function loadDiscussions() {
  try {
    discussions.value = (await getDiscussions(projectId.value)) || [];
  } catch (e) {
    discussions.value = [];
  }
}

onMounted(() => {
  loadUsers();
  loadProject();
  loadTasks();
  loadDiscussions();
});

watch(projectId, () => {
  loadProject();
  loadTasks();
  loadDiscussions();
});

async function onCreateTask(payload) {
  if (!payload.title) return;
  try {
    await addTask({ ...payload, projectId: projectId.value });
    await loadTasks();
  } catch (e) {}
}

async function onMoveTask(taskId, status) {
  const task = tasks.value.find((t) => t.id === taskId);
  if (!task || task.status === status) return;
  try {
    await updateTask(taskId, { status });
    task.status = status;
  } catch (e) {}
}

function onOpenTask(task) {
  taskDetailsModal.value?.open(task);
}

async function onSendDiscussion(text) {
  const author = user.value?.name || t('user_default');
  try {
    const created = await addDiscussion(projectId.value, author, text);
    discussions.value.push(created);
  } catch (e) {}
}

const authorName = computed(() => user.value?.name || '');
</script>

<template>
  <section class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h1 class="h3 mb-0">{{ projectTitle || t('nav_project') }}</h1>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-primary" @click="addTaskModal?.show()">
          {{ t('project_add_task') }}
        </button>
        <button type="button" class="btn btn-outline-primary" @click="rolesModal?.show()">
          {{ t('project_roles') }}
        </button>
      </div>
    </div>

    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#board"
          type="button"
          role="tab"
        >{{ t('project_board') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#deadlines"
          type="button"
          role="tab"
        >{{ t('project_deadlines') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#files"
          type="button"
          role="tab"
        >{{ t('project_files') }}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#discussions"
          type="button"
          role="tab"
        >{{ t('project_discussions') }}</button>
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane fade show active" id="board" role="tabpanel">
        <KanbanBoard :tasks="tasks" @open-task="onOpenTask" @move-task="onMoveTask" />
      </div>
      <div class="tab-pane fade" id="deadlines" role="tabpanel">
        <DeadlinesTable :tasks="tasks" @open-task="onOpenTask" />
      </div>
      <div class="tab-pane fade" id="files" role="tabpanel">
        <div class="list-group">
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>Макет_главная.fig</span>
            <span class="badge bg-secondary">2.1 MB</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>Требования.pdf</span>
            <span class="badge bg-secondary">450 KB</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>API_spec.yaml</span>
            <span class="badge bg-secondary">15 KB</span>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="discussions" role="tabpanel">
        <DiscussionList :discussions="discussions" @send="onSendDiscussion" />
      </div>
    </div>

    <AddTaskModal ref="addTaskModal" :users="users" @created="onCreateTask" />
    <RolesModal ref="rolesModal" />
    <TaskDetailsModal ref="taskDetailsModal" :author-name="authorName" />
  </section>
</template>
