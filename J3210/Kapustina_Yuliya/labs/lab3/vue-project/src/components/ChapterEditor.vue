<template>
  <div class="chapter-card">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <input
          type="text"
          class="form-control form-control-sm w-50"
          v-model="chapter.title"
          placeholder="Название главы"
        />
        <button
          type="button"
          class="btn btn-danger btn-sm"
          @click="$emit('remove')"
          :disabled="!canRemove"
        >
          Удалить
        </button>
      </div>
      <div class="card-body">
        <div class="toolbar mb-2">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="formatText('bold')"
          >
            <i class="bi bi-type-bold"></i>
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="formatText('italic')"
          >
            <i class="bi bi-type-italic"></i>
          </button>
        </div>
        <textarea
          ref="textareaRef"
          class="form-control chapter-content"
          v-model="chapter.content"
          rows="12"
          placeholder="Напишите текст главы..."
          style="font-family: monospace; white-space: pre-wrap;"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  chapter: {
    type: Object,
    required: true
  },
  canRemove: {
    type: Boolean,
    default: true
  }
})

defineEmits(['remove'])

const textareaRef = ref(null)

function formatText(type) {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  let selectedText = text.substring(start, end)
  let formattedText = ''

  switch (type) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
  }

  const newText = text.substring(0, start) + formattedText + text.substring(end)
  props.chapter.content = newText
  
  textarea.focus()
  textarea.setSelectionRange(
    start + 2,
    start + formattedText.length - 2
  )
}
</script>