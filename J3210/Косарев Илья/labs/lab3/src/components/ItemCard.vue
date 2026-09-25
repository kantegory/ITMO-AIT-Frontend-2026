<script setup>
import { defineProps, computed } from 'vue' 
import { dictionaries } from '../utils/dictionaries'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const isDataset = computed(() => props.type === 'dataset')
const iconId = computed(() => isDataset.value ? 'database' : 'cpu')
const linkPath = computed(() => isDataset.value ? `/dataset/${props.item.id}` : `/model/${props.item.id}`)
</script>

<template>
  <div class="col-12 col-md-6 col-xl-4">
    <article class="card h-100 border-2">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-2">
          <router-link :to="linkPath" class="text-decoration-none text-contrast h5 mb-0 stretched-link">
            {{ item.name }}
          </router-link>
          <svg class="svg-icon text-blunted" aria-hidden="true"><use :href="`/icons.svg#${iconId}`"></use></svg>
        </div>
        
        <div class="mb-2 d-flex flex-wrap gap-2">
          <span v-if="item.task" class="badge bg-primary flex-shrink-0">
            {{ dictionaries.task[item.task] || item.task }}
          </span>
          
          <template v-if="isDataset">
            <span v-if="item.modality" class="badge bg-success flex-shrink-0">
              {{ dictionaries.modality[item.modality] || item.modality }}
            </span>
            <span v-if="item.format" class="badge bg-info text-contrast flex-shrink-0">
              {{ item.format }}
            </span>
          </template>
          
          <template v-else>
            <span v-if="item.framework" class="badge bg-secondary flex-shrink-0">
              {{ dictionaries.framework[item.framework] || item.framework }}
            </span>
          </template>
          
          <span v-if="item.license" class="badge border border-secondary text-contrast flex-shrink-0">
            {{ dictionaries.license[item.license] || item.license }}
          </span>
        </div>
        <p class="card-text text-blunted small">{{ item.description }}</p>
      </div>
      
      <div class="card-footer d-flex justify-content-end align-items-center">
        <small class="text-blunted me-2"><svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#eye-fill"></use></svg> {{ item.views || 0 }}</small>
        <small class="text-blunted me-2"><svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#chat-left-text-fill"></use></svg> {{ item.comments || 0 }}</small>
        <small class="text-blunted me-2"><svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#diagram-3-fill"></use></svg> {{ item.forks || 0 }}</small>
        <small class="text-blunted"><svg class="svg-icon text-warning" aria-hidden="true"><use href="/icons.svg#star-fill"></use></svg> {{ item.stars || 0 }}</small>
      </div>
    </article>
  </div>
</template>