<script setup>
import { computed } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
  },
  favoriteActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-favorite'])

const hubUrl = computed(() => {
  const path = encodeURIComponent(props.resource.id).replace(/%2F/g, '/')
  return props.resourceType === 'model'
    ? `https://huggingface.co/${path}`
    : `https://huggingface.co/datasets/${path}`
})

const chips = computed(() => {
  const first = props.resourceType === 'model'
    ? props.resource.pipelineTag
    : props.resource.taskCategories?.[0]
  return [first, props.resource.license, ...(props.resource.tags || []).slice(0, 4)].filter(Boolean)
})
</script>

<template>
  <div class="hub-card">
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="d-flex gap-2 flex-wrap mb-3">
          <span v-for="chip in chips" :key="chip" class="chip">{{ chip }}</span>
        </div>

        <h1 class="fw-bold mb-2">{{ resource.title }}</h1>
        <p class="muted mb-3">{{ resource.description }}</p>

        <div class="d-flex gap-4 flex-wrap muted small mb-4">
          <span>Загрузки: {{ Number(resource.downloads || 0).toLocaleString('ru-RU') }}</span>
          <span>Лайки: {{ Number(resource.likes || 0).toLocaleString('ru-RU') }}</span>
          <span>
            Обновлено:
            {{ resource.updatedAt ? new Date(resource.updatedAt).toLocaleDateString('ru-RU') : 'дата не указана' }}
          </span>
        </div>

        <div class="d-flex gap-2 flex-wrap">
          <a class="btn btn-primary" :href="hubUrl" target="_blank" rel="noopener noreferrer">
            Открыть на Hugging Face
          </a>
          <button class="btn btn-light" type="button" @click="emit('toggle-favorite')">
            {{ favoriteActive ? 'Убрать из избранного' : 'В избранное' }}
          </button>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="inner-box">
          <h2 class="fs-5 fw-bold mb-3">Автор</h2>
          <div class="fw-semibold">{{ resource.author }}</div>
          <div class="muted small mt-2">Источник: Hugging Face Hub API</div>
        </div>
      </div>
    </div>
  </div>
</template>
