<template>
  <div v-if="notification" class="notification-toast" :class="{ error: notification.isError }" role="alert">
    <div class="notification-content">
      <span class="notification-message">{{ notification.message }}</span>
      <button class="notification-close" @click="hideNotification" aria-label="Закрыть">×</button>
    </div>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'

const { notification, hideNotification } = useNotification()
</script>