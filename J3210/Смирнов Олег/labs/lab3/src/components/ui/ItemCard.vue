<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import SvgIcon from '@/components/ui/SvgIcon.vue';
import { useFormatCount } from '@/composables/useFormatCount';

const props = defineProps({
  item: { type: Object, required: true },
  type: { type: String, required: true }, // 'model' | 'dataset'
  layout: { type: String, default: 'grid' }, // 'grid' | 'list'
});

const { formatCount } = useFormatCount();

const isModel = computed(() => props.type === 'model');
const detailRoute = computed(() => ({
  name: isModel.value ? 'model-detail' : 'dataset-detail',
  params: { id: props.item.id },
}));
const colClass = computed(() =>
  props.layout === 'grid' ? 'col-md-6 col-lg-4' : 'col-12',
);
const cardClass = computed(() => (props.layout === 'grid' ? 'card h-100' : 'card'));
</script>

<template>
  <div :class="colClass">
    <div :class="cardClass">
      <div class="card-body">
        <h5 class="card-title" :class="{ 'mb-1': layout === 'list' }">
          <RouterLink :to="detailRoute">{{ item.slug }}</RouterLink>
        </h5>
        <p class="card-text small" :class="{ 'mb-2': layout === 'list' }">
          {{ item.description }}
        </p>
        <div class="d-flex flex-wrap gap-1" :class="layout === 'grid' ? 'mb-3' : 'mb-2'">
          <span class="badge badge-task">{{ item.task }}</span>
          <span v-if="isModel" class="badge badge-framework">{{ item.framework }}</span>
          <span v-else class="badge badge-license">{{ item.license }}</span>
        </div>
        <div class="d-flex gap-3 text-muted small">
          <span>
            <SvgIcon name="star-fill" class-name="icon text-warning" />
            {{ formatCount(item.stars) }}
          </span>
          <span>
            <SvgIcon name="download" />
            {{ formatCount(item.downloads) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
