<template>
  <main id="main-content" role="main" class="container py-4 py-lg-5" tabindex="-1">
    <section class="hero p-4 p-lg-5 mb-4 mb-lg-5 fade-up">
      <div class="row align-items-center g-4">
        <div class="col-lg-8">
          <p class="badge badge-soft rounded-pill mb-3">Личный кабинет пользователя</p>
          <h1 class="display-6 fw-bold mb-3">{{ userName || 'Загрузка профиля...' }}</h1>
          <p class="text-secondary mb-0" aria-live="polite">{{ userSummary }}</p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <RouterLink class="btn btn-brand me-2" to="/search">Найти задачи</RouterLink>
          <RouterLink class="btn btn-outline-brand" to="/workers">Управление командой</RouterLink>
        </div>
      </div>
    </section>

    <section class="row g-3 g-lg-4 mb-4" aria-label="Ключевые метрики">
      <div class="col-md-6 col-xl-3 fade-up">
        <MetricCard label="Активные проекты" :value="metrics.activeProjects" />
      </div>
      <div class="col-md-6 col-xl-3 fade-up fade-up-delay">
        <MetricCard label="Задач в работе" :value="metrics.activeTasks" />
      </div>
      <div class="col-md-6 col-xl-3 fade-up fade-up-delay-2">
        <MetricCard label="Среднее качество" :value="metrics.averageQuality" />
      </div>
      <div class="col-md-6 col-xl-3 fade-up fade-up-delay-2">
        <MetricCard label="Новых сотрудников" :value="metrics.newWorkers" />
      </div>
    </section>

    <section class="row g-4">
      <div class="col-lg-8">
        <article class="glass-card p-4 h-100">
          <h2 class="h4 mb-3">Проекты аннотации</h2>
          <div v-if="error" class="text-danger">{{ error }}</div>
          <div v-else class="table-responsive">
            <table class="table align-middle">
              <caption class="visually-hidden">Список проектов аннотации с прогрессом и качеством</caption>
              <thead>
                <tr>
                  <th scope="col">Проект</th>
                  <th scope="col">Тип</th>
                  <th scope="col">Прогресс</th>
                  <th scope="col">Качество</th>
                </tr>
              </thead>
              <tbody aria-live="polite">
                <tr v-if="!projects.length">
                  <td colspan="4" class="text-secondary">Загрузка проектов...</td>
                </tr>
                <tr v-for="project in projects" :key="project.id">
                  <th scope="row">{{ project.dashboardTitle }}</th>
                  <td>{{ project.type }}</td>
                  <td>
                    <div
                      class="progress"
                      role="progressbar"
                      :aria-label="`progress ${project.progress}`"
                      :aria-valuenow="project.progress"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        :class="['progress-bar', project.progress >= 70 ? 'bg-success' : project.progress >= 40 ? '' : 'bg-info']"
                        :style="{ width: `${project.progress}%` }"
                      >
                        {{ project.progress }}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="`badge text-bg-${qualityBadge(project.quality)}`">{{ project.quality }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div class="col-lg-4">
        <article class="glass-card p-4 h-100">
          <h2 class="h5 mb-3">Статистика качества</h2>
          <p class="text-secondary mb-2">Валидация за неделю</p>
          <div class="progress mb-3" role="progressbar" aria-label="Валидация за неделю" :aria-valuenow="qualityStats.validation" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar bg-success" :style="{ width: `${qualityStats.validation}%` }">{{ qualityStats.validation }}%</div>
          </div>
          <p class="text-secondary mb-2">Доля задач с повторной проверкой</p>
          <div class="progress mb-3" role="progressbar" aria-label="Повторная проверка" :aria-valuenow="qualityStats.recheck" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar bg-warning" :style="{ width: `${qualityStats.recheck}%` }">{{ qualityStats.recheck }}%</div>
          </div>
          <p class="text-secondary mb-2">SLA выполнения</p>
          <div class="progress" role="progressbar" aria-label="SLA выполнения" :aria-valuenow="qualityStats.sla" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" :style="{ width: `${qualityStats.sla}%` }">{{ qualityStats.sla }}%</div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MetricCard from '../components/MetricCard.vue'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'

const { getSession } = useAuth()
const { get } = useApi()

const userName = ref('')
const userSummary = ref('Получаем актуальные показатели из API.')
const projects = ref([])
const error = ref('')
const metrics = ref({ activeProjects: null, activeTasks: null, averageQuality: null, newWorkers: null })
const qualityStats = ref({ validation: 0, recheck: 0, sla: 0 })

function qualityBadge(value) {
  if (value >= 95) return 'success'
  if (value >= 90) return 'primary'
  return 'warning'
}

function formatPercent(value) {
  return `${Number(value).toFixed(1).replace('.0', '')}%`
}

function average(values) {
  if (!values.length) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

onMounted(async () => {
  const session = getSession()
  if (!session) return
  try {
    const [user, projectList, tasks, workers, stats] = await Promise.all([
      get(`/users/${session.userId}`),
      get('/projects'),
      get('/tasks'),
      get('/workers'),
      get('/qualityStats/1'),
    ])

    userName.value = `${user.firstName} ${user.lastName}, ${user.role.toLowerCase()}`
    projects.value = projectList

    const activeProjects = projectList.length
    const activeTasks = tasks.reduce((sum, t) => sum + t.progressTotal, 0)
    const avgQuality = average(projectList.map((p) => p.quality))
    const newWorkers = workers.filter((w) => w.isNew).length

    userSummary.value = `Ведёте ${activeProjects} активных проекта. Средний показатель качества команды за 30 дней: ${formatPercent(avgQuality)}.`
    metrics.value = {
      activeProjects,
      activeTasks,
      averageQuality: formatPercent(avgQuality),
      newWorkers,
    }
    qualityStats.value = { validation: stats.validation, recheck: stats.recheck, sla: stats.sla }
  } catch (err) {
    error.value = err.message
    userName.value = 'Не удалось загрузить кабинет'
    userSummary.value = err.message
  }
})
</script>
