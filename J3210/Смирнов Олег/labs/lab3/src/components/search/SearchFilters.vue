<script setup>
import SvgIcon from '@/components/ui/SvgIcon.vue';

const query = defineModel('query', { type: String, default: '' });
const sort = defineModel('sort', { type: String, default: '' });

defineProps({
  availableTags: { type: Array, required: true },
  activeTags: { type: Set, required: true },
});

const emit = defineEmits(['toggle-tag']);
</script>

<template>
  <div class="input-group search-box mb-3">
    <span class="input-group-text bg-transparent"><SvgIcon name="search" /></span>
    <label for="searchInput" class="visually-hidden">Поиск</label>
    <input
      id="searchInput"
      type="search"
      class="form-control"
      placeholder="Название, задача или автор…"
      v-model="query"
    />
  </div>

  <div class="d-flex align-items-center gap-3 mb-2 flex-wrap">
    <label for="sortSelect" class="visually-hidden">Сортировка</label>
    <select id="sortSelect" class="form-select form-select-sm w-auto" v-model="sort">
      <option value="">Сортировка</option>
      <option value="stars">По звёздочкам</option>
      <option value="downloads">По загрузкам</option>
    </select>
    <div v-if="availableTags.length" class="d-flex flex-wrap gap-2">
      <button
        v-for="tag in availableTags"
        :key="tag"
        type="button"
        class="badge tag-filter-btn"
        :class="activeTags.has(tag) ? 'badge-task' : 'badge-muted'"
        @click="emit('toggle-tag', tag)"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>
