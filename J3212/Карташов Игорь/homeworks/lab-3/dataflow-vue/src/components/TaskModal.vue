<script setup>
defineProps({
  task: { type: Object, default: null },
})

defineEmits(['close'])
</script>

<template>
  <div v-if="task" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ task.name }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <p><strong>Task ID:</strong> {{ task.taskId }}</p>
          <p><strong>Start Time:</strong> {{ task.start }}</p>
          <p><strong>Duration:</strong> {{ task.duration }}</p>
          <p><strong>Status:</strong> {{ task.status }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
