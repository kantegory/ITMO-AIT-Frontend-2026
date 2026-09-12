<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useTaskStore } from '@/stores/task'
import useRequest from '@/composables/useRequest'
import useDocumentTitle from '@/composables/useDocumentTitle'

import BaseLayout from '@/layouts/BaseLayout.vue'
import AnnotationHeader from '@/components/annotation/AnnotationHeader.vue'
import TaskProgress from '@/components/annotation/TaskProgress.vue'
import ImageClassificationTask from '@/components/annotation/tasks/ImageClassificationTask.vue'
import DetectionTask from '@/components/annotation/tasks/DetectionTask.vue'
import NerTask from '@/components/annotation/tasks/NerTask.vue'
import TextClassificationTask from '@/components/annotation/tasks/TextClassificationTask.vue'

const TASKS = {
  'image-classification': { component: ImageClassificationTask, narrow: false },
  detection: { component: DetectionTask, narrow: false },
  ner: { component: NerTask, narrow: true },
  'text-classification': { component: TextClassificationTask, narrow: true },
}

const route = useRoute()
const store = useTaskStore()

const { loading, error, run: loadTask } = useRequest(store.loadTask)

watch(() => route.params.id, (id) => loadTask(id), { immediate: true })

useDocumentTitle(() => store.order?.title)

const task = computed(() => TASKS[store.order?.taskType])

const accepting = ref(false)

async function acceptOrder() {
  accepting.value = true

  try {
    await store.acceptOrder()
  } catch {
    alert('Не удалось принять заказ: сервер недоступен')
  } finally {
    accepting.value = false
  }
}

const saving = ref(false)

async function submitResult(value) {
  saving.value = true

  try {
    await store.submitResult(value)
  } catch {
    alert('Не удалось сохранить результат: сервер недоступен')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <base-layout>
    <div v-if="loading" class="container py-4">
      <p class="text-muted mb-0">Загрузка...</p>
    </div>
    <div v-else-if="error || !store.order" class="container py-4">
      <p class="text-muted mb-0">
        Заказ не найден или сервер недоступен.
        <router-link :to="{ name: 'home' }">Выбрать заказ</router-link>
      </p>
    </div>
    <template v-else>
      <annotation-header :title="store.order.title" :description="store.order.instructions" />

      <main class="py-4">
        <div class="container" :style="task.narrow ? { maxWidth: '780px' } : null">
          <div v-if="!store.accepted" class="text-center">
            <p class="text-muted">Чтобы приступить к разметке, сначала примите заказ.</p>
            <button type="button" class="btn btn-primary btn-lg" :disabled="accepting" @click="acceptOrder">
              Принять
            </button>
          </div>
          <div v-else-if="!store.currentDatapoint" class="text-center">
            <p class="text-muted">Все дата поинты размечены.</p>
            <router-link class="btn btn-primary" :to="{ name: 'home' }">Выбрать другой заказ</router-link>
          </div>
          <template v-else>
            <task-progress :current="store.progress.current" :total="store.progress.total" />
            <component
              :is="task.component"
              :key="store.currentDatapoint.id"
              :datapoint="store.currentDatapoint"
              :labels="store.order.labels"
              :saving="saving"
              @submit="submitResult"
            />
          </template>
        </div>
      </main>
    </template>
  </base-layout>
</template>
