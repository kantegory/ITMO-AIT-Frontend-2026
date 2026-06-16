<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects.js'

const { projects, refreshProjects } = useProjects()
const query = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const assigneeFilter = ref('all')
const searched = ref(false)
const loadError = ref(false)

onMounted(async () => {
  try {
    await refreshProjects()
    searched.value = true
  } catch {
    loadError.value = true
  }
})

const allTasks = computed(() =>
  projects.value.flatMap((p) =>
    p.tasks.map((t) => ({
      ...t,
      projectTitle: p.title,
      projectId: p.id,
      role: p.role,
    })),
  ),
)

const assignees = computed(() => {
  const names = [...new Set(allTasks.value.map((t) => t.assignee))].sort((a, b) =>
    a.localeCompare(b, 'ru'),
  )
  return names
})

const filtered = computed(() => {
  if (!searched.value) return []
  return allTasks.value.filter((task) => {
    const q = query.value.trim().toLowerCase()
    const matchesQuery = !q || `${task.title} ${task.projectTitle}`.toLowerCase().includes(q)
    const matchesStatus = statusFilter.value === 'all' || task.status === statusFilter.value
    const matchesPriority = priorityFilter.value === 'all' || task.priority === priorityFilter.value
    const matchesAssignee = assigneeFilter.value === 'all' || task.assignee === assigneeFilter.value
    return matchesQuery && matchesStatus && matchesPriority && matchesAssignee
  })
})

function applySearch() {
  searched.value = true
}
</script>

<template>
  <main id="mainContent" class="page-section">
    <div class="container layout-stack">
      <section class="panel-card" aria-labelledby="searchPageTitle">
        <div class="eyebrow">Поиск</div>
        <h1 class="section-title section-title-lg" id="searchPageTitle">Поиск по задачам</h1>
        <div class="row g-3 align-items-end mt-1">
          <div class="col-lg-4">
            <label class="form-label" for="searchQuery">Что ищем</label>
            <input
              class="form-control"
              id="searchQuery"
              type="text"
              placeholder="Например: регистрация или Sprint"
              v-model="query"
              @keydown.enter.prevent="applySearch"
            />
          </div>
          <div class="col-md-4 col-lg-2">
            <label class="form-label" for="statusFilter">Статус</label>
            <select class="form-select" id="statusFilter" v-model="statusFilter">
              <option value="all">Все</option>
              <option value="Новая">Новая</option>
              <option value="В работе">В работе</option>
              <option value="На проверке">На проверке</option>
              <option value="Завершено">Завершено</option>
            </select>
          </div>
          <div class="col-md-4 col-lg-2">
            <label class="form-label" for="priorityFilter">Приоритет</label>
            <select class="form-select" id="priorityFilter" v-model="priorityFilter">
              <option value="all">Все</option>
              <option value="Высокий">Высокий</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>
          </div>
          <div class="col-md-4 col-lg-2">
            <label class="form-label" for="assigneeFilter">Исполнитель</label>
            <select class="form-select" id="assigneeFilter" v-model="assigneeFilter">
              <option value="all">Все</option>
              <option v-for="name in assignees" :key="name" :value="name">{{ name }}</option>
            </select>
          </div>
          <div class="col-lg-2 d-grid">
            <button
              class="btn btn-primary"
              type="button"
              aria-describedby="searchResultCount"
              @click="applySearch"
            >
              <svg class="app-icon" aria-hidden="true"><use href="/assets/icons.svg#icon-search"></use></svg>
              <span>Применить</span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div class="section-head">
          <div>
            <div class="eyebrow">Результаты</div>
            <h2 class="section-title">Найденные задачи</h2>
          </div>
          <span class="soft-badge" id="searchResultCount" role="status" aria-live="polite">
            {{ filtered.length }} результатов
          </span>
        </div>
        <div v-if="loadError" class="empty-pane">Не получилось загрузить задачи.</div>
        <div v-else-if="filtered.length" class="row g-4" role="list" aria-live="polite">
          <div v-for="(task, i) in filtered" :key="i" class="col-lg-6">
            <article class="task-card h-100" role="listitem" :aria-label="`Задача ${task.title}`">
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="soft-badge">{{ task.status }}</span>
                <span class="soft-badge">{{ task.priority }}</span>
                <span class="soft-badge">{{ task.role }}</span>
              </div>
              <h2 class="task-card-title text-wrap-anywhere" :title="task.title">{{ task.title }}</h2>
              <p class="card-text mb-3">
                Проект:
                <RouterLink
                  class="link-dark fw-semibold text-decoration-none"
                  :to="`/project/${task.projectId}`"
                >{{ task.projectTitle }}</RouterLink>
              </p>
              <div class="card-meta text-wrap-anywhere">Исполнитель: {{ task.assignee }}</div>
              <div class="task-card-footer">
                <span class="card-meta">Срок: {{ task.due }}</span>
                <RouterLink
                  class="btn btn-primary"
                  :to="`/project/${task.projectId}`"
                  :aria-label="`Открыть проект ${task.projectTitle}`"
                >Открыть проект</RouterLink>
              </div>
            </article>
          </div>
        </div>
        <div v-else-if="searched" class="empty-pane">Ничего не нашлось. Попробуйте поменять фильтры или запрос.</div>
      </section>
    </div>
  </main>
</template>
