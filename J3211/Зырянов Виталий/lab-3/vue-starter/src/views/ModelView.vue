<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppAlert from '../components/AppAlert.vue'
import { useApi } from '../composables/useApi'
import { useFormat } from '../composables/useFormat'

const route = useRoute()
const { get } = useApi()
const { compactNumber } = useFormat()

const model = ref(null)
const loading = ref(false)
const message = ref('')
const messageType = ref('info')

const modelId = computed(() => Number(route.params.id || 1))

function setMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
}

async function loadModel() {
  setMessage('')
  loading.value = true

  try {
    model.value = await get(`/models/${modelId.value}`)
  } catch (error) {
    model.value = null

    if (error.status === 404) {
      setMessage('Модель не найдена', 'warning')
    } else {
      setMessage(error.message || 'Не удалось загрузить модель', 'danger')
    }
  } finally {
    loading.value = false
  }
}

watch(modelId, loadModel)
onMounted(loadModel)
</script>

<template>
  <div>
    <AppAlert :type="messageType" :message="message" />

    <p v-if="loading" class="muted">Загрузка модели...</p>

    <template v-else-if="model">
      <section class="hub-card p-4 p-md-5 mb-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-1">{{ model.title }}</h1>
            <p class="muted mb-2">{{ model.description }}</p>
            <span class="chip">{{ model.task }}</span>
            <span class="chip">{{ model.framework }}</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" type="button">Star</button>
            <button class="btn btn-outline-primary" type="button">Fork</button>
            <button class="btn btn-primary" type="button">Download</button>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <div class="col-lg-8">
          <section class="hub-card p-4 p-md-5 mb-4">
            <h2 class="section-title">Описание</h2>
            <p class="mb-0">{{ model.description }}</p>
          </section>

          <section class="hub-card p-4 p-md-5 mb-4">
            <h2 class="section-title">Метрики</h2>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Benchmark</th>
                    <th>Metric</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ model.benchmark || '-' }}</td>
                    <td>{{ model.metricName || '-' }}</td>
                    <td>{{ model.metricScore ?? '-' }}</td>
                    <td>{{ model.createdAt || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="hub-card p-4 p-md-5 mb-4">
            <h2 class="section-title">Пример использования</h2>
            <div class="code-snippet">
              <pre class="mb-0">{{ model.usageSnippet || 'Код не добавлен' }}</pre>
            </div>
          </section>

          <section class="hub-card p-4 p-md-5">
            <h2 class="section-title">Обсуждения</h2>
            <div v-if="model.discussions?.length">
              <div v-for="(entry, index) in model.discussions" :key="index" class="timeline-item">
                <strong>{{ entry.author }}</strong>
                <p class="mb-1">{{ entry.text }}</p>
                <div class="muted d-flex gap-3 flex-wrap">
                  <small>{{ entry.timeAgo }}</small>
                  <small>{{ entry.replies || 0 }} ответов</small>
                </div>
              </div>
            </div>
            <p v-else class="mb-0 muted">Обсуждений пока нет.</p>
          </section>
        </div>

        <div class="col-lg-4">
          <section class="hub-card p-4 mb-4">
            <h2 class="section-title">Загрузки</h2>
            <ul class="list-group list-group-flush">
              <li
                v-for="(file, index) in model.files || []"
                :key="index"
                class="list-group-item px-0 d-flex justify-content-between"
              >
                <span>{{ file.name }}</span>
                <strong>{{ file.size }}</strong>
              </li>
            </ul>
          </section>

          <section class="hub-card p-4 mb-4">
            <h2 class="section-title">Информация</h2>
            <div class="row g-2">
              <div class="col-4">
                <div class="social-stat"><strong>{{ compactNumber(model.stars) }}</strong><small>Stars</small></div>
              </div>
              <div class="col-4">
                <div class="social-stat"><strong>{{ compactNumber(model.forks) }}</strong><small>Forks</small></div>
              </div>
              <div class="col-4">
                <div class="social-stat"><strong>{{ compactNumber(model.threads) }}</strong><small>Threads</small></div>
              </div>
            </div>
          </section>

          <section class="hub-card p-4">
            <h2 class="section-title">Воспроизводимость</h2>
            <div v-if="model.reproducibilitySteps?.length">
              <div v-for="(step, index) in model.reproducibilitySteps" :key="index" class="timeline-item">
                <strong>{{ index + 1 }}. {{ step.title }}</strong>
                <p class="mb-0 muted">{{ step.description }}</p>
              </div>
            </div>
            <p v-else class="mb-0 muted">Данные по воспроизводимости пока не добавлены.</p>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
