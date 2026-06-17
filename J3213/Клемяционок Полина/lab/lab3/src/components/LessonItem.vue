<template>
  <div class="card mb-3 p-3">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <strong>{{ date }} {{ time }}</strong><br>
        <small class="text-muted">Длительность: {{ duration }} мин</small>
        <div v-if="studentName" class="text-success fw-bold mt-1">{{ studentName }}</div>
      </div>
      <div class="text-end">
        <slot name="badge"></slot><br>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ date: String, time: String, duration: Number, studentName: String })
</script>