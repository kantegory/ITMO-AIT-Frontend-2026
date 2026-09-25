<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { dictionaries } from '@/utils/dictionaries'
import { useFetch } from '@/composables/useFetch'
import { usePageTitle } from '@/composables/usePageTitle'

const route = useRoute()
const activeTab = ref('card')

const { data: model, error: errorMsg, isLoading, execute } = useFetch()

usePageTitle(computed(() => model.value?.name))

onMounted(() => {
  execute(`/models/${route.params.id}`)
})
</script>

<template>
  <div v-if="model">
    <section class="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-3 gap-3">
      <div>
        <h1 class="display-5 fw-bold mb-1">
          <span class="text-blunted">{{ model.author }} /</span> {{ model.name }}
        </h1>
        <p class="text-blunted fs-5">{{ model.description }}</p>
      </div>
      
      <article class="d-flex align-items-center gap-2 rounded-pill flex-shrink-0">
        <img :src="model.authorAvatar || 'https://placekittens.com/32/32'" alt="Аватар автора" class="rounded-circle" width="32" height="32">
        <div>
          <div class="small text-blunted">Создатель</div>
          <a href="#" class="text-decoration-none text-contrast">{{ model.author }}</a>
        </div>
      </article>
    </section>

    <section class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-2 mb-3">
      <div class="d-flex flex-wrap gap-2">
        <span v-if="model.task" class="badge rounded-pill text-bg-primary fs-6 fw-normal">{{ dictionaries.task[model.task] || model.task }}</span>
        <span v-if="model.framework" class="badge rounded-pill text-bg-secondary fs-6 fw-normal">{{ dictionaries.framework[model.framework] || model.framework }}</span>
        <span v-if="model.license" class="badge rounded-pill border text-contrast fs-6 fw-normal">{{ dictionaries.license[model.license] || model.license }}</span>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-dark d-flex align-items-center gap-2 rounded-pill fw-normal" type="button">
          <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#star"></use></svg> Star
          <span class="badge bg-secondary rounded-pill">{{ model.stars || 0 }}</span>
        </button>
        
        <button class="btn btn-outline-dark d-flex align-items-center gap-2 rounded-pill fw-normal" type="button">
          <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#diagram-2"></use></svg> Fork
          <span class="badge bg-secondary rounded-pill">{{ model.forks || 0 }}</span>
        </button>

        <button class="btn bg-primary text-white d-flex align-items-center gap-2 rounded-pill fw-normal" type="button" data-bs-toggle="modal" data-bs-target="#useCodeModal">
          <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#code-slash"></use></svg> Use in Code
        </button>

        <div class="dropdown">
          <button class="btn btn-outline-secondary rounded-circle" type="button" data-bs-toggle="dropdown" aria-label="Открыть меню">
            <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#three-dots"></use></svg>
          </button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" type="button"><svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#bookmark"></use></svg>Добавить в Bookmarks</button></li>
            <li><button class="dropdown-item" type="button"><svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#share"></use></svg>Поделиться</button></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger" type="button"><svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#flag"></use></svg>Пожаловаться</button></li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button class="nav-link text-contrast" :class="{ active: activeTab === 'card' }" @click="activeTab = 'card'">Карточка модели</button>
        </li>
        <li class="nav-item">
          <button class="nav-link text-contrast" :class="{ active: activeTab === 'discussions' }" @click="activeTab = 'discussions'">Обсуждения</button>
        </li>
        <li class="nav-item">
          <button class="nav-link text-contrast" :class="{ active: activeTab === 'artifacts' }" @click="activeTab = 'artifacts'">Файлы и артефакты</button>
        </li>
      </ul>

      <div class="tab-content p-4 border border-top-0 rounded-bottom">
        
        <div v-show="activeTab === 'card'">
          <h2 class="h3 fw-bold mb-3">Описание модели</h2>
          <div v-html="model.longDescription || model.description" class="mb-4"></div>
          
          <template v-if="model.usageExampleCode">
            <h3 class="h4 fw-bold mt-4 mb-3">Пример использования</h3>
            <p>Вы можете легко запустить модель на Python, используя встроенный интерфейс библиотеки <code>ultralytics</code>.</p>
            <pre class="code-inline-block"><code>{{ model.usageExampleCode }}</code></pre>
          </template>
          
          <template v-if="model.metrics">
            <h3 class="h4 fw-bold mt-4 mb-3">Метрики</h3>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Модель</th>
                    <th>Размер</th>
                    <th>mAP</th>
                    <th>Параметры</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in model.metrics" :key="m.model">
                    <td>{{ m.model }}</td>
                    <td>{{ m.size }}</td>
                    <td>{{ m.map }}</td>
                    <td>{{ m.params }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>

        <div v-show="activeTab === 'discussions'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h4 fw-bold">Обсуждения</h2>
            <button class="btn bg-primary text-white" type="button">Создать тему</button>
          </div>
          <ul class="list-group list-group-flush" v-if="model.discussions?.length">
            <li class="list-group-item py-3" v-for="d in model.discussions" :key="d.title">
              <div class="d-flex justify-content-between">
                <h3 class="h6 mb-1 fw-bold">{{ d.title }}</h3>
                <small class="text-blunted">{{ d.time }}</small>
              </div>
              <p class="mb-1 text-blunted small">{{ d.content }}</p>
            </li>
          </ul>
          <p class="text-blunted" v-else>Обсуждений пока нет.</p>
        </div>

        <div v-show="activeTab === 'artifacts'">
          <h2 class="h4 fw-bold mb-3">Файлы модели</h2>
          <div class="table-responsive" v-if="model.artifacts?.length">
            <table class="table">
              <thead>
                <tr>
                  <th>Имя файла</th>
                  <th>Размер</th>
                  <th>Обновлено</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in model.artifacts" :key="a.name">
                  <td><svg class="svg-icon text-blunted me-2" aria-hidden="true"><use :href="`/icons.svg#${a.icon || 'file-earmark-code'}`"></use></svg> {{ a.name }}</td>
                  <td>{{ a.size }}</td>
                  <td>{{ a.updated }}</td>
                  <td><button class="btn"><svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#download"></use></svg></button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-blunted" v-else>Файлы отсутствуют.</p>
        </div>

      </div>
    </section>

    <div class="modal fade" id="useCodeModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold"><svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#code-slash"></use></svg> Использование модели</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть окно"></button>
          </div>
          <div class="modal-body p-4">
            <select class="form-select mb-4 fw-semibold border-secondary">
              <option v-for="opt in model.runtimeOptions || []" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <pre class="code-inline-block"><code>{{ model.modalCodeSnippet || model.usageExampleCode || 'Код не предоставлен' }}</code></pre>
          </div>
        </div>
      </div>
    </div>

  </div>
  
  <div v-else-if="errorMsg" class="alert alert-danger mt-4">{{ errorMsg }}</div>
  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
  </div>
</template>