<script setup>
defineProps({
  workspace: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'open'])
</script>

<template>
  <div class="card shadow-sm border-0 h-100 workspace-card">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="card-title mb-1">{{ workspace.name }}</h5>
          <p class="text-muted small mb-0">{{ workspace.type }}</p>
        </div>

        <span
          class="badge rounded-pill"
          :class="workspace.status === 'active' ? 'text-bg-success' : 'text-bg-secondary'"
        >
          {{ workspace.status === 'active' ? 'Активно' : 'Черновик' }}
        </span>
      </div>

      <p class="card-text text-muted flex-grow-1">
        {{ workspace.description }}
      </p>

      <div class="small text-muted mb-3">
        Узлов: {{ workspace.nodes }}
      </div>

      <div class="d-flex gap-2 flex-wrap mt-auto">
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="emit('open', workspace)"
        >
          Открыть
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="emit('edit', workspace)"
        >
          Edit
        </button>

        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="emit('delete', workspace.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>