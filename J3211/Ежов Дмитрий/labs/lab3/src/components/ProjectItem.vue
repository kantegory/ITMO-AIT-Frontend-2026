<script setup lang="ts">
import type { Project } from '../types/domain';

defineProps<{ project: Project }>();
</script>

<template>
  <div class="project-item">
    <div class="project-row">
      <span class="project-name">{{ project.name }}</span>
      <span class="project-pct">{{ project.progress }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: project.progress + '%' }" />
    </div>
  </div>
</template>
