<script setup>
import { ref } from 'vue'
import { useProjects } from '@/composables/useProjects.js'
import { getUserName } from '@/stores/auth.js'

const props = defineProps({ project: Object })

const { updateProject } = useProjects()
const newText = ref('')

function addMessage() {
  const text = newText.value.trim()
  if (!text) return

  updateProject(props.project.id, (p) => {
    p.discussion.unshift({
      author: getUserName(),
      time: 'Только что',
      text,
    })
  })

  newText.value = ''
}
</script>

<template>
  <div class="modal-editor-list">
    <div class="modal-editor-card">
      <div class="modal-section-title">Новое сообщение</div>
      <div class="modal-caption mb-3">Сообщение добавляется в обсуждение выбранного проекта и сразу отображается на странице.</div>
      <textarea
        class="form-control modal-textarea"
        placeholder="Напишите сообщение для команды"
        v-model="newText"
      ></textarea>
      <div class="d-grid mt-3">
        <button class="btn btn-primary" type="button" @click="addMessage">Добавить сообщение</button>
      </div>
    </div>
    <div class="modal-editor-card">
      <div class="modal-section-title">Последние сообщения</div>
      <div class="stack-list">
        <article v-for="(item, i) in project.discussion" :key="i" class="discussion-card">
          <div class="fw-bold text-wrap-anywhere" :title="item.author">{{ item.author }}</div>
          <div class="note-meta mb-2">{{ item.time }}</div>
          <p class="mb-0 text-wrap-anywhere">{{ item.text }}</p>
        </article>
        <div v-if="!project.discussion.length" class="empty-pane">Сообщений пока нет.</div>
      </div>
    </div>
  </div>
</template>
