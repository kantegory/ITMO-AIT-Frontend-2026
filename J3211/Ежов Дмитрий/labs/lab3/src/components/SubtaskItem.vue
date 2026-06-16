<script setup lang="ts">
import { computed } from 'vue';
import type { Subtask } from '../types/domain';
import { useAuth } from '../composables/useAuth';

const props = defineProps<{ subtask: Subtask }>();
const emit = defineEmits<{ toggle: [id: number] }>();

const { user } = useAuth();

const assigneeLabel = computed(() =>
  user.value && user.value.id === props.subtask.assigneeId
    ? user.value.name
    : `#${props.subtask.assigneeId}`,
);
</script>

<template>
  <div class="subtask-item" :class="{ 'done-item': subtask.done }">
    <div
      class="subtask-check"
      :class="{ done: subtask.done }"
      role="checkbox"
      tabindex="0"
      :aria-checked="subtask.done"
      :aria-label="`Отметить «${subtask.text}»`"
      @click="emit('toggle', subtask.id)"
      @keydown.enter.prevent="emit('toggle', subtask.id)"
      @keydown.space.prevent="emit('toggle', subtask.id)"
    >
      <svg
        v-if="subtask.done"
        width="9"
        height="9"
        viewBox="0 0 12 12"
        fill="none"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="2 6 5 9 10 3" />
      </svg>
    </div>
    <span class="subtask-text">{{ subtask.text }}</span>
    <span class="subtask-assignee">{{ assigneeLabel }}</span>
  </div>
</template>
