<template>
  <RouterLink :to="to" class="item-card">
    <div class="item-badge">
      <i :class="iconClass"></i> {{ item.tagLabel || item.badge }}
    </div>
    <div class="item-title">{{ item.title }}</div>
    <div class="item-meta" v-if="item.extra1">{{ item.extra1 }}</div>
    <div class="item-desc">{{ item.description }}</div>
    <div class="item-footer">
      <div class="item-stats">
        <span><i class="bi bi-download"></i> {{ item.downloads ?? item.runs ?? 0 }}</span>
        <span>
          <button
            class="like-btn"
            :class="{ liked: isLikedItem }"
            @click.prevent="$emit('toggle-like', item.id)"
          >
            <i class="bi bi-heart-fill"></i> {{ item.likes }}
          </button>
        </span>
      </div>
      <span v-if="item.badge" class="tag-pill">{{ item.badge }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  to: { type: [String, Object], required: true },
  isLikedItem: { type: Boolean, default: false }
})

defineEmits(['toggle-like'])

const iconClass = computed(() => {
  const cat = (props.item.category || '').toLowerCase()
  if (cat === 'nlp') return 'bi bi-chat-text'
  if (cat === 'cv') return 'bi bi-camera'
  if (cat === 'audio') return 'bi bi-mic'
  if (cat === 'gen') return 'bi bi-stars'
  if (cat === 'tabular') return 'bi bi-table'
  if (cat === 'medical') return 'bi bi-heart-pulse'
  if (cat === 'video') return 'bi bi-camera-video'
  if (cat === 'text') return 'bi bi-file-text'
  return 'bi bi-box'
})
</script>
