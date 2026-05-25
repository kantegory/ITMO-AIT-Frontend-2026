<script setup>
defineProps({
  index:     { type: Number, required: true },
  completed: { type: Boolean, default: false },
  current:   { type: Boolean, default: false },
})
</script>

<template>
  <div class="lesson-item" :class="{ active: current, done: completed }">
    <div class="lesson-num" :class="{ done: completed }">
      {{ completed ? '✓' : index }}
    </div>
    <div>
      <div :style="{ fontSize: '13px', color: current ? 'var(--primary)' : 'var(--text)', fontWeight: current ? 500 : 400 }">
        Урок {{ index }}
      </div>
      <div style="font-size:11px;color:var(--muted-2);">~15 мин</div>
    </div>
  </div>
</template>
