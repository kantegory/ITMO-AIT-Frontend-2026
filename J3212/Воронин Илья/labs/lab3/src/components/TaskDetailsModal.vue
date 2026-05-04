<script setup>
import { onMounted, onBeforeUnmount, ref, computed, useTemplateRef } from 'vue';
import { Modal } from 'bootstrap';
import { useI18n } from '../composables/useI18n';
import { useTaskMeta } from '../composables/useTaskMeta';
import { getTaskComments, addTaskComment, getTaskFiles, addTaskFile } from '../api/tasks';

const props = defineProps({ authorName: { type: String, default: '' } });

const { t } = useI18n();
const { statusLabel, priorityLabel, statusBadgeClass, priorityClass, formatDate } = useTaskMeta();

const root = useTemplateRef('root');
let modal = null;

const task = ref(null);
const comments = ref([]);
const files = ref([]);
const commentText = ref('');
const fileInput = useTemplateRef('fileInput');

const formattedComments = computed(() =>
  comments.value.map((c) => ({
    ...c,
    formatted: c.createdAt ? new Date(c.createdAt).toLocaleString('ru-RU') : '',
  })),
);

onMounted(() => {
  modal = new Modal(root.value);
});

onBeforeUnmount(() => {
  if (modal) modal.dispose();
});

async function open(nextTask) {
  task.value = nextTask;
  comments.value = [];
  files.value = [];
  if (modal) modal.show();
  if (!nextTask?.id) return;
  try {
    comments.value = (await getTaskComments(nextTask.id)) || [];
  } catch (e) {
    comments.value = [];
  }
  try {
    files.value = (await getTaskFiles(nextTask.id)) || [];
  } catch (e) {
    files.value = [];
  }
}

async function refresh() {
  if (!task.value?.id) return;
  await open(task.value);
}

async function onSendComment() {
  if (!task.value?.id) return;
  const text = commentText.value.trim();
  if (!text) return;
  try {
    await addTaskComment(task.value.id, props.authorName || t('user_default'), text);
    commentText.value = '';
    comments.value = (await getTaskComments(task.value.id)) || [];
  } catch (e) {}
}

async function onUpload() {
  if (!task.value?.id || !fileInput.value || !fileInput.value.files?.length) return;
  const list = Array.from(fileInput.value.files);
  await Promise.all(
    list.map((f) =>
      addTaskFile(task.value.id, props.authorName || t('user_default'), {
        fileName: f.name,
        fileSize: f.size,
        fileType: f.type || '',
      }).catch(() => null),
    ),
  );
  fileInput.value.value = '';
  try {
    files.value = (await getTaskFiles(task.value.id)) || [];
  } catch (e) {}
}

function fileSizeLabel(size) {
  if (!size) return '—';
  return Math.max(1, Math.round(Number(size) / 1024)) + ' KB';
}

defineExpose({ open, refresh });
</script>

<template>
  <div ref="root" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('project_task') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div v-if="task" class="modal-body">
          <div class="mb-3">
            <h6 class="mb-1">{{ task.title }}</h6>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge" :class="statusBadgeClass[task.status] || 'bg-secondary'">
                {{ statusLabel(task.status) }}
              </span>
              <span
                class="badge"
                :class="task.priority ? priorityClass[task.priority] : 'bg-light text-dark'"
              >
                {{ task.priority ? priorityLabel(task.priority) : t('project_no_priority') }}
              </span>
              <span class="small text-muted">
                {{ t('project_assignee') }}: {{ task.assigneeName || '—' }}
              </span>
              <span class="small text-muted">
                {{ t('project_deadline_date') }}: {{ formatDate(task.deadline) }}
              </span>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-7">
              <div class="card">
                <div class="card-body">
                  <h6 class="mb-3">{{ t('project_comments') }}</h6>
                  <div class="mb-3">
                    <div v-if="!formattedComments.length" class="text-muted small">
                      {{ t('project_no_comments') }}
                    </div>
                    <div v-for="c in formattedComments" :key="c.id" class="comment-item">
                      <div class="d-flex justify-content-between">
                        <strong>{{ c.authorName || t('user_default') }}</strong>
                        <small class="text-muted">{{ c.formatted }}</small>
                      </div>
                      <div class="small">{{ c.text }}</div>
                    </div>
                  </div>
                  <div class="input-group">
                    <input
                      v-model="commentText"
                      type="text"
                      class="form-control"
                      :placeholder="t('project_comment_ph')"
                    />
                    <button type="button" class="btn btn-primary" @click="onSendComment">
                      {{ t('project_send') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-5">
              <div class="card">
                <div class="card-body">
                  <h6 class="mb-3">{{ t('project_attachments') }}</h6>
                  <div class="list-group mb-3">
                    <div v-if="!files.length" class="text-muted small">
                      {{ t('project_no_attachments') }}
                    </div>
                    <div
                      v-for="f in files"
                      :key="f.id"
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span class="small">{{ f.fileName || 'Файл' }}</span>
                      <span class="badge bg-secondary">{{ fileSizeLabel(f.fileSize) }}</span>
                    </div>
                  </div>
                  <input ref="fileInput" type="file" class="form-control mb-2" multiple />
                  <button type="button" class="btn btn-outline-primary w-100" @click="onUpload">
                    {{ t('project_attach_btn') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
