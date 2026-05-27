<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppAlert from '../components/AppAlert.vue'
import { useApi } from '../composables/useApi'
import { useFormat } from '../composables/useFormat'

const { get } = useApi()
const { compactNumber } = useFormat()

const profile = reactive({
  user: null,
  models: [],
  datasets: [],
  subscriptions: []
})

const loading = ref(false)
const message = ref('')
const messageType = ref('info')

function setMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
}

async function loadProfile() {
  setMessage('')
  loading.value = true

  try {
    const [user, models, datasets, subscriptions] = await Promise.all([
      get('/me'),
      get('/my/models'),
      get('/my/datasets'),
      get('/my/subscriptions')
    ])

    profile.user = user
    profile.models = models
    profile.datasets = datasets
    profile.subscriptions = subscriptions
  } catch (error) {
    setMessage(error.message || 'Не удалось загрузить профиль', 'danger')
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div>
    <AppAlert :type="messageType" :message="message" />

    <p v-if="loading" class="muted">Загрузка профиля...</p>

    <template v-else-if="profile.user">
      <section class="hub-card p-4 p-md-5 mb-4">
        <h1 class="section-title mb-1">
          {{ [profile.user.firstName, profile.user.lastName].filter(Boolean).join(' ') || profile.user.username }}
        </h1>

        <div class="muted mb-3 d-flex gap-3 flex-wrap">
          <small>{{ profile.user.role || 'Роль не указана' }}</small>
          <small>{{ profile.user.publicRepos || 0 }} публичных репозиториев</small>
          <small>{{ compactNumber(profile.user.stars) }} звёзд</small>
        </div>

        <p class="mb-0 muted">{{ profile.user.bio || 'Описание пользователя не заполнено' }}</p>
      </section>

      <div class="row g-4">
        <div class="col-lg-8">
          <section class="hub-card p-4 p-md-5 mb-4">
            <h2 class="section-title">Загруженные модели</h2>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Название</th>
                    <th>Задача</th>
                    <th>Framework</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!profile.models.length">
                    <td colspan="4" class="muted">Пока нет загруженных моделей</td>
                  </tr>
                  <tr v-for="model in profile.models" :key="model.id">
                    <td><RouterLink :to="{ name: 'model', params: { id: model.id } }">{{ model.title }}</RouterLink></td>
                    <td>{{ model.task }}</td>
                    <td>{{ model.framework }}</td>
                    <td>
                      <span class="status-badge" :class="model.status === 'private' ? 'status-private' : 'status-public'">
                        {{ model.status === 'private' ? 'Private' : 'Public' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="hub-card p-4 p-md-5">
            <h2 class="section-title">Загруженные датасеты</h2>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Название</th>
                    <th>Тип</th>
                    <th>Размер</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!profile.datasets.length">
                    <td colspan="3" class="muted">Пока нет загруженных датасетов</td>
                  </tr>
                  <tr v-for="dataset in profile.datasets" :key="dataset.id">
                    <td>{{ dataset.title }}</td>
                    <td>{{ dataset.type }}</td>
                    <td>{{ dataset.size }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="col-lg-4">
          <section class="hub-card p-4 mb-4">
            <h2 class="section-title">Подписки</h2>
            <ul class="list-group list-group-flush">
              <li v-if="!profile.subscriptions.length" class="list-group-item px-0 muted">Подписок пока нет</li>
              <li v-for="subscription in profile.subscriptions" :key="subscription.id" class="list-group-item px-0">
                <strong>{{ subscription.name }}</strong>
                <span class="muted"> ({{ subscription.note || 'без описания' }})</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
