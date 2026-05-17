<template>
  <div class="container-xl detail-shell">
    <RouterLink to="/models" class="btn btn-sm btn-outline-glass mb-4">
      <i class="bi bi-arrow-left me-1"></i>Назад к каталогу
    </RouterLink>

    <LoadingState :loading="loading" :error="error" :empty="!model" empty-text="Модель не найдена">
      <div v-if="model" class="detail-card">
        <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <div class="item-badge mb-2">
              <i class="bi bi-cpu"></i> {{ model.tagLabel }}
            </div>
            <h1 class="detail-title">{{ model.title }}</h1>
            <p class="item-desc mt-2 mb-0" style="max-width:640px">{{ model.description }}</p>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <button
              class="btn btn-sm like-btn"
              :class="{ liked: isLiked(model.id) }"
              @click="toggle(model.id)"
            >
              <i class="bi bi-heart-fill me-1"></i>{{ model.likes + (isLiked(model.id) ? 1 : 0) }} лайков
            </button>
            <span class="btn btn-sm btn-outline-glass disabled">
              <i class="bi bi-download me-1"></i>{{ model.downloads }} загрузок
            </span>
          </div>
        </div>

        <hr class="opacity-25" />

        <div class="row g-3 mt-1">
          <div class="col-md-4" v-if="model.badge">
            <div class="metric-chip">
              <i class="bi bi-bar-chart-line"></i> {{ model.badge }}
            </div>
            <div class="item-meta mt-1">Метрика</div>
          </div>
          <div class="col-md-4" v-if="model.extra1">
            <div class="metric-chip">
              <i class="bi bi-speedometer2"></i> {{ model.extra1 }}
            </div>
            <div class="item-meta mt-1">Производительность</div>
          </div>
          <div class="col-md-4">
            <div class="metric-chip">
              <i class="bi bi-tag"></i> {{ model.shortType }}
            </div>
            <div class="item-meta mt-1">Тип модели</div>
          </div>
        </div>

        <hr class="opacity-25 mt-4" />

        <div class="mt-3">
          <h5 class="fw-600 mb-3">Использование</h5>
          <pre class="p-3 rounded-3" style="background:rgba(15,23,42,0.06);font-size:0.85rem;overflow-x:auto"><code>import requests
response = requests.post(
    "http://localhost:3001/api/model/{{ model.id }}/infer",
    json={"input": "your input here"}
)
print(response.json())</code></pre>
        </div>
      </div>
    </LoadingState>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useLike } from '@/composables/useLike'
import { getModelById } from '@/api/models'
import LoadingState from '@/components/LoadingState.vue'

const route = useRoute()
const { data, loading, error, execute } = useApi(getModelById)
const model = ref(null)
watch(data, (v) => { if (v) model.value = v })

const { toggle, isLiked } = useLike('liked_models')

onMounted(() => execute(route.params.id))
</script>
