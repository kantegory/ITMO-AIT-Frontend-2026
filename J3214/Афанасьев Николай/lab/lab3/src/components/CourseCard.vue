<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  course: { type: Object, required: true }
})

const router = useRouter()

const formattedPrice = computed(() =>
  props.course.price === 0
    ? 'Бесплатно'
    : new Intl.NumberFormat('ru-RU').format(props.course.price) + ' ₽'
)

function open() {
  router.push({ name: 'course', params: { id: props.course.id } })
}
</script>

<template>
  <article
    class="card"
    role="button"
    tabindex="0"
    @click="open"
    @keydown.enter="open"
    @keydown.space.prevent="open"
  >
    <div class="thumb" :style="{ background: course.thumbBg }">
      {{ course.emoji }}
    </div>

    <div class="body">
      <span class="badge">{{ course.level }}</span>
      <h3 class="title">{{ course.title }}</h3>
      <p class="meta">{{ course.author }} · {{ course.lessons }} уроков</p>
      <span class="tag">{{ course.subject }}</span>

      <div class="footer">
        <span class="rating">★ {{ (course.rating || 0).toFixed(1) }}</span>
        <span class="price">{{ formattedPrice }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s, background 0.25s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(83, 74, 183, 0.3);
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
  background: var(--surface);
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
