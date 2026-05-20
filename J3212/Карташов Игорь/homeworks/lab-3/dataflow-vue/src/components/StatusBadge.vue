<script setup>
import { useStatus } from '../composables/useStatus'

defineProps({
  status: { type: String, required: true },
})

const { badgeClass, label } = useStatus()
</script>

<template>
  <span class="badge" :class="badgeClass(status)">{{ label(status) }}</span>
</template>
