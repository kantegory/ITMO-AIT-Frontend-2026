<script setup>
import { computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import UserInfoCard from '@/components/UserInfoCard.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import { useAuth } from '@/composables/useAuth'
import { useProjects } from '@/composables/useProjects'
import { useTasks } from '@/composables/useTasks'

const { user } = useAuth()
const { accessibleProjects, fetchProjects } = useProjects()
const { tasks, fetchUserTasks, loading, error } = useTasks()

const todoTasks = computed(() => tasks.value.filter(task => task.status === 'To Do'))
const progressTasks = computed(() => tasks.value.filter(task => task.status === 'In Progress'))
const doneTasks = computed(() => tasks.value.filter(task => task.status === 'Done'))

onMounted(async () => {
  await fetchProjects()
  if (user.value?.id) {
    await fetchUserTasks(user.value.id)
  }
})
</script>

<template>
  <DefaultLayout>
    <UserInfoCard :user="user" />

    <section class="mb-5">
      <h2 class="mb-4">My Projects</h2>

      <div class="row">
        <template v-if="accessibleProjects.length">
          <ProjectCard
            v-for="project in accessibleProjects"
            :key="project.id"
            :project="project"
          />
        </template>
        <p v-else class="text-muted">No projects yet.</p>
      </div>
    </section>

    <section class="kanban-board">
      <h2 class="mb-4">My Tasks</h2>

      <p v-if="loading">Loading...</p>
      <p v-if="error" class="text-danger">{{ error }}</p>

      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="kanban-column kanban-todo">
            <h3 class="kanban-title">To Do</h3>
            <TaskCard v-for="task in todoTasks" :key="task.id" :task="task" />
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="kanban-column kanban-progress">
            <h3 class="kanban-title">In Progress</h3>
            <TaskCard v-for="task in progressTasks" :key="task.id" :task="task" />
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="kanban-column kanban-done">
            <h3 class="kanban-title">Done</h3>
            <TaskCard v-for="task in doneTasks" :key="task.id" :task="task" />
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>