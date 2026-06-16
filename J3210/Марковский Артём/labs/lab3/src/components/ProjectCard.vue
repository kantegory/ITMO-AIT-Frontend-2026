<script setup>
defineProps({ project: Object })
</script>

<template>
  <div class="col-lg-4 col-md-6">
    <article class="project-card h-100" role="listitem" :aria-label="`Проект ${project.title}`">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="soft-badge">{{ project.role }}</span>
        <span class="status-badge">{{ project.status }}</span>
      </div>
      <h2 class="project-card-title mb-2 text-wrap-anywhere" :title="project.title">{{ project.title }}</h2>
      <p class="card-text mb-3 text-wrap-anywhere">{{ project.description }}</p>
      <div class="card-meta">Срок завершения: {{ project.deadline }}</div>
      <div class="project-card-footer">
        <span class="card-meta">{{ project.members.length }} участника</span>
        <RouterLink
          class="btn btn-primary"
          :to="`/project/${project.id}`"
          :aria-label="`Открыть проект ${project.title}`"
        >Открыть проект</RouterLink>
      </div>
    </article>
  </div>
</template>
