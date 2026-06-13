<template>
  <li class="list-group-item">
    <div class="fw-semibold">{{ topic.title }}</div>
    <div class="small text-muted">
      {{ topic.responses ?? 0 }} ответов · {{ topic.lastActivity }}
    </div>
  </li>
</template>

<script setup>
defineProps({
  topic: { type: Object, required: true }
})
</script>