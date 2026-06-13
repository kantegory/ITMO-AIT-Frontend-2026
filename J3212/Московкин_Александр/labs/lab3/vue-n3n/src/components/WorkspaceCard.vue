<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <div class="fw-semibold">{{ workspace.name }}</div>
      <div v-if="workspace.description" class="small text-muted">{{ workspace.description }}</div>
      <span class="badge bg-secondary text-capitalize mt-1">{{ workspace.type || 'other' }}</span>
    </div>
    <div class="d-flex gap-2">
      <router-link :to="`/workspaces/${workspace.id}`" class="btn btn-sm btn-outline-primary">
        Открыть
      </router-link>
      <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', workspace.id)">
        Удалить
      </button>
    </div>
  </li>
</template>

<script setup>
defineProps({
  workspace: { type: Object, required: true }
})
defineEmits(['delete'])
</script>