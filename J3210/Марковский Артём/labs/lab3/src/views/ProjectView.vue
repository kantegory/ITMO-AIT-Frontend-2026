<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjects } from '@/composables/useProjects.js'
import AppModal from '@/components/AppModal.vue'
import TeamModal from '@/components/TeamModal.vue'
import TasksModal from '@/components/TasksModal.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import DiscussionModal from '@/components/DiscussionModal.vue'

const route = useRoute()
const router = useRouter()
const { refreshProject, getProject } = useProjects()

const loadError = ref(false)
const selectedTask = ref(null)
const selectedFile = ref(null)

const teamModalRef = ref(null)
const tasksModalRef = ref(null)
const settingsModalRef = ref(null)
const discussionModalRef = ref(null)
const infoModalRef = ref(null)

const projectId = computed(() => route.params.id)
const project = computed(() => getProject(projectId.value))

const infoTitle = computed(() => {
  if (selectedTask.value) return selectedTask.value.title
  if (selectedFile.value) return selectedFile.value.name
  return ''
})

onMounted(async () => {
  try {
    await refreshProject(projectId.value)
  } catch {
    loadError.value = true
  }
})

function openActionModal(type) {
  if (type === 'team') teamModalRef.value?.show()
  else if (type === 'tasks') tasksModalRef.value?.show()
  else if (type === 'settings') settingsModalRef.value?.show()
  else if (type === 'discussion') discussionModalRef.value?.show()
}

function openTaskDetail(task) {
  selectedTask.value = task
  selectedFile.value = null
  infoModalRef.value?.show()
}

function openFileDetail(file) {
  selectedFile.value = file
  selectedTask.value = null
  infoModalRef.value?.show()
}

function getRoleDescription(role) {
  if (role === 'Администратор') return 'Можно менять состав команды, задачи и основные параметры проекта.'
  if (role === 'Участник') return 'Можно работать с задачами и писать в обсуждении проекта.'
  return 'Можно смотреть задачи, сроки и файлы, но без редактирования.'
}

const statuses = ['Новая', 'В работе', 'На проверке', 'Завершено']

function tasksForStatus(status) {
  return project.value?.tasks.filter((t) => t.status === status) || []
}
</script>

<template>
  <main id="mainContent" class="page-section">
    <div v-if="loadError" class="container">
      <div class="panel-card mt-4">
        <p class="mb-0">Не получилось загрузить данные проекта. Попробуйте обновить страницу.</p>
      </div>
    </div>

    <div v-else-if="project" class="container layout-stack">
      <section class="panel-card panel-header" aria-labelledby="projectTitle">
        <div class="row g-4 align-items-stretch">
          <div class="col-lg-8">
            <div class="badge-row">
              <span class="soft-badge">{{ project.role }}</span>
              <span class="status-badge">{{ project.status }}</span>
            </div>
            <div class="eyebrow mt-3">Проект</div>
            <h1 class="page-title" id="projectTitle">{{ project.title }}</h1>
            <p class="page-text">{{ project.description }}</p>
          </div>
          <div class="col-lg-4">
            <div class="stats-card project-info-card">
              <div class="stats-line">
                <span>Срок завершения</span>
                <strong>{{ project.deadline }}</strong>
              </div>
              <div class="stats-line align-items-start">
                <span>Участники</span>
                <div class="member-list" role="list" aria-label="Участники проекта">
                  <div
                    v-for="(member, i) in project.members"
                    :key="i"
                    class="member-item"
                    role="listitem"
                  >
                    <div class="text-wrap-anywhere" :title="member.name">{{ member.name }}</div>
                    <div class="member-role">{{ member.role }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="row g-4">
          <div class="col-lg-8">
            <article class="panel-card h-100" id="projectBoardSection">
              <div class="section-head mb-3">
                <div>
                  <div class="eyebrow">Задачи</div>
                  <h2 class="section-title">Доска задач</h2>
                </div>
                <span class="soft-badge">{{ project.tasks.length }} задач</span>
              </div>
              <div class="row g-3" role="list" aria-label="Доска задач">
                <div v-for="status in statuses" :key="status" class="col-lg-3 col-md-6">
                  <div class="board-column" role="listitem" :aria-label="`Колонка ${status}`">
                    <div class="board-column-title">{{ status }}</div>
                    <div class="board-list" role="list">
                      <button
                        v-for="task in tasksForStatus(status)"
                        :key="task.title"
                        class="board-task"
                        type="button"
                        :aria-label="`Открыть задачу ${task.title}`"
                        @click="openTaskDetail(task)"
                      >
                        <div class="fw-bold mb-2 text-wrap-anywhere" :title="task.title">{{ task.title }}</div>
                        <div class="card-meta text-wrap-anywhere" :title="task.assignee">{{ task.assignee }}</div>
                        <div class="card-meta text-wrap-anywhere">{{ task.priority }} приоритет · {{ task.due }}</div>
                      </button>
                      <div v-if="!tasksForStatus(status).length" class="card-meta">Нет задач</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="col-lg-4">
            <article class="panel-card h-100">
              <div class="eyebrow">Роль</div>
              <h2 class="section-title">Доступ по роли</h2>
              <div class="role-card-current mt-3">
                <div class="role-name">{{ project.role }}</div>
                <p class="role-text">{{ getRoleDescription(project.role) }}</p>
              </div>
              <div class="eyebrow mt-4">Что можно делать</div>
              <div class="action-list" role="list" aria-label="Доступные действия">
                <button
                  v-for="action in project.actions"
                  :key="action.type"
                  class="action-button"
                  type="button"
                  :title="action.title"
                  :aria-label="action.title"
                  role="listitem"
                  @click="openActionModal(action.type)"
                >
                  {{ action.title }}
                  <span>{{ action.text }}</span>
                </button>
                <div v-if="!project.actions.length" class="action-empty">
                  Для роли наблюдателя доступны просмотр задач, сроков, файлов и обсуждений проекта.
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="projectWorkspaceSection">
        <ul class="nav nav-pills app-tabs gap-2 mb-3" role="tablist" aria-label="Разделы проекта">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="deadlines-tab"
              data-bs-toggle="pill"
              data-bs-target="#deadlines-pane"
              type="button"
              role="tab"
            >Сроки</button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="files-tab"
              data-bs-toggle="pill"
              data-bs-target="#files-pane"
              type="button"
              role="tab"
            >Файлы</button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="discussion-tab"
              data-bs-toggle="pill"
              data-bs-target="#discussion-pane"
              type="button"
              role="tab"
            >Обсуждения</button>
          </li>
        </ul>
        <div class="tab-content panel-card">
          <div class="tab-pane fade show active" id="deadlines-pane" role="tabpanel" tabindex="0">
            <div class="table-responsive">
              <table class="table app-table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Этап</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Ответственный</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in project.deadlines" :key="i">
                    <td>{{ item.stage }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.owner }}</td>
                  </tr>
                  <tr v-if="!project.deadlines.length">
                    <td colspan="3" class="table-empty">Сроки ещё не добавлены.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="tab-pane fade" id="files-pane" role="tabpanel" tabindex="0">
            <div class="list-stack" role="list" aria-label="Файлы проекта">
              <button
                v-for="(file, i) in project.files"
                :key="i"
                class="file-card"
                type="button"
                @click="openFileDetail(file)"
              >
                <div class="file-card-line">
                  <div>
                    <div class="fw-bold mb-1 text-wrap-anywhere" :title="file.name">{{ file.name }}</div>
                    <div class="file-meta text-wrap-anywhere">{{ file.description }}</div>
                  </div>
                  <span class="soft-badge">{{ file.type }}</span>
                </div>
              </button>
              <div v-if="!project.files.length" class="empty-pane">Файлы ещё не добавлены.</div>
            </div>
          </div>
          <div class="tab-pane fade" id="discussion-pane" role="tabpanel" tabindex="0">
            <div class="stack-list" role="list" aria-label="Обсуждение проекта">
              <article v-for="(item, i) in project.discussion" :key="i" class="discussion-card">
                <div class="fw-bold text-wrap-anywhere" :title="item.author">{{ item.author }}</div>
                <div class="note-meta mb-2">{{ item.time }}</div>
                <p class="mb-0 text-wrap-anywhere">{{ item.text }}</p>
              </article>
              <div v-if="!project.discussion.length" class="empty-pane">Сообщений пока нет.</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <AppModal ref="teamModalRef" title="Команда" :wide="true">
      <TeamModal v-if="project" :project="project" />
    </AppModal>

    <AppModal ref="tasksModalRef" title="Задачи" :wide="true">
      <TasksModal v-if="project" :project="project" />
    </AppModal>

    <AppModal ref="settingsModalRef" title="Настройки" :wide="true">
      <SettingsModal
        v-if="project"
        :project="project"
        @close="settingsModalRef?.hide()"
      />
    </AppModal>

    <AppModal ref="discussionModalRef" title="Обсуждение" :wide="true">
      <DiscussionModal v-if="project" :project="project" />
    </AppModal>

    <AppModal ref="infoModalRef" :title="infoTitle">
      <div v-if="selectedTask" class="stack-list">
        <div><span class="card-meta">Статус:</span> {{ selectedTask.status }}</div>
        <div><span class="card-meta">Приоритет:</span> {{ selectedTask.priority }}</div>
        <div><span class="card-meta">Исполнитель:</span> {{ selectedTask.assignee }}</div>
        <div><span class="card-meta">Срок:</span> {{ selectedTask.due }}</div>
      </div>
      <div v-else-if="selectedFile" class="stack-list">
        <div><span class="card-meta">Тип:</span> {{ selectedFile.type }}</div>
        <div><span class="card-meta">Описание:</span> {{ selectedFile.description }}</div>
        <div><span class="card-meta">Проект:</span> {{ project?.title }}</div>
      </div>
    </AppModal>
  </main>
</template>
