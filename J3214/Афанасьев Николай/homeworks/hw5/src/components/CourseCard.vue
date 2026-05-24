<script setup>
import { computed } from 'vue'

const props = defineProps({
  title:    { type: String,  required: true },
  author:   { type: String,  required: true },
  subject:  { type: String,  required: true },
  level:    { type: String,  required: true },
  price:    { type: Number,  default: 0 },
  lessons:  { type: Number,  default: 0 },
  rating:   { type: Number,  default: 0 },
  emoji:    { type: String,  default: '📚' },
  thumbBg:  { type: String,  default: '#edeaf8' },
})

const emit = defineEmits(['select'])

const formattedPrice = computed(() =>
  props.price === 0
    ? 'Бесплатно'
    : new Intl.NumberFormat('ru-RU').format(props.price) + ' ₽'
)
</script>

<template>
  <article
    class="course-card"
    role="button"
    tabindex="0"
    @click="emit('select', title)"
    @keydown.enter="emit('select', title)"
  >
    <div class="thumb" :style="{ background: thumbBg }">
      {{ emoji }}
    </div>

    <div class="body">
      <span class="badge">{{ level }}</span>
      <h3 class="title">{{ title }}</h3>
      <p class="meta">{{ author }} · {{ lessons }} уроков</p>
      <span class="tag">{{ subject }}</span>

      <div class="footer">
        <span class="rating">★ {{ rating.toFixed(1) }}</span>
        <span class="price">{{ formattedPrice }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.course-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(83, 74, 183, 0.25);
}

.thumb {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
}

.body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  background: var(--primary-subtle);
  color: var(--primary);
  width: fit-content;
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.4;
}

.meta {
  font-size: 12px;
  color: var(--muted);
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  color: var(--muted);
  width: fit-content;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 6px;
}

.rating {
  font-size: 12px;
  font-weight: 800;
  color: var(--text);
}

.price {
  font-size: 13px;
  font-weight: 900;
  color: var(--primary);
}
</style>
