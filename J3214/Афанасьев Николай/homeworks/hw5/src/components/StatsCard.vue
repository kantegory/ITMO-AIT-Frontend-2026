<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  sub:   { type: String, default: '' },
})
</script>

<template>
  <div class="stat-card">
    <p class="stat-label">{{ label }}</p>
    <p class="stat-value">{{ value }}</p>
    <p v-if="sub" class="stat-sub">{{ sub }}</p>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  transition: background 0.25s, border-color 0.25s;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  margin-top: 6px;
  line-height: 1;
}

.stat-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 6px;
}
</style>
