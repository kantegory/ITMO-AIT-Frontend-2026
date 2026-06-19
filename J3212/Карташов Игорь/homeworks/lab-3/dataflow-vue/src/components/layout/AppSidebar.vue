<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

function isActive(name) {
  if (name === 'pipelines') {
    return route.name === 'pipelines' || route.name === 'pipeline-detail'
  }
  return route.name === name
}
</script>

<template>
  <div class="sidebar">
    <h4><i class="bi bi-diagram-3-fill"></i> DataFlow</h4>

    <div class="section-title">Main</div>
    <RouterLink :class="{ active: isActive('pipelines') }" :to="{ name: 'pipelines' }">
      <svg class="svg-icon"><use href="/icons.svg#icon-boxes"></use></svg> Pipelines
    </RouterLink>
    <a href="#"><i class="bi bi-clock-history"></i> Runs</a>

    <div class="section-title">Monitor</div>
    <a href="#"><i class="bi bi-activity"></i> Metrics</a>
    <a href="#"><i class="bi bi-exclamation-triangle"></i> Alerts</a>

    <div class="section-title">Settings</div>
    <RouterLink :class="{ active: isActive('profile') }" :to="{ name: 'profile' }">
      <i class="bi bi-plug"></i> Connections
    </RouterLink>
    <RouterLink :class="{ active: isActive('profile') }" :to="{ name: 'profile' }">
      <i class="bi bi-person-circle"></i> Profile
    </RouterLink>
  </div>
</template>
