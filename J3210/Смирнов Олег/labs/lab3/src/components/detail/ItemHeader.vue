<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import StatButton from '@/components/ui/StatButton.vue';

const props = defineProps({
  item: { type: Object, required: true },
  type: { type: String, required: true }, // 'model' | 'dataset'
});

const isModel = computed(() => props.type === 'model');
const listRoute = computed(() => (isModel.value ? '/models' : '/datasets'));
const listLabel = computed(() => (isModel.value ? 'Модели' : 'Датасеты'));

// у моделей есть поле forks (которого нет в API, демо-фолбэк)
const forks = computed(() => Math.round(props.item.stars * 0.12));
</script>

<template>
  <header class="mb-4">
    <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb small mb-2">
            <li class="breadcrumb-item">
              <RouterLink :to="listRoute">{{ listLabel }}</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ item.slug }}</li>
          </ol>
        </nav>
        <h1 class="h3 mb-1">{{ item.slug }}</h1>
        <p class="text-muted mb-2">Автор: <span>{{ item.author }}</span></p>
        <div class="d-flex flex-wrap gap-1">
          <span class="badge badge-task">{{ item.task }}</span>
          <span v-if="isModel" class="badge badge-framework">{{ item.framework }}</span>
          <span class="badge badge-license">{{ item.license || '—' }}</span>
        </div>
      </div>
      <div class="d-flex gap-2">
        <StatButton
          icon="star"
          icon-active="star-fill"
          :count="item.stars"
          label="Поставить звезду"
        />
        <StatButton
          v-if="isModel"
          icon="diagram-2"
          :count="forks"
          label="Форкнуть"
        />
      </div>
    </div>
  </header>
</template>
