<script setup lang="ts">
import { computed } from 'vue';
import type { Activity } from '../types/domain';
import { formatRelative } from '../utils/render';

const props = defineProps<{ activity: Activity; targetName: string }>();

const ICONS: Record<Activity['action'], string> = {
  created: '✨',
  updated: '✏️',
  completed: '✅',
  commented: '💬',
  deleted: '🗑',
};

const VERBS: Record<Activity['action'], string> = {
  created: 'создали',
  updated: 'обновили',
  completed: 'выполнили',
  commented: 'прокомментировали',
  deleted: 'удалили',
};

const icon = computed(() => ICONS[props.activity.action]);
const verb = computed(() => VERBS[props.activity.action]);
</script>

<template>
  <div class="activity-item">
    <div class="activity-icon">{{ icon }}</div>
    <div>
      <div class="activity-text"><strong>Вы</strong> {{ verb }} «{{ targetName }}»</div>
      <div class="activity-time">{{ formatRelative(activity.createdAt) }}</div>
    </div>
  </div>
</template>
