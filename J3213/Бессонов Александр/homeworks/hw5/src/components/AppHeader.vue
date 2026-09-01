<script setup>
defineProps({
  theme: { type: String, required: true },
  total: { type: Number, required: true },
})

defineEmits(['toggle-theme'])
</script>

<template>
  <header class="app-header">
    <a class="brand" href="#pageTitle" aria-label="Т-Пульс Notes — к началу страницы">
      <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>Т-Пульс <strong>Notes</strong></span>
    </a>

    <div class="header-context">
      <span class="status-dot" aria-hidden="true"></span>
      <span>{{ total }} {{ total === 1 ? 'заметка' : 'заметки' }}</span>
    </div>

    <nav class="header-actions" aria-label="Действия приложения">
      <a class="header-link" href="#newNote">Новая заметка</a>
      <button
        class="icon-button"
        type="button"
        :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
        :title="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
        @click="$emit('toggle-theme')"
      >
        <span aria-hidden="true">{{ theme === 'dark' ? '☀' : '◐' }}</span>
      </button>
    </nav>
  </header>
</template>
