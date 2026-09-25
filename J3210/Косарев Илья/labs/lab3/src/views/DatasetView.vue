<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { dictionaries } from '@/utils/dictionaries'
import { useFetch } from '@/composables/useFetch'
import { usePageTitle } from '@/composables/usePageTitle'

const route = useRoute()

const activeTab = ref('card') 

const { data: dataset, error: errorMsg, isLoading, execute } = useFetch()

usePageTitle(computed(() => dataset.value?.name))

onMounted(() => {
  execute(`/datasets/${route.params.id}`)
})
</script>

<template>
  <div v-if="dataset">
    <section class="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-3 gap-3">
      <div>
        <h1 class="display-5 fw-bold mb-1">
          <span class="text-blunted">{{ dataset.author }} /</span> {{ dataset.name }}
        </h1>
        <p class="text-blunted fs-5">{{ dataset.description }}</p>
      </div>
      
      <article class="d-flex align-items-center gap-2 rounded-pill flex-shrink-0">
        <img :src="dataset.authorAvatar || 'https://placekittens.com/32/32'" alt="Аватар автора" class="rounded-circle" width="32" height="32">
        <div>
          <div class="small text-blunted">Создатель</div>
          <a href="#" class="text-decoration-none text-contrast">{{ dataset.author }}</a>
        </div>
      </article>
    </section>

    <section class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-2 mb-3">
      <div class="d-flex flex-wrap gap-2">
        <span v-if="dataset.task" class="badge rounded-pill text-bg-primary fs-6 fw-normal">{{ dictionaries.task[dataset.task] || dataset.task }}</span>
        <span v-if="dataset.modality" class="badge rounded-pill text-bg-success fs-6 fw-normal">{{ dictionaries.modality[dataset.modality] || dataset.modality }}</span>
        <span v-if="dataset.format" class="badge rounded-pill text-bg-secondary fs-6 fw-normal">{{ dataset.format.toUpperCase() }}</span>
        <span v-if="dataset.license" class="badge rounded-pill border text-contrast fs-6 fw-normal">{{ dictionaries.license[dataset.license] || dataset.license }}</span>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-dark d-flex align-items-center gap-2 rounded-pill fw-normal" type="button">
          <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#star"></use></svg> Star
          <span class="badge bg-secondary rounded-pill">{{ dataset.stars || 0 }}</span>
        </button>
        
        <button class="btn btn-outline-dark d-flex align-items-center gap-2 rounded-pill fw-normal" type="button" >
          <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#diagram-2"></use></svg> Fork
          <span class="badge bg-secondary rounded-pill">{{ dataset.forks || 0 }}</span>
        </button>

        <button class="btn bg-primary text-white d-flex align-items-center gap-2 rounded-pill fw-normal" type="button" data-bs-toggle="modal" data-bs-target="#useCodeModal">
          <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#code-slash"></use></svg> Use Dataset
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
          <button class="nav-link text-contrast" :class="{ active: activeTab === 'card' }" @click="activeTab = 'card'">Карточка датасета</button>
        </li>
        <li class="nav-item">
          <button class="nav-link text-contrast" :class="{ active: activeTab === 'discussions' }" @click="activeTab = 'discussions'">Обсуждения</button>
        </li>
        <li class="nav-item">
          <button class="nav-link text-contrast" :class="{ active: activeTab === 'artifacts' }" @click="activeTab = 'artifacts'">Файлы датасета</button>
        </li>
      </ul>

      <div class="tab-content p-4 border border-top-0 rounded-bottom">
        
        <div v-show="activeTab === 'card'">
          <h2 class="h3 fw-bold mb-3">Описание датасета</h2>
          <div v-html="dataset.longDescription || dataset.description" class="mb-4"></div>
          
          <template v-if="dataset.usageExampleCode">
            <h3 class="h4 fw-bold mt-4 mb-3">Пример использования</h3>
            <p>Вы можете легко загрузить аннотации датасета с помощью библиотеки <code>pandas</code> для просмотра метаданных изображений.</p>
            <pre class="code-inline-block"><code>{{ dataset.usageExampleCode }}</code></pre>
          </template>
          
          <template v-if="dataset.structure">
            <h3 class="h4 fw-bold mt-4 mb-3">Структура данных</h3>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>file_name</th>
                    <th>width</th>
                    <th>height</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in dataset.structure" :key="s.id">
                    <td>{{ s.id }}</td>
                    <td>{{ s.file_name }}</td>
                    <td>{{ s.width }}</td>
                    <td>{{ s.height }}</td>
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
          <ul class="list-group list-group-flush" v-if="dataset.discussions?.length">
            <li class="list-group-item py-3" v-for="d in dataset.discussions" :key="d.title">
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
          <h2 class="h4 fw-bold mb-3">Архивы датасета</h2>
          <div class="table-responsive" v-if="dataset.artifacts?.length">
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
                <tr v-for="a in dataset.artifacts" :key="a.name">
                  <td><svg class="svg-icon text-blunted me-2" aria-hidden="true"><use :href="`/icons.svg#${a.icon || 'file-earmark-zip'}`"></use></svg> {{ a.name }}</td>
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
            <h5 class="modal-title fw-bold"><svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#code-slash"></use></svg> Загрузка датасета</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть окно"></button>
          </div>
          <div class="modal-body p-4">
            <select class="form-select mb-4 fw-semibold border-secondary">
              <option v-for="opt in dataset.runtimeOptions || []" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <pre class="code-inline-block"><code>{{ dataset.modalCodeSnippet || dataset.usageExampleCode || 'Код не предоставлен' }}</code></pre>
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