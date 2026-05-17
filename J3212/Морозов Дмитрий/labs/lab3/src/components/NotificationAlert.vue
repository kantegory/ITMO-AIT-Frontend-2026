<script setup>
defineProps({
  notification: {
    type: Object,
    default: null,
  },
});
</script>

<template>
  <div
    v-if="notification"
    class="alert mt-3"
    :class="`alert-${notification.type}`"
    role="alert"
    aria-live="assertive"
  >
    {{ notification.message }}
  </div>
</template>
