<script setup>
import NoteCard from './NoteCard.vue'

defineProps({
  notes: { type: Array, required: true },
  hasQuery: { type: Boolean, default: false },
})

defineEmits(['toggle-completed', 'toggle-pinned', 'update', 'delete', 'reset-filters'])
</script>

<template>
  <TransitionGroup v-if="notes.length" name="notes" tag="div" class="note-list">
    <NoteCard
      v-for="note in notes"
      :key="note.id"
      :note="note"
      @toggle-completed="$emit('toggle-completed', $event)"
      @toggle-pinned="$emit('toggle-pinned', $event)"
      @update="$emit('update', $event)"
      @delete="$emit('delete', $event)"
    />
  </TransitionGroup>

  <div v-else class="empty-state">
    <span class="empty-illustration" aria-hidden="true">⌕</span>
    <h3>{{ hasQuery ? 'Ничего не найдено' : 'Заметок пока нет' }}</h3>
    <p>
      {{
        hasQuery
          ? 'Измените запрос или сбросьте выбранный фильтр.'
          : 'Создайте первую заметку с помощью формы слева.'
      }}
    </p>
    <button v-if="hasQuery" class="secondary-button" type="button" @click="$emit('reset-filters')">
      Сбросить фильтры
    </button>
  </div>
</template>
