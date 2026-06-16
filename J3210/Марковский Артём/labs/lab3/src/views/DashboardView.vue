<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects.js'
import { authState } from '@/stores/auth.js'
import ProjectCard from '@/components/ProjectCard.vue'
import TaskRow from '@/components/TaskRow.vue'
import NoteCard from '@/components/NoteCard.vue'
import AppModal from '@/components/AppModal.vue'
import CreateProjectModal from '@/components/CreateProjectModal.vue'

const { projects, refreshProjects } = useProjects()
const createModalRef = ref(null)
const loadError = ref(false)

onMounted(async () => {
  try {
    await refreshProjects()
  } catch {
    loadError.value = true
  }
})

const allTasks = computed(() =>
  projects.value.flatMap((p) =>
    p.tasks.map((t) => ({ ...t, projectTitle: p.title, projectId: p.id })),
  ),
)

const tasks = computed(() => allTasks.value.slice(0, 4))

const notes = computed(() =>
  projects.value.flatMap((p) =>
    p.discussion.slice(0, 1).map((d) => ({ ...d, projectTitle: p.title, projectId: p.id })),
  ),
)

const summary = computed(() => ({
  total: projects.value.length,
  taskCount: allTasks.value.length,
  admin: projects.value.filter((p) => p.role === 'Администратор').length,
  member: projects.value.filter((p) => p.role === 'Участник').length,
  watcher: projects.value.filter((p) => p.role === 'Наблюдатель').length,
}))
</script>

<template>
  <main id="mainContent" class="page-section">
    <div class="container layout-stack">
      <section class="panel-card panel-header" aria-labelledby="dashboardTitle">
        <div class="row g-4 align-items-stretch">
          <div class="col-lg-8">
            <div class="eyebrow">Личный кабинет</div>
            <h1 class="page-title" id="dashboardTitle">Рабочее пространство</h1>
            <p class="page-subtitle">{{ authState.userName }}</p>
            <p class="page-text">Здесь собраны ваши проекты, задачи и последние изменения по ним.</p>
          </div>
          <div class="col-lg-4">
            <div class="stats-card" role="status" aria-live="polite" aria-label="Сводка по рабочему пространству">
              <div v-if="!loadError">
                <div class="stats-line"><span>Проектов</span><strong>{{ summary.total }}</strong></div>
                <div class="stats-line"><span>Активных задач</span><strong>{{ summary.taskCount }}</strong></div>
                <div class="stats-line"><span>Администратор</span><strong>{{ summary.admin }}</strong></div>
                <div class="stats-line"><span>Участник</span><strong>{{ summary.member }}</strong></div>
                <div class="stats-line"><span>Наблюдатель</span><strong>{{ summary.watcher }}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projectsSection">
        <div class="section-head">
          <div>
            <div class="eyebrow">Проекты</div>
            <h2 class="section-title">Мои проекты</h2>
          </div>
          <div class="section-actions">
            <button class="btn btn-primary" type="button" @click="createModalRef?.show()">
              <svg class="app-icon" aria-hidden="true"><use href="/assets/icons.svg#icon-plus"></use></svg>
              <span>Новый проект</span>
            </button>
            <RouterLink class="btn btn-light" to="/search">Открыть поиск</RouterLink>
          </div>
        </div>
        <div v-if="loadError" class="empty-pane">
          Не получилось загрузить данные. Попробуйте обновить страницу.
        </div>
        <div v-else-if="projects.length" class="row g-4" role="list" aria-label="Список проектов">
          <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
        <div v-else class="empty-pane">У вас пока нет проектов.</div>
      </section>

      <section>
        <div class="row g-4">
          <div class="col-lg-7">
            <article class="panel-card h-100">
              <div class="section-head mb-3">
                <div>
                  <div class="eyebrow">Задачи</div>
                  <h2 class="section-title">Текущие задачи</h2>
                </div>
                <span class="soft-badge" role="status" aria-live="polite">{{ allTasks.length }} задач</span>
              </div>
              <div role="list" aria-label="Список текущих задач">
                <TaskRow v-for="(task, i) in tasks" :key="i" :task="task" />
                <div v-if="!tasks.length" class="empty-pane">Сейчас активных задач нет.</div>
              </div>
            </article>
          </div>
          <div class="col-lg-5">
            <article class="panel-card h-100">
              <div class="eyebrow">Уведомления</div>
              <h2 class="section-title mb-3">Что изменилось</h2>
              <div class="stack-list" role="list" aria-label="Последние изменения">
                <NoteCard v-for="(note, i) in notes" :key="i" :note="note" />
                <div v-if="!notes.length" class="empty-pane">Пока нет новых сообщений.</div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>

    <AppModal ref="createModalRef" title="Создать проект" :wide="true">
      <CreateProjectModal @close="createModalRef?.hide()" />
    </AppModal>
  </main>
</template>
