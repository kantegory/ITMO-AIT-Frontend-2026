<template>
  <div class="bg-light min-vh-100">
    <AppNavbar />
    <main class="container my-4" id="main-content">
      <h1 class="h4 mb-4">Сообщество</h1>

      <div class="row g-4">
        <div class="col-md-7">
          <div class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h6 mb-0">Обсуждения</h2>
                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#newTopicModal">
                  Создать тему
                </button>
              </div>
              <ul v-if="topics.length" class="list-group list-group-flush">
                <TopicItem v-for="topic in topics" :key="topic.id" :topic="topic" />
              </ul>
              <EmptyState v-else title="Тем пока нет" />
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="card">
            <div class="card-body">
              <h2 class="h6 mb-3">FAQ</h2>
              <div class="accordion" id="faqAccordion">
                <FaqItem v-for="faq in faqs" :key="faq.id" :faq="faq" />
              </div>
              <EmptyState v-if="!faqs.length" title="FAQ пуст" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модалка новой темы -->
    <div class="modal fade" id="newTopicModal" tabindex="-1" aria-labelledby="newTopicModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newTopicModalLabel">Новая тема</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form id="new-topic-form" @submit.prevent="handleCreateTopic">
              <div class="mb-3">
                <label class="form-label" for="topic-title">Заголовок темы</label>
                <input id="topic-title" type="text" class="form-control" v-model="newTitle" required />
              </div>
              <div class="mb-3">
                <label class="form-label" for="topic-body">Первое сообщение</label>
                <textarea id="topic-body" class="form-control" rows="3" v-model="newBody"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" form="new-topic-form" class="btn btn-primary">Создать тему</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import AppNavbar from '@/components/AppNavbar.vue'
import TopicItem from '@/components/TopicItem.vue'
import FaqItem from '@/components/FaqItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getTopics, createTopic } from '@/api/topics'
import { getFaqs } from '@/api/faqs'

const topics = ref([])
const faqs = ref([])
const newTitle = ref('')
const newBody = ref('')

onMounted(async () => {
  const [t, f] = await Promise.all([getTopics(), getFaqs()])
  topics.value = t.data
  faqs.value = f.data
})

async function handleCreateTopic() {
  if (!newTitle.value.trim()) return
  const { data } = await createTopic({
    title: newTitle.value.trim(),
    body: newBody.value.trim(),
    responses: 0,
    lastActivity: 'только что'
  })
  topics.value.push(data)
  newTitle.value = ''
  newBody.value = ''
  const modalEl = document.getElementById('newTopicModal')
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
  modal.hide()
}
</script>