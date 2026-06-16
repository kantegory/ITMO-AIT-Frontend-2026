<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { normalizeImagePath } from '../utils/image';

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  saving: {
    type: Boolean,
    default: false
  },
  hasApplied: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['close', 'apply']);
const closeButton = ref(null);
let isKeydownListenerActive = false;

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}

function handleGlobalKeydown(event) {
  if (event.key === 'Escape' && props.task) {
    emit('close');
  }
}

function enableModalMode() {
  document.body.classList.add('modal-open-local');

  if (!isKeydownListenerActive) {
    window.addEventListener('keydown', handleGlobalKeydown);
    isKeydownListenerActive = true;
  }
}

function disableModalMode() {
  document.body.classList.remove('modal-open-local');

  if (isKeydownListenerActive) {
    window.removeEventListener('keydown', handleGlobalKeydown);
    isKeydownListenerActive = false;
  }
}

watch(
  () => props.task,
  async (task) => {
    if (task) {
      enableModalMode();
      await nextTick();
      closeButton.value?.focus();
      return;
    }

    disableModalMode();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  disableModalMode();
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.task"
      class="task-modal-backdrop"
      role="presentation"
      @click="handleBackdropClick"
    >
      <section
        class="modal-dialog modal-lg modal-dialog-scrollable task-modal-window"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`task-modal-title-${props.task.id}`"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5 mb-0" :id="`task-modal-title-${props.task.id}`">
              {{ props.task.title }}
            </h2>
            <button ref="closeButton" type="button" class="btn-close" aria-label="Закрыть окно" @click="emit('close')"></button>
          </div>

          <div class="modal-body">
            <div class="container-fluid px-0">
              <div class="mb-4">
                <img
                  :src="normalizeImagePath(props.task.image)"
                  :alt="`Иллюстрация к задаче ${props.task.title}`"
                  class="img-fluid rounded-4 w-100 task-modal-image"
                />
              </div>

              <div class="d-flex flex-wrap gap-2 mb-3" aria-label="Основные параметры задачи">
                <span class="badge text-bg-primary px-3 py-2">Статус: {{ props.task.status }}</span>
                <span class="badge text-bg-warning px-3 py-2">Приоритет: {{ props.task.priority }}</span>
                <span class="badge text-bg-dark px-3 py-2">Срок: {{ props.task.deadline }}</span>
              </div>

              <section class="card border-0 theme-surface-muted rounded-4 mb-4" aria-labelledby="task-general-info-title">
                <div class="card-body">
                  <h3 class="h6 text-uppercase text-muted mb-3" id="task-general-info-title">Общая информация</h3>
                  <p class="mb-2"><strong>Постановщик:</strong> {{ props.task.createdBy.name }}</p>
                  <p class="mb-0"><strong>Роль:</strong> {{ props.task.createdBy.roleLabel }}</p>
                </div>
              </section>

              <section class="mb-4" aria-labelledby="task-description-title">
                <h3 class="h5 mb-3" id="task-description-title">Описание</h3>
                <p class="mb-0">{{ props.task.description }}</p>
              </section>

              <section class="mb-4" aria-labelledby="task-participants-title">
                <h3 class="h5 mb-3" id="task-participants-title">Участники</h3>
                <template v-if="props.task.participants?.length">
                  <div
                    v-for="participant in props.task.participants"
                    :key="participant.id"
                    class="d-flex align-items-center gap-2 mb-2"
                  >
                    <img
                      :src="participant.avatar"
                      :alt="`Аватар пользователя ${participant.name}`"
                      class="rounded-circle participant-avatar"
                      width="40"
                      height="40"
                    />
                    <div>
                      <div class="fw-semibold">{{ participant.name }}</div>
                      <div class="text-muted small">{{ participant.roleLabel }}</div>
                    </div>
                  </div>
                </template>
                <p v-else class="text-muted mb-0">Участников пока нет</p>
              </section>

              <section class="mb-4" aria-labelledby="task-open-positions-title">
                <h3 class="h5 mb-3" id="task-open-positions-title">Свободные должности</h3>
                <template v-if="props.task.openPositions?.length">
                  <div
                    v-for="position in props.task.openPositions"
                    :key="position.id"
                    class="border rounded-3 p-2 mb-2 d-flex justify-content-between align-items-center gap-2 theme-surface-muted"
                  >
                    <span>{{ position.roleLabel }}</span>
                    <button
                      class="btn btn-sm"
                      :class="props.hasApplied(props.task.id, position.roleLabel) ? 'btn-success' : 'btn-primary'"
                      :disabled="props.saving || props.hasApplied(props.task.id, position.roleLabel)"
                      type="button"
                      :aria-label="`${props.hasApplied(props.task.id, position.roleLabel) ? 'Вы уже записаны на роль' : 'Записаться на роль'} ${position.roleLabel}`"
                      @click="emit('apply', position)"
                    >
                      {{ props.hasApplied(props.task.id, position.roleLabel) ? 'Вы записаны' : 'Записаться' }}
                    </button>
                  </div>
                </template>
                <p v-else class="text-muted mb-0">Свободных мест нет</p>
              </section>

              <section class="mb-4" aria-labelledby="task-files-title">
                <h3 class="h5 mb-3" id="task-files-title">Файлы</h3>
                <ul v-if="props.task.files?.length" class="list-group list-group-flush">
                  <li
                    v-for="file in props.task.files"
                    :key="file.id"
                    class="list-group-item d-flex justify-content-between align-items-center gap-3"
                  >
                    <span>{{ file.name }}</span>
                    <span class="badge text-bg-secondary flex-shrink-0">{{ file.size }}</span>
                  </li>
                </ul>
                <p v-else class="text-muted mb-0">Файлы не прикреплены</p>
              </section>

              <section aria-labelledby="task-comments-title">
                <h3 class="h5 mb-3" id="task-comments-title">Комментарии</h3>
                <template v-if="props.task.comments?.length">
                  <div
                    v-for="comment in props.task.comments"
                    :key="comment.id"
                    class="border rounded-3 p-3 mb-2 theme-comment-box"
                  >
                    <div class="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <strong>{{ comment.author }}</strong>
                      <span class="text-muted small flex-shrink-0">{{ comment.createdAt }}</span>
                    </div>
                    <div>{{ comment.text }}</div>
                  </div>
                </template>
                <p v-else class="text-muted mb-0">Комментариев пока нет</p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>
