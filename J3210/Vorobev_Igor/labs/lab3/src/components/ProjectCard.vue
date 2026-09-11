<template>
  <article class="card project-card h-100">
    <div class="card-body d-flex flex-column p-3">
      <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h2 class="h6 fw-bold mb-0">{{ project.name }}</h2>
        <span class="badge" :class="{ 'badge-secondary': !role }">
          {{ role || 'Не в команде' }}
        </span>
      </div>

      <p class="project-description text-muted small mb-3">
        {{ project.description || 'Без описания' }}
      </p>

      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge">{{ project.status }}</span>
        <span class="badge">{{ project.priority }}</span>
      </div>

      <button class="btn btn-outline-black w-100 mt-auto" type="button" @click="$emit(role ? 'open' : 'join', project.id)">
        {{ role ? 'Открыть' : 'Вступить' }}
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
  role: { type: String, default: '' },
})

defineEmits(['open', 'join'])
</script>
