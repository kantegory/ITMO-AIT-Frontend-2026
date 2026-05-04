<script setup>
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import { Modal } from 'bootstrap';
import { useI18n } from '../composables/useI18n';

const { t } = useI18n();
const root = useTemplateRef('root');
let modal = null;

const members = [
  { name: 'Иван Петров', role: 'admin' },
  { name: 'Мария Сидорова', role: 'member' },
  { name: 'Алексей Козлов', role: 'member' },
  { name: 'Ольга Новикова', role: 'viewer' },
];

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

defineExpose({ show, hide });
</script>

<template>
  <div ref="root" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('project_roles') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="modal-body">
          <ul class="list-group list-group-flush">
            <li
              v-for="m in members"
              :key="m.name"
              class="list-group-item px-0"
              :class="`role-${m.role}`"
            >
              <strong>{{ m.name }}</strong> — {{ t(`project_role_${m.role}`) }}
              <span class="d-block small text-muted">
                {{ t(`project_role_${m.role}_desc`) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
