<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: { type: Array, default: () => [] },
})

const emit = defineEmits(['task-click'])

const groupedOrders = computed(() => {
  const grouped = {}
  props.tasks.forEach((task) => {
    if (!grouped[task.order]) grouped[task.order] = []
    grouped[task.order].push(task)
  })
  return Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .map((order) => grouped[order])
})

function onTaskClick(task) {
  emit('task-click', task)
}
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <template v-for="(group, index) in groupedOrders" :key="index">
      <div v-if="index > 0" class="dag-arrow">&darr;</div>

      <div v-if="group.length === 1" class="dag-box" :class="group[0].status" @click="onTaskClick(group[0])">
        <i :class="`bi bi-${group[0].icon}`"></i> {{ group[0].name }}
      </div>

      <div v-else class="d-flex gap-4">
        <div v-for="task in group" :key="task.id" class="text-center">
          <div class="dag-box" :class="task.status" @click="onTaskClick(task)">
            <i :class="`bi bi-${task.icon}`"></i> {{ task.name }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
