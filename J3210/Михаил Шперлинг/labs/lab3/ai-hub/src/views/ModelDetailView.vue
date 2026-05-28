<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import CommentList from '@/components/CommentList.vue'
import { modelsApi, datasetsApi } from '@/api'
import { useFileStore } from '@/composables/useFileStore'

const route = useRoute()
const type = route.params.type
const id = route.params.id

const item = ref(null)
const loading = ref(true)
const hasStarred = ref(false)
const activeTab = ref('desc')
const fileStore = useFileStore()

const installCode = computed(() => {
  if (!item.value) return ''
  const author = item.value.author || 'hub'
  return `pip install transformers\n\nmodel = from_pretrained("${author}/${item.value.title}")`
})

const api = type === 'datasets' ? datasetsApi : modelsApi

async function loadItem() {
  loading.value = true
  try {
    const res = await api.getById(id)
    item.value = res.data
  } catch {
    item.value = null
  } finally {
    loading.value = false
  }
}

async function toggleStar() {
  if (hasStarred.value) return
  hasStarred.value = true
  const newStars = (item.value.stars || 0) + 1
  item.value = { ...item.value, stars: newStars }
  await api.update(id, { stars: newStars })
}

async function downloadItem() {
  fileStore.download(type, id)
  const current = parseInt(item.value.downloads) || 0
  const newDownloads = current + 1
  item.value = { ...item.value, downloads: newDownloads }
  await api.update(id, { downloads: newDownloads })
}

onMounted(loadItem)
</script>

<template>
  <base-layout>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="!item" class="text-center mt-5">
      <h3>Элемент не найден</h3>
      <router-link to="/" class="btn btn-primary mt-3">На главную</router-link>
    </div>

    <div v-else>
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link :to="type === 'datasets' ? '/datasets' : '/'">
              {{ type === 'datasets' ? 'Датасеты' : 'Модели' }}
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ item.title }}</li>
        </ol>
      </nav>

      <div class="card px-4 py-3 mb-4">
        <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <h2 class="fw-bold mb-1">{{ item.title }}</h2>
            <p v-if="item.author" class="text-muted mb-0">Автор: @{{ item.author }}</p>
          </div>
          <div class="d-flex gap-2 flex-wrap align-items-center">
            <button
              @click="toggleStar"
              :disabled="hasStarred"
              class="btn btn-outline-secondary"
              :aria-label="`Поставить звезду (${item.stars || 0})`"
            >
              <svg class="svg-icon" :class="{ 'text-warning': hasStarred }" aria-hidden="true">
                <use :href="hasStarred ? '/sprite.svg#icon-star-fill' : '/sprite.svg#icon-star'"></use>
              </svg>
              <span class="ms-1">{{ item.stars || 0 }}</span>
            </button>
            <button
              @click="downloadItem"
              class="btn"
              :class="fileStore.get(type, id) ? 'btn-primary' : 'btn-outline-secondary'"
              aria-label="Скачать"
            >
              <svg class="svg-icon" aria-hidden="true"><use href="/sprite.svg#icon-download"></use></svg>
              <span class="ms-1">{{ fileStore.get(type, id) ? 'Скачать' : item.downloads || 0 }}</span>
            </button>
          </div>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'desc' }"
            @click="activeTab = 'desc'"
            role="tab"
          >Описание</button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'install' }"
            @click="activeTab = 'install'"
            role="tab"
          >Установка</button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'discuss' }"
            @click="activeTab = 'discuss'"
            role="tab"
          >Обсуждение</button>
        </li>
      </ul>

      <div v-if="activeTab === 'desc'" class="card p-4">
        <p>{{ item.desc }}</p>
        <div class="mt-3 d-flex flex-wrap gap-1">
          <span class="badge bg-primary">{{ item.task?.toUpperCase() }}</span>
          <span v-if="item.framework" class="badge bg-secondary">{{ item.framework }}</span>
          <span v-if="item.format" class="badge bg-secondary">{{ item.format?.toUpperCase() }}</span>
          <span class="badge bg-light text-dark border">{{ item.size || '—' }}</span>
        </div>
      </div>

      <div v-else-if="activeTab === 'install'" class="card p-4">
        <h6 class="fw-bold mb-3">Установка через pip</h6>
        <pre><code>{{ installCode }}</code></pre>
      </div>

      <div v-else-if="activeTab === 'discuss'" class="card p-4">
        <h6 class="fw-bold mb-3">Комментарии</h6>
        <comment-list :model-id="id" />
      </div>
    </div>
  </base-layout>
</template>
