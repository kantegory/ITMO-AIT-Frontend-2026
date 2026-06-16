<script setup>
import { onMounted, ref } from 'vue'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import CommentsSection from '@/components/CommentsSection.vue'
import ResourceHeader from '@/components/ResourceHeader.vue'
import { useComments } from '@/composables/useComments'
import { useFavorites } from '@/composables/useFavorites'
import { useResourceDetails } from '@/composables/useResourceDetails'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { resource: model, loading, error, loadModel } = useResourceDetails()
const { checkFavorite, toggleFavorite } = useFavorites()
const favoriteActive = ref(false)
const favoriteMessage = ref('')
const { comments, commentText, error: commentsError, loadComments, addComment } = useComments('model', props.id)

onMounted(async () => {
  await loadModel(props.id)
  await loadComments()
  favoriteActive.value = await checkFavorite('model', props.id)
})

async function handleFavorite() {
  favoriteMessage.value = ''
  try {
    const result = await toggleFavorite(model.value)
    favoriteActive.value = result.active
    favoriteMessage.value = result.active ? 'Добавлено в избранное.' : 'Удалено из избранного.'
  } catch (err) {
    favoriteMessage.value = err.message
  }
}
</script>

<template>
  <main class="container py-4 d-flex flex-column gap-4">
    <BaseLoader v-if="loading" />
    <BaseAlert v-else-if="error" type="danger">{{ error }}</BaseAlert>

    <template v-else-if="model">
      <ResourceHeader
        :resource="model"
        resource-type="model"
        :favorite-active="favoriteActive"
        @toggle-favorite="handleFavorite"
      />

      <BaseAlert v-if="favoriteMessage" type="info">{{ favoriteMessage }}</BaseAlert>

      <div class="row g-4">
        <div class="col-lg-8 d-flex flex-column gap-4">
          <div class="hub-card">
            <h2 class="fw-bold fs-4 mb-3">Быстрая интеграция</h2>
            <pre>from transformers import pipeline

pipe = pipeline(task="{{ model.pipelineTag || 'text-classification' }}", model="{{ model.id }}")
result = pipe("Входные данные")
print(result)</pre>
          </div>

          <CommentsSection
            v-model:comment-text="commentText"
            :comments="comments"
            :error="commentsError"
            @submit="addComment"
          />
        </div>

        <aside class="col-lg-4 d-flex flex-column gap-4">
          <div class="hub-card">
            <h2 class="fw-bold fs-4 mb-3">Теги</h2>
            <div v-if="model.tags.length" class="d-flex gap-2 flex-wrap">
              <span v-for="tag in model.tags" :key="tag" class="chip">{{ tag }}</span>
            </div>
            <div v-else class="muted">Нет тегов.</div>
          </div>
        </aside>
      </div>
    </template>
  </main>
</template>
