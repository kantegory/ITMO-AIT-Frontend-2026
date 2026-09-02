<script setup>
import { ArrowRight, BarChart3, CalendarDays, PanelsTopLeft, Smartphone } from '@lucide/vue'

defineProps({ projects: { type: Array, required: true } })

const iconMap = {
  phone: Smartphone,
  window: PanelsTopLeft,
  chart: BarChart3,
}
</script>

<template>
  <section id="projects" class="content-section" aria-labelledby="projectsTitle">
    <div class="section-heading">
      <div><h2 id="projectsTitle">Активные проекты</h2><p>Проекты, в которых вы участвуете</p></div>
      <a href="#tasks">Смотреть все <ArrowRight :size="18" /></a>
    </div>

    <div class="projects-grid">
      <article v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-card-top">
          <span :class="['project-symbol', `tone-${project.color}`]"><component :is="iconMap[project.icon]" /></span>
          <span :class="['status-pill', project.status === 'Активен' ? 'status-active' : 'status-planning']">{{ project.status }}</span>
        </div>
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
        <div class="project-progress-meta"><span>Прогресс проекта</span><strong>{{ project.progress }}%</strong></div>
        <div class="progress-track" role="progressbar" :aria-label="`Прогресс проекта ${project.name}`" :aria-valuenow="project.progress" aria-valuemin="0" aria-valuemax="100">
          <span :class="`progress-${project.color}`" :style="{ width: `${project.progress}%` }"></span>
        </div>
        <div class="project-card-footer">
          <div class="avatar-stack"><span v-for="member in project.members" :key="member">{{ member }}</span></div>
          <span><CalendarDays :size="16" />{{ project.deadline }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
