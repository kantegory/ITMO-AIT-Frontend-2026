<template>
  <div class="note-item" role="article" :aria-label="`Заметка: ${note.title}`">
    <div class="d-flex justify-content-between align-items-start mb-1">
      <strong style="font-size:.875rem;">✏️ {{ note.title }}</strong>
      <div class="d-flex align-items-center gap-2">
        <span style="font-size:.75rem;color:var(--text-light);" aria-hidden="true">{{ note.date }}</span>
        <button
          @click="$emit('delete', note.id)"
          :aria-label="`Удалить заметку «${note.title}»`"
          style="background:none;border:none;color:var(--text-light);cursor:pointer;padding:0;font-size:.9rem;line-height:1;">
          <i class="bi bi-x" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div v-if="note.dest" style="font-size:.75rem;color:var(--accent);margin-bottom:.2rem;">
      {{ note.dest }}
    </div>
    <p v-if="note.text" style="font-size:.82rem;color:var(--text-muted);margin:0;">
      {{ note.text }}
    </p>
  </div>
</template>

<script setup>
defineProps({ note: { type: Object, required: true } })
defineEmits(['delete'])
</script>
