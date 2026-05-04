<script setup>
import { onMounted, onBeforeUnmount, reactive, useTemplateRef, watch } from 'vue';
import { Modal } from 'bootstrap';
import { useI18n } from '../composables/useI18n';

const props = defineProps({
  users: { type: Array, default: () => [] },
});
const emit = defineEmits(['created']);
const { t } = useI18n();

const form = reactive({
  title: '',
  status: 'new',
  priority: 'medium',
  assigneeId: '',
  deadline: '',
});

const root = useTemplateRef('root');
let modal = null;

watch(
  () => props.users,
  (next) => {
    if (next && next.length && !form.assigneeId) {
      form.assigneeId = String(next[0].id);
    }
  },
  { immediate: true },
);

onMounted(() => {
  modal = new Modal(root.value);
});

onBeforeUnmount(() => {
  if (modal) modal.dispose();
});

function show() {
  if (modal) modal.show();
}

function hide() {
  if (modal) modal.hide();
}

function onSubmit() {
  const assignee = props.users.find((u) => String(u.id) === String(form.assigneeId));
  emit('created', {
    title: form.title.trim(),
    status: form.status,
    priority: form.priority,
    assigneeId: form.assigneeId ? parseInt(form.assigneeId, 10) : null,
    assigneeName: assignee ? assignee.name : '',
    deadline: form.deadline || null,
  });
  form.title = '';
  form.status = 'new';
  form.priority = 'medium';
  form.deadline = '';
  hide();
}

defineExpose({ show, hide });
</script>

<template>
  <div ref="root" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('project_new_task') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <form @submit.prevent="onSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label for="task-title" class="form-label">{{ t('project_task_name') }}</label>
              <input
                id="task-title"
                v-model="form.title"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label for="task-status" class="form-label">{{ t('search_status') }}</label>
              <select id="task-status" v-model="form.status" class="form-select">
                <option value="new">{{ t('status_new') }}</option>
                <option value="progress">{{ t('status_progress') }}</option>
                <option value="review">{{ t('status_review') }}</option>
                <option value="done">{{ t('status_done') }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="task-priority" class="form-label">{{ t('search_priority') }}</label>
              <select id="task-priority" v-model="form.priority" class="form-select">
                <option value="low">{{ t('priority_low') }}</option>
                <option value="medium">{{ t('priority_medium') }}</option>
                <option value="high">{{ t('priority_high') }}</option>
                <option value="critical">{{ t('priority_critical') }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="task-assignee" class="form-label">{{ t('project_assignee') }}</label>
              <select id="task-assignee" v-model="form.assigneeId" class="form-select">
                <option v-for="u in users" :key="u.id" :value="String(u.id)">{{ u.name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="task-deadline" class="form-label">{{ t('project_deadline') }}</label>
              <input id="task-deadline" v-model="form.deadline" type="date" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ t('dash_cancel') }}
            </button>
            <button type="submit" class="btn btn-primary">{{ t('dash_add') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
