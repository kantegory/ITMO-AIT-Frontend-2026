<script setup>
import { Activity } from '@lucide/vue'

defineProps({ activities: { type: Array, required: true } })
</script>

<template>
  <section id="activity" class="surface-card activity-card" aria-labelledby="activityTitle">
    <div class="section-heading compact">
      <div><h2 id="activityTitle">Последняя активность</h2><p>Обновления команды</p></div>
      <span class="activity-mark"><Activity /></span>
    </div>
    <div class="activity-list">
      <article v-for="item in activities" :key="item.id">
        <span :class="['activity-avatar', `avatar-${item.tone}`]">{{ item.initials }}</span>
        <div><p>{{ item.text }}</p><time>{{ item.time }}</time></div>
      </article>
    </div>
  </section>
</template>
