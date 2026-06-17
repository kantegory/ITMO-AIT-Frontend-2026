<script setup>
import { computed, ref } from 'vue'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const message = ref('')
const { toggleFavorite } = useFavorites()

const badge = computed(() => (props.item.resourceType === 'model' ? 'Модель' : 'Датасет'))
const subtitle = computed(() => (
  props.item.resourceType === 'model'
    ? props.item.pipelineTag
    : props.item.taskCategories?.[0] || 'Dataset'
))
const routeName = computed(() => (props.item.resourceType === 'model' ? 'model' : 'dataset'))

async function handleFavorite() {
  message.value = ''
  try {
    const result = await toggleFavorite(props.item)
    message.value = result.active ? 'Добавлено в избранное.' : 'Удалено из избранного.'
  } catch (error) {
    message.value = error.message
  }
}
</script>

<template>
  <article class="hub-card result-card h-100">
    <div class="d-flex gap-2 flex-wrap">
      <span class="pill">{{ badge }}</span>
      <span class="chip">{{ item.license }}</span>
    </div>

    <div>
      <h2 class="fw-bold fs-5 mb-2">{{ item.title }}</h2>
      <p class="muted mb-0 line-clamp">{{ item.description }}</p>
    </div>

    <div class="result-meta">
      <span>Автор: {{ item.author }}</span>
      <span>{{ subtitle || '—' }}</span>
    </div>

    <div class="result-meta">
      <span>Загрузки: {{ Number(item.downloads || 0).toLocaleString('ru-RU') }}</span>
      <span>Лайки: {{ Number(item.likes || 0).toLocaleString('ru-RU') }}</span>
    </div>

    <div v-if="message" class="small muted">{{ message }}</div>

    <div class="mt-auto d-flex gap-2 flex-wrap">
      <RouterLink class="btn btn-primary" :to="{ name: routeName, params: { id: item.id } }">
        Открыть
      </RouterLink>
      <button class="btn btn-light" type="button" @click="handleFavorite">В избранное</button>
    </div>
  </article>
</template>
