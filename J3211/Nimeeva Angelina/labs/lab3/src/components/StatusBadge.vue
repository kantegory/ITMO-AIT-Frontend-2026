<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: '' } })

const BADGE_MAP = {
  free:     { text: 'Свободно',        cls: 'status-free' },
  reserved: { text: 'В резерве',       cls: 'status-reserved' },
  rented:   { text: 'Сдано',           cls: 'status-rented' },
  pending:  { text: 'На проверке',     cls: 'status-pending' },
  accepted: { text: 'Принято',         cls: 'status-accepted' },
  rejected: { text: 'Отклонено',       cls: 'status-rejected' },
  received: { text: 'Получено',        cls: 'status-received' },
  signed:   { text: 'Подписан',        cls: 'status-accepted' },
  review:   { text: 'На проверке',     cls: 'status-pending' },
}

const badge = computed(() => BADGE_MAP[props.status] || { text: props.status, cls: 'status-received' })
</script>

<template>
  <span class="badge app-badge" :class="badge.cls">{{ badge.text }}</span>
</template>
