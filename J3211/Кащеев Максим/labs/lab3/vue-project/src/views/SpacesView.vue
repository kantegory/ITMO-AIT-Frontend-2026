<template>
  <div class="container-xl page-shell">
    <h1 class="page-title">Пространства</h1>
    <p class="page-subtitle">
      Интерактивные демо-пространства: запустите модель прямо в браузере и посмотрите результаты.
    </p>

    <SearchBar placeholder="Поиск пространств..." @search="(q) => (searchQuery = q)" />

    <LoadingState
      :loading="loading"
      :error="error"
      :empty="!filtered.length && !loading"
      empty-text="Пространства не найдены."
    >
      <div class="cards-grid">
        <div
          v-for="space in filtered"
          :key="space.id"
          class="item-card"
        >
          <div class="item-badge" style="background:rgba(129,140,248,0.1);color:#312e81;border-color:rgba(129,140,248,0.4)">
            <i class="bi bi-play-circle"></i> Space
          </div>
          <div class="item-title">{{ space.title }}</div>
          <div class="item-meta">{{ space.extra1 }}</div>
          <div class="item-desc">{{ space.description }}</div>
          <div class="item-footer">
            <div class="item-stats">
              <span><i class="bi bi-play me-1"></i>{{ space.runs }} запусков</span>
            </div>
            <button
              class="like-btn"
              :class="{ liked: isLiked(space.id) }"
              @click="toggle(space.id)"
            >
              <i class="bi bi-heart-fill"></i> {{ space.likes }}
            </button>
          </div>
          <div class="mt-2">
            <span class="tag-pill">{{ space.badge }}</span>
          </div>
        </div>
      </div>
    </LoadingState>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useFilters } from '@/composables/useFilters'
import { useLike } from '@/composables/useLike'
import { getSpaces } from '@/api/spaces'
import SearchBar from '@/components/SearchBar.vue'
import LoadingState from '@/components/LoadingState.vue'

const { data, loading, error, execute } = useApi(getSpaces)
const items = ref([])
watch(data, (v) => { if (v) items.value = v })

const { searchQuery, filtered } = useFilters(items, ['title', 'description', 'badge'])
const { toggle, isLiked } = useLike('liked_spaces')

onMounted(() => execute({}))
</script>
