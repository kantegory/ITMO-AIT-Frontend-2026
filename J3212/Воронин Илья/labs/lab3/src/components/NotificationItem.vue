<script setup>
import { computed } from 'vue';

const props = defineProps({ notification: { type: Object, required: true } });

const formatted = computed(() =>
  props.notification.createdAt
    ? new Date(props.notification.createdAt).toLocaleString('ru-RU')
    : '',
);
</script>

<template>
  <div
    class="list-group-item notification-item"
    :class="{ unread: !notification.read }"
  >
    <div class="d-flex w-100 justify-content-between">
      <h6 class="mb-1">{{ notification.title }}</h6>
      <small>{{ formatted }}</small>
    </div>
    <p class="mb-0 small text-muted">{{ notification.body }}</p>
  </div>
</template>
