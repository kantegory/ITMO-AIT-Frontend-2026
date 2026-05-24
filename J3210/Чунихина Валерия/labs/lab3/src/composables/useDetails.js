import { computed, ref, watchEffect } from 'vue'

import { fetchModelById } from '@/api/models'
import { localDetails } from '@/data/appData'

function prettifyTitle(modelId = '') {
  return modelId
    .split('/')
    .pop()
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function createRemoteDetails(modelId, remoteModel) {
  return {
    title: prettifyTitle(modelId),
    emoji: '🌿',
    author: modelId.split('/')[0],
    updatedAt: 'Данные с Hugging Face',
    stars: remoteModel.likes || 0,
    forks: remoteModel.downloads || 0,
    downloadsLabel: `Открыть на Hugging Face (${Number(remoteModel.downloads || 0).toLocaleString('ru-RU')} загрузок)`,
    breadcrumbs: ['Поиск', prettifyTitle(modelId)],
    verification: [
      { label: 'Модель найдена во внешнем API', value: '✔', tone: 'success' },
      { label: 'Карточка создана динамически', value: '✔', tone: 'success' }
    ],
    description: [
      remoteModel.cardData?.description || 'Описание модели получено из внешнего API Hugging Face.',
      `Библиотека: ${remoteModel.library_name || 'не указана'} • Pipeline: ${remoteModel.pipeline_tag || 'не указан'}.`
    ],
    metrics: [
      { label: 'Downloads', val: Number(remoteModel.downloads || 0).toLocaleString('ru-RU'), test: 'API', tone: 'default' },
      { label: 'Likes', val: String(remoteModel.likes || 0), test: 'Hugging Face', tone: 'accent' }
    ],
    codeSnippet: `from transformers import pipeline\n\npipe = pipeline("${remoteModel.pipeline_tag || 'text-classification'}", model="${modelId}")\nprint(pipe("AIBloom migration"))`,
    comments: [],
    info: [
      { label: 'Библиотека', value: remoteModel.library_name || 'Не указана', badge: 'model' },
      { label: 'Pipeline', value: remoteModel.pipeline_tag || 'Не указан' },
      { label: 'Автор', value: modelId.split('/')[0] }
    ]
  }
}

export function useDetails(route) {
  const detail = ref(null)
  const loading = ref(false)
  const error = ref('')
  const comments = ref([])

  watchEffect(async () => {
    const slug = route.params.slug?.toString()
    const remoteModelId = route.query.model?.toString()

    loading.value = true
    error.value = ''

    try {
      if (remoteModelId) {
        const remoteModel = await fetchModelById(remoteModelId)
        detail.value = createRemoteDetails(remoteModelId, remoteModel)
      } else if (slug && localDetails[slug]) {
        detail.value = localDetails[slug]
      } else {
        detail.value = null
        error.value = 'Карточка модели не найдена.'
      }

      comments.value = detail.value?.comments ? [...detail.value.comments] : []
    } catch (requestError) {
      console.error('Ошибка загрузки details:', requestError)
      error.value = 'Не удалось загрузить страницу модели.'
      detail.value = slug ? localDetails[slug] || null : null
      comments.value = detail.value?.comments ? [...detail.value.comments] : []
    } finally {
      loading.value = false
    }
  })

  const commentsCount = computed(() => comments.value.length)

  function addComment(text) {
    comments.value = [
      {
        id: `comment-${Date.now()}`,
        author: 'Вы',
        timeLabel: 'Только что',
        text
      },
      ...comments.value
    ]
  }

  return {
    detail,
    loading,
    error,
    comments,
    commentsCount,
    addComment
  }
}
