<script setup>
import { onMounted, onBeforeUnmount, ref, useTemplateRef } from 'vue';
import { Modal } from 'bootstrap';
import { useI18n } from '../composables/useI18n';

const emit = defineEmits(['created']);
const { t } = useI18n();

const name = ref('');
const description = ref('');
const root = useTemplateRef('root');
let modal = null;

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
  emit('created', {
    name: name.value.trim(),
    description: description.value.trim(),
  });
  name.value = '';
  description.value = '';
  hide();
}

defineExpose({ show, hide });
</script>

<template>
  <div ref="root" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('dash_new_project') }}</h5>
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
              <label for="project-name" class="form-label">{{ t('dash_project_name') }}</label>
              <input
                id="project-name"
                v-model="name"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label for="project-desc" class="form-label">{{ t('dash_project_desc') }}</label>
              <input id="project-desc" v-model="description" type="text" class="form-control" />
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
